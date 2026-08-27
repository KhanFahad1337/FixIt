const ServiceProvider = require('../models/ServiceProvider');
const Booking = require('../models/Booking');
const { chat, isConfigured } = require('../utils/ai');

const kb = [
  { keywords: ['hi', 'hello', 'hey', 'good morning', 'good evening', 'good afternoon'], response: 'Hello! Welcome to FixIt. I\'m your assistant. Ask me about services, providers, booking, or anything else!' },
  { keywords: ['what services', 'what do you', 'service category', 'types of', 'all services', 'offer'], response: 'We offer 6 service categories: ⚡ Electrician, 🔧 Plumber, 🎨 Painter, ❄️ AC Technician, 🔨 Carpenter, and 🧹 Cleaner. Which one interests you?' },
  { keywords: ['how to book', 'booking process', 'how book', 'book a service', 'book', 'schedule'], response: 'Booking is quick and easy:\n1️⃣ Browse services and pick a provider\n2️⃣ Choose your preferred date & time\n3️⃣ Pay securely online\n4️⃣ Track status in "My Bookings"\n\nNeed help with a specific step?' },
  { keywords: ['payment', 'pay', 'pricing', 'cost', 'price', 'how much', 'expensive', 'paid', 'fee', 'charge'], response: '💰 Payment Information:\n• Each provider sets their own hourly rate\n• Methods: Credit/Debit Card, Online Payment, Cash on Service\n• All payments are secure\n• Refunds processed within 3-5 business days\n\nAsk me about affordable or top-rated providers!' },
  { keywords: ['contact', 'support', 'help', 'phone', 'email', 'call', 'reach'], response: '📞 Need help? Reach us at:\n• Email: support@fixit.com\n• Phone: 1-800-FIXIT\n• Support available 24/7\n\nYou can also use our live chat or visit your profile for account help.' },
  { keywords: ['cancel', 'cancellation', 'refund', 'modify', 'change', 'reschedule'], response: '🔄 Need to change something?\n• Pending bookings can be cancelled from "My Bookings"\n• Refunds are processed within 3-5 business days\n• Contact support for rescheduling assistance' },
  { keywords: ['review', 'rating', 'rate', 'feedback', 'stars'], response: '⭐ After a completed booking, you can leave a review with a star rating and comment. Your feedback helps other customers choose the right provider!' },
  { keywords: ['report', 'no show', 'missed', 'didn\'t arrive', 'not show', 'noshow'], response: '🚨 If your provider doesn\'t show up:\n1. Go to "My Bookings"\n2. Click "No-Show" on confirmed bookings\n3. Choose refund, rebook, or both\n4. Our admin team will review and take action' },
  { keywords: ['discount', 'coupon', 'promo', 'offer', 'deal', 'special'], response: '🎉 We periodically run promotions! Check the homepage for current offers or subscribe to our newsletter. No promo codes are needed at checkout — discounts apply automatically.' },
  { keywords: ['how long', 'duration', 'time', 'hour', 'hours'], response: '⏱ Service duration depends on the job. Each provider lists their hourly rate, and you can specify the number of hours when booking. Most standard jobs take 1-3 hours.' },
  { keywords: ['insurance', 'safe', 'trust', 'secure', 'protected', 'background'], response: '🛡️ All FixIt providers are verified and background-checked before approval. Payments are processed securely, and we offer no-show protection. Your safety is our priority.' },
  { keywords: ['thank', 'thanks', 'appreciate', 'grateful', 'awesome', 'great'], response: 'You\'re welcome! 😊 Happy to help. If you need anything else, just ask!' },
  { keywords: ['bye', 'goodbye', 'see you', 'talk later'], response: 'Goodbye! 👋 Have a great day. Come back anytime you need help with your home services!' },
];

exports.chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) return res.json({ reply: 'Please say something!' });

    const lower = message.toLowerCase().trim();
    const recentHistory = Array.isArray(history) ? history.slice(-8) : [];

    // Remember the last profession mentioned in the conversation
    const professions = ['electrician', 'plumber', 'painter', 'ac technician', 'ac tech', 'carpenter', 'cleaner'];
    let remembered = null;
    [...recentHistory.map(h => (h.text || '')), message].forEach(text => {
      const t = String(text).toLowerCase();
      const hit = professions.find(p => t.includes(p));
      if (hit) remembered = hit;
    });

    // Try LLM first (with multi-turn memory)
    if (isConfigured()) {
      try {
        const providers = await ServiceProvider.find({ isApproved: true })
          .select('name profession pricePerHour rating experience totalReviews isAvailable');
        const system = `You are FixItBot, the friendly assistant for FixIt — a home services marketplace.
You help customers find providers, estimate prices, book services, understand payments, and get support.
Available providers:
${providers.map(p => `- ${p.name} (${p.profession}), $${p.pricePerHour}/hr, ${p.rating || 'N/A'} stars, ${p.experience} yrs, ${p.totalReviews || 0} reviews, ${p.isAvailable ? 'available' : 'busy'}`).join('\n') || 'None yet'}

Keep answers helpful, concise, and friendly. If the user wants provider suggestions, recommend from the list above.
You have memory of the ongoing conversation — use it to answer follow-ups (e.g. "what about prices?" refers to the service just discussed).`;
        const llmMessages = [
          { role: 'system', content: system },
          ...recentHistory.map(h => ({ role: h.role === 'bot' ? 'assistant' : 'user', content: h.text })),
          { role: 'user', content: message },
        ];
        const reply = await chat(llmMessages, { temperature: 0.7 });
        if (reply) return res.json({ reply });
      } catch (err) {
        console.error('LLM chatbot fallback:', err.message);
      }
    }

    // ===== LIVE DATABASE QUERIES FIRST =====

    // Handle follow-up questions using remembered context
    const isFollowUp = /what about|and their|how much|is the|them|these|they|other|more/.test(lower);
    if (isFollowUp && remembered) {
      const providers = await ServiceProvider.find({
        profession: { $regex: new RegExp('^' + remembered.replace(' tech', 'technician') + '$', 'i') },
        isApproved: true,
      }).select('name pricePerHour rating experience totalReviews');
      if (providers.length > 0) {
        const list = providers.map((p, i) =>
          `${i + 1}. ${p.name} — $${p.pricePerHour}/hr, ⭐${p.rating || 'N/A'} (${p.experience} yrs)`
        ).join('\n');
        return res.json({ reply: `Here are the ${remembered}s again:\n${list}\n\nWant to book one? Just say "book ${providers[0].name}"!` });
      }
    }

    // Provider search by profession
    const matchedProfession = professions.find(p => lower.includes(p));

    if (matchedProfession) {
      const providers = await ServiceProvider.find({
        profession: { $regex: new RegExp('^' + matchedProfession.replace(' tech', 'technician') + '$', 'i') },
        isApproved: true,
      }).select('name profession pricePerHour rating experience totalReviews');

      if (providers.length > 0) {
        const list = providers.map((p, i) =>
          `${i + 1}. ${p.name} — $${p.pricePerHour}/hr, ⭐${p.rating || 'N/A'} (${p.experience} yrs)`
        ).join('\n');
        return res.json({ reply: `Here are available ${matchedProfession}s:\n${list}` });
      } else {
        return res.json({ reply: `Sorry, no ${matchedProfession}s are available right now. Check back later!` });
      }
    }

    // Search/Find queries — top rated, cheapest, all providers
    const isSearch = /find|show|need|looking|search|available|top|best|cheapest|cheapest|affordable|budget|popular|who.*(is|are)|list/i.test(lower);

    if (isSearch) {
      // Check for cheapest
      if (lower.includes('cheap') || lower.includes('cheapest') || lower.includes('lowest') || lower.includes('affordable') || lower.includes('budget')) {
        const providers = await ServiceProvider.find({ isApproved: true }).sort({ pricePerHour: 1 }).limit(5).select('name profession pricePerHour');
        if (providers.length > 0) {
          const list = providers.map((p, i) => `${i + 1}. ${p.name} (${p.profession}) — $${p.pricePerHour}/hr`).join('\n');
          return res.json({ reply: `Most affordable providers:\n${list}` });
        }
        return res.json({ reply: 'No providers found.' });
      }

      // Top rated — check this BEFORE KB so "top rated" doesn't hit the review KB entry
      if (lower.includes('top') || lower.includes('best') || lower.includes('highest') || lower.includes('popular') || lower.includes('who is') || lower.includes('who are')) {
        const providers = await ServiceProvider.find({ isApproved: true, rating: { $gt: 0 } }).sort({ rating: -1 }).limit(5).select('name profession rating pricePerHour experience totalReviews');
        if (providers.length > 0) {
          const list = providers.map((p, i) => `${i + 1}. ${p.name} (${p.profession}) — ⭐${p.rating} (${p.totalReviews || 0} reviews) — $${p.pricePerHour}/hr`).join('\n');
          return res.json({ reply: `Top-rated providers:\n${list}` });
        }
        return res.json({ reply: 'No ratings yet.' });
      }

      // Show all providers
      if (lower.includes('all') || lower.includes('everyone') || lower.includes('list')) {
        const providers = await ServiceProvider.find({ isApproved: true }).select('name profession pricePerHour');
        if (providers.length > 0) {
          const list = providers.map((p, i) => `${i + 1}. ${p.name} (${p.profession}) — $${p.pricePerHour}/hr`).join('\n');
          return res.json({ reply: `All providers:\n${list}` });
        }
        return res.json({ reply: 'No providers registered yet.' });
      }

      return res.json({ reply: 'What type of provider are you looking for? Try asking for an electrician, plumber, painter, AC technician, carpenter, or cleaner.' });
    }

    // ===== KNOWLEDGE BASE (only for non-search questions) =====
    for (const item of kb) {
      if (item.keywords.some(k => lower.includes(k))) {
        return res.json({ reply: item.response });
      }
    }

    // Help menu as default
    return res.json({
      reply: 'I can help you with:\n\n' +
        '🔍 Find a provider — "Find me an electrician"\n' +
        '💰 Cheapest options — "Show cheapest providers"\n' +
        '⭐ Top rated — "Show top rated providers"\n' +
        '📖 Services — "What services do you offer?"\n' +
        '📅 Booking — "How to book?"\n' +
        '💳 Payment — "How does payment work?"\n' +
        '📞 Contact — "Contact support"\n\n' +
        'What would you like to know?'
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ reply: 'Sorry, something went wrong. Please try again.' });
  }
};
