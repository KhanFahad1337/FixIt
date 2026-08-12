const ServiceProvider = require('../models/ServiceProvider');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const NoShowReport = require('../models/NoShowReport');
const { chat, parseJSON, isConfigured } = require('../utils/ai');

const PROFESSIONS = {
  electrician: { base: 45, kw: ['wire', 'electrical', 'circuit', 'switch', 'socket', 'light', 'fan', 'wiring', 'electric'] },
  plumber: { base: 40, kw: ['pipe', 'leak', 'drain', 'plumbing', 'faucet', 'sink', 'toilet', 'water heater', 'plumber'] },
  painter: { base: 35, kw: ['paint', 'wall', 'painting', 'color', 'repaint', 'plaster'] },
  'ac technician': { base: 50, kw: ['ac', 'air conditioner', 'cooling', 'freon', 'hvac', 'ventilation'] },
  carpenter: { base: 42, kw: ['wood', 'furniture', 'cabinet', 'door', 'shelf', 'repair wood', 'carpenter'] },
  cleaner: { base: 30, kw: ['clean', 'cleaning', 'maid', 'vacuum', 'dust', 'tidy'] },
};

function detectProfession(text) {
  const lower = text.toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const [profession, info] of Object.entries(PROFESSIONS)) {
    let score = 0;
    info.kw.forEach(kw => { if (lower.includes(kw)) score += kw.length; });
    if (score > bestScore) { bestScore = score; best = profession; }
  }
  return best;
}

function heuristicEstimate(text) {
  const profession = detectProfession(text);
  const info = profession ? PROFESSIONS[profession] : { base: 40 };
  const hoursMatch = text.toLowerCase().match(/(\d+)\s*(hour|hr|hourly)/);
  const hours = hoursMatch ? parseInt(hoursMatch[1]) : 2;
  const urgency = /urgent|emergency|asap|now/.test(text.toLowerCase()) ? 1.2 : 1;
  const low = Math.round(info.base * hours * 0.9 * urgency);
  const high = Math.round(info.base * hours * 1.3 * urgency);
  return {
    serviceType: profession || 'General Home Service',
    profession,
    estimatedHours: hours,
    priceRange: [low, high],
    baseRate: info.base,
    confidence: profession ? 0.85 : 0.4,
  };
}

exports.estimatePrice = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) return res.status(400).json({ message: 'Description is required' });

    if (isConfigured()) {
      const prompt = `You are a home-services pricing expert. Given the customer's job description, estimate:
1. serviceType (one of: electrician, plumber, painter, ac technician, carpenter, cleaner)
2. estimatedHours (number)
3. priceRange (array of two numbers: [min, max] in USD per hour based on typical market rates: electrician $45/hr, plumber $40/hr, painter $35/hr, AC tech $50/hr, carpenter $42/hr, cleaner $30/hr)
4. baseRate (number)
5. confidence (0 to 1)
Respond ONLY as valid JSON. Job: "${description}"`;
      const raw = await chat([{ role: 'user', content: prompt }], { json: true });
      const parsed = await parseJSON(raw);
      if (parsed) return res.json(parsed);
    }
    res.json(heuristicEstimate(description));
  } catch (error) {
    console.error('AI estimate error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.matchProviders = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) return res.status(400).json({ message: 'Description is required' });

    const providers = await ServiceProvider.find({ isApproved: true })
      .select('name profession description pricePerHour rating experience totalReviews isAvailable');

    if (!providers.length) return res.json([]);

    const profession = detectProfession(description);
    const lower = description.toLowerCase();

    let scored;
    if (isConfigured()) {
      const prompt = `You are a home-services matching expert. Score each provider 0-100 on how well they match this customer request.
Customer request: "${description}"
Providers (JSON array with _id, name, profession, description, pricePerHour, rating, experience, totalReviews, isAvailable):
${JSON.stringify(providers)}

For each provider, return JSON object: {"_id":"<provider _id>","score":<0-100>,"reason":"<1 short sentence>"}
Respond ONLY as a JSON array of those objects.`;
      const raw = await chat([{ role: 'user', content: prompt }], { json: true });
      const parsed = await parseJSON(raw);
      if (parsed && Array.isArray(parsed)) {
        const map = {};
        parsed.forEach(p => { map[p._id] = { score: p.score, reason: p.reason }; });
        scored = providers.map(provider => {
          const m = map[provider._id] || {};
          return { provider, matchScore: m.score ?? 50, matchReason: m.reason || 'Matches your request.' };
        });
      }
    }

    if (!scored) {
      const urgency = /urgent|emergency|asap|now|today/.test(lower) ? 8 : 0;
      scored = providers.map(provider => {
        let score = 0;
        if (profession && provider.profession.toLowerCase().includes(profession)) score += 40;
        const text = `${provider.name} ${provider.profession} ${provider.description || ''}`.toLowerCase();
        Object.entries(PROFESSIONS).forEach(([p, info]) => {
          if (text.includes(p)) score += info.kw.filter(kw => lower.includes(kw)).length * 2;
        });
        score += Math.min((provider.rating || 0) * 6, 25);
        score += Math.min(provider.experience || 0, 10);
        if (provider.isAvailable) score += 5;
        score += urgency;
        const matchReason = provider.profession.toLowerCase().includes(profession) || !profession
          ? 'Matches your requested service type.'
          : `Best available ${provider.profession} option.`;
        return { provider, matchScore: Math.min(Math.round(score), 100), matchReason };
      });
      scored.sort((a, b) => b.matchScore - a.matchScore);
    } else {
      scored.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }

    res.json(scored);
  } catch (error) {
    console.error('AI match error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.analyzeSentiment = async (req, res) => {
  try {
    const { providerId } = req.params;
    const reviews = await Review.find({ provider: providerId }).populate('user', 'name').sort('-createdAt');
    if (!reviews.length) return res.json({ overall: 'neutral', breakdown: { positive: 0, neutral: 0, negative: 0 }, reviews: [] });

    if (isConfigured()) {
      const prompt = `Classify each review's sentiment as "positive", "neutral", or "negative".
Reviews: ${JSON.stringify(reviews.map(r => ({ id: r._id, rating: r.rating, comment: r.comment })))}
Return JSON: {"reviews":[{"id":"...","sentiment":"..."}],"overall":"..."}`;
      const raw = await chat([{ role: 'user', content: prompt }], { json: true });
      const parsed = await parseJSON(raw);
      if (parsed && Array.isArray(parsed.reviews)) {
        const map = {};
        parsed.reviews.forEach(r => { map[r.id] = r.sentiment; });
        const breakdown = { positive: 0, neutral: 0, negative: 0 };
        const enriched = reviews.map(r => {
          const s = map[r._id] || (r.rating >= 4 ? 'positive' : r.rating === 3 ? 'neutral' : 'negative');
          breakdown[s]++;
          return { ...r.toObject(), sentiment: s };
        });
        return res.json({ overall: parsed.overall || (breakdown.positive >= breakdown.negative ? 'positive' : 'negative'), breakdown, reviews: enriched });
      }
    }

    const breakdown = { positive: 0, neutral: 0, negative: 0 };
    const enriched = reviews.map(r => {
      const s = r.rating >= 4 ? 'positive' : r.rating === 3 ? 'neutral' : 'negative';
      breakdown[s]++;
      return { ...r.toObject(), sentiment: s };
    });
    const overall = breakdown.positive >= breakdown.negative ? 'positive' : breakdown.negative > breakdown.neutral ? 'negative' : 'neutral';
    res.json({ overall, breakdown, reviews: enriched });
  } catch (error) {
    console.error('AI sentiment error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.summarizeProvider = async (req, res) => {
  try {
    const { providerId } = req.params;
    const provider = await ServiceProvider.findById(providerId);
    if (!provider) return res.status(404).json({ message: 'Provider not found' });

    const reviews = await Review.find({ provider: providerId }).select('rating comment').limit(20);

    const stats = {
      name: provider.name,
      profession: provider.profession,
      experience: provider.experience || 0,
      rating: provider.rating || 0,
      totalReviews: provider.totalReviews || 0,
      pricePerHour: provider.pricePerHour,
      reviews: reviews.map(r => ({ rating: r.rating, comment: r.comment })).slice(0, 10),
    };

    if (isConfigured()) {
      const prompt = `Write a 2-3 sentence professional summary of a service provider for a customer deciding whether to book them.
Provider data (JSON): ${JSON.stringify(stats)}
The summary should be positive but honest, mention their profession, experience, rating, and what customers say. No emojis.`;
      const raw = await chat([{ role: 'user', content: prompt }], { temperature: 0.5 });
      if (raw) return res.json({ summary: raw });
    }

    const highlight = reviews.find(r => r.comment && r.comment.trim())?.comment?.trim() || '';
    const quality = provider.rating >= 4.5 ? 'highly rated' : provider.rating >= 4 ? 'well rated' : 'rated';
    const summary = `${provider.name} is a ${quality} ${provider.profession.toLowerCase()} with ${provider.experience} years of experience${provider.totalReviews ? ` and ${provider.totalReviews} customer reviews` : ''}. They charge $${provider.pricePerHour}/hour.${highlight ? ` One customer said: "${highlight}"` : ''}`;
    res.json({ summary });
  } catch (error) {
    console.error('AI summary error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.noshowRisk = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: { $in: ['pending', 'confirmed'] } })
      .populate('user', 'name email')
      .populate('provider', 'name profession missedAppointments penaltyPoints')
      .sort('-createdAt')
      .limit(100);

    if (!bookings.length) return res.json([]);

    const results = await Promise.all(bookings.map(async (booking) => {
      const user = booking.user;
      const provider = booking.provider;

      const userHistory = await Booking.find({ user: booking.user, _id: { $ne: booking._id } })
        .select('status createdAt')
        .sort('-createdAt')
        .limit(20);
      const cancelled = userHistory.filter(b => b.status === 'cancelled').length;
      const completed = userHistory.filter(b => b.status === 'completed').length;

      const approvedNoShows = await NoShowReport.countDocuments({
        user: booking.user,
        status: 'approved',
        _id: { $ne: null },
      });

      const now = new Date();
      const hoursUntilBooking = (new Date(booking.date) - now) / 3600000;
      let score = 0;
      score += Math.min(approvedNoShows * 25, 50);
      score += Math.min(cancelled * 12, 40);
      if (completed === 0 && (userHistory.length - cancelled) === 0 && userHistory.length > 0) score += 10;
      if (hoursUntilBooking < 24) score += 15;
      if (provider && provider.missedAppointments >= 2) score += 10;
      score = Math.min(Math.round(score), 100);

      const level = score >= 60 ? 'high' : score >= 35 ? 'medium' : 'low';
      return {
        bookingId: booking._id,
        user: booking.user?.name || 'Unknown',
        provider: booking.provider?.name || 'Unknown',
        date: booking.date,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        totalAmount: booking.totalAmount,
        riskScore: score,
        riskLevel: level,
        reasons: [
          ...(approvedNoShows > 0 ? [`${approvedNoShows} approved no-show report(s)`] : []),
          ...(cancelled > 0 ? [`${cancelled} past cancellation(s)`] : []),
          ...(hoursUntilBooking < 24 ? ['booked within 24 hours'] : []),
        ],
      };
    }));

    results.sort((a, b) => b.riskScore - a.riskScore);
    res.json(results);
  } catch (error) {
    console.error('AI no-show risk error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.suggestTimes = async (req, res) => {
  try {
    const { providerId, date } = req.body;
    if (!providerId || !date) return res.status(400).json({ message: 'providerId and date are required' });

    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const booked = await Booking.find({
      provider: providerId,
      date: { $gte: dayStart, $lt: dayEnd },
      status: { $nin: ['cancelled'] },
    }).select('time hours');

    const bookedTimes = booked.flatMap(b => {
      const start = b.time;
      const [h, m] = start.split(':').map(Number);
      const slots = [];
      for (let i = 0; i < Math.max(Math.ceil(b.hours || 1), 1); i++) {
        const s = new Date(0, 0, 0, h + i, m);
        slots.push(`${String(s.getHours()).padStart(2, '0')}:${String(s.getMinutes()).padStart(2, '0')}`);
      }
      return slots;
    });

    const slots = [];
    for (let h = 8; h < 20; h++) {
      const time = `${String(h).padStart(2, '0')}:00`;
      const conflict = bookedTimes.includes(time) || bookedTimes.includes(`${String(h).padStart(2, '0')}:30`);
      const busy = booked.some(b => {
        const [bh, bm] = b.time.split(':').map(Number);
        const startMin = bh * 60 + bm;
        const endMin = startMin + (b.hours || 1) * 60;
        const slotMin = h * 60;
        return slotMin >= startMin && slotMin < endMin;
      });
      if (!conflict && !busy) slots.push(time);
    }

    const busyCount = booked.length;
    res.json({
      date,
      totalBookings: busyCount,
      slots,
      recommendation: busyCount >= 6
        ? 'This date is very busy — consider another day.'
        : busyCount >= 3
          ? 'Moderately busy — early morning slots are most likely available.'
          : 'Plenty of availability on this date.',
    });
  } catch (error) {
    console.error('AI schedule error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.forecast = async (req, res) => {
  try {
    const days = 30;
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);

    const historical = await Booking.aggregate([
      { $match: { createdAt: { $gte: start } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          bookings: { $sum: 1 },
          revenue: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$totalAmount', 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const avgBookings = historical.length ? historical.reduce((a, b) => a + b.bookings, 0) / historical.length : 1;
    const avgRevenue = historical.length ? historical.reduce((a, b) => a + b.revenue, 0) / historical.length : 20;
    const trend = historical.length >= 2
      ? (historical[historical.length - 1].bookings - historical[0].bookings) / Math.max(historical.length - 1, 1)
      : 0;

    const result = [];
    for (let i = 1; i <= 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const growth = Math.round(trend * i * 0.8);
      const bookings = Math.max(Math.round(avgBookings + growth + (Math.sin(i * 1.7) * avgBookings * 0.15)), 0);
      const revenue = Math.max(Math.round(avgRevenue * bookings * (1 + i * 0.01)), 0);
      result.push({ date: d.toISOString().slice(0, 10), bookings, revenue });
    }
    res.json(result);
  } catch (error) {
    console.error('AI forecast error:', error.message);
    res.status(500).json({ message: error.message });
  }
};
