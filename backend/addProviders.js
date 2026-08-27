const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const ServiceProvider = require('./models/ServiceProvider');

const addProviders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log('Connected to MongoDB');

    const newProviders = [
      // Electricians (4 new, Mike Smith already exists)
      { name: 'Ali Raza', email: 'ali@fixit.com', password: 'prov123', phone: '1010101010', profession: 'Electrician', experience: 5, description: 'Residential electrical repair and wiring', pricePerHour: 45, rating: 4.3, totalReviews: 12, isApproved: true },
      { name: 'Usman Tariq', email: 'usman@fixit.com', password: 'prov123', phone: '1010101011', profession: 'Electrician', experience: 3, description: 'Smart home wiring and electrical setup', pricePerHour: 40, rating: 4.1, totalReviews: 8, isApproved: true },
      { name: 'Bilal Ahmed', email: 'bilal@fixit.com', password: 'prov123', phone: '1010101012', profession: 'Electrician', experience: 10, description: 'Industrial and commercial electrical expert', pricePerHour: 55, rating: 4.7, totalReviews: 30, isApproved: true },
      { name: 'Omar Farooq', email: 'omar@fixit.com', password: 'prov123', phone: '1010101013', profession: 'Electrician', experience: 7, description: 'Emergency electrical repairs 24/7', pricePerHour: 50, rating: 4.5, totalReviews: 19, isApproved: true },

      // Plumbers (4 new, Sarah Johnson already exists)
      { name: 'Hamza Iqbal', email: 'hamza@fixit.com', password: 'prov123', phone: '2020202010', profession: 'Plumber', experience: 4, description: 'Bathroom and kitchen plumbing specialist', pricePerHour: 38, rating: 4.2, totalReviews: 10, isApproved: true },
      { name: 'Daniyal Shah', email: 'daniyal@fixit.com', password: 'prov123', phone: '2020202011', profession: 'Plumber', experience: 9, description: 'Drainage and sewer line expert', pricePerHour: 48, rating: 4.6, totalReviews: 22, isApproved: true },
      { name: 'Hasan Malik', email: 'hasan@fixit.com', password: 'prov123', phone: '2020202012', profession: 'Plumber', experience: 6, description: 'Water heater installation and repair', pricePerHour: 42, rating: 4.4, totalReviews: 15, isApproved: true },
      { name: 'Saad Naveed', email: 'saad@fixit.com', password: 'prov123', phone: '2020202013', profession: 'Plumber', experience: 8, description: 'Pipe fitting and leak detection', pricePerHour: 44, rating: 4.5, totalReviews: 20, isApproved: true },

      // Painters (4 new, David Wilson already exists)
      { name: 'Asif Khan', email: 'asif@fixit.com', password: 'prov123', phone: '3030303010', profession: 'Painter', experience: 6, description: 'Interior wall painting and texture work', pricePerHour: 35, rating: 4.3, totalReviews: 14, isApproved: true },
      { name: 'Junaid Abbas', email: 'junaid@fixit.com', password: 'prov123', phone: '3030303011', profession: 'Painter', experience: 4, description: 'Decorative and wallpaper painting', pricePerHour: 32, rating: 4.0, totalReviews: 7, isApproved: true },
      { name: 'Faisal Mehmood', email: 'faisal@fixit.com', password: 'prov123', phone: '3030303012', profession: 'Painter', experience: 12, description: 'Exterior and industrial painting', pricePerHour: 45, rating: 4.8, totalReviews: 35, isApproved: true },
      { name: 'Zain ul Abideen', email: 'zain@fixit.com', password: 'prov123', phone: '3030303013', profession: 'Painter', experience: 3, description: 'Home interior painting specialist', pricePerHour: 30, rating: 4.1, totalReviews: 9, isApproved: true },

      // AC Technicians (4 new, Ahmed Khan already exists)
      { name: 'Faizan Raza', email: 'faizan@fixit.com', password: 'prov123', phone: '4040404010', profession: 'AC Technician', experience: 5, description: 'Split and window AC installation', pricePerHour: 50, rating: 4.4, totalReviews: 11, isApproved: true },
      { name: 'Noman Sheikh', email: 'noman@fixit.com', password: 'prov123', phone: '4040404011', profession: 'AC Technician', experience: 8, description: 'Central AC systems and maintenance', pricePerHour: 60, rating: 4.6, totalReviews: 17, isApproved: true },
      { name: 'Adeel Nawaz', email: 'adeel@fixit.com', password: 'prov123', phone: '4040404012', profession: 'AC Technician', experience: 3, description: 'AC gas refilling and servicing', pricePerHour: 45, rating: 4.2, totalReviews: 8, isApproved: true },
      { name: 'Talha Mirza', email: 'talha@fixit.com', password: 'prov123', phone: '4040404013', profession: 'AC Technician', experience: 11, description: 'Commercial HVAC systems expert', pricePerHour: 65, rating: 4.8, totalReviews: 25, isApproved: true },

      // Carpenters (4 new, Robert Chen already exists)
      { name: 'Kamran Ali', email: 'kamran@fixit.com', password: 'prov123', phone: '5050505010', profession: 'Carpenter', experience: 7, description: 'Custom wooden furniture builder', pricePerHour: 46, rating: 4.4, totalReviews: 16, isApproved: true },
      { name: 'Zeeshan Haider', email: 'zeeshan@fixit.com', password: 'prov123', phone: '5050505011', profession: 'Carpenter', experience: 4, description: 'Door and window installation', pricePerHour: 40, rating: 4.2, totalReviews: 10, isApproved: true },
      { name: 'Waqas Javed', email: 'waqas@fixit.com', password: 'prov123', phone: '5050505012', profession: 'Carpenter', experience: 9, description: 'Kitchen cabinet and shelving expert', pricePerHour: 44, rating: 4.5, totalReviews: 21, isApproved: true },
      { name: 'Naveed Akhtar', email: 'naveed@fixit.com', password: 'prov123', phone: '5050505013', profession: 'Carpenter', experience: 15, description: 'Antique furniture restoration', pricePerHour: 52, rating: 4.7, totalReviews: 33, isApproved: true },

      // Cleaners (4 new, Maria Garcia already exists)
      { name: 'Sana Fatima', email: 'sana@fixit.com', password: 'prov123', phone: '6060606010', profession: 'Cleaner', experience: 3, description: 'Deep home cleaning specialist', pricePerHour: 28, rating: 4.3, totalReviews: 12, isApproved: true },
      { name: 'Ayesha Noor', email: 'ayesha@fixit.com', password: 'prov123', phone: '6060606011', profession: 'Cleaner', experience: 5, description: 'Office and commercial cleaning', pricePerHour: 32, rating: 4.5, totalReviews: 18, isApproved: true },
      { name: 'Rabia Shah', email: 'rabia@fixit.com', password: 'prov123', phone: '6060606012', profession: 'Cleaner', experience: 2, description: 'Move-in/move-out cleaning service', pricePerHour: 25, rating: 4.0, totalReviews: 6, isApproved: true },
      { name: 'Nadia Malik', email: 'nadia@fixit.com', password: 'prov123', phone: '6060606013', profession: 'Cleaner', experience: 7, description: 'Carpet and upholstery cleaning', pricePerHour: 35, rating: 4.6, totalReviews: 23, isApproved: true },
    ];

    // Use insertMany to avoid pre-save hook double-hash issues
    // But we need the pre-save hook for hashing. Let's use create() which triggers the hook.
    // Actually insertMany bypasses middleware. Let's use create() for proper hashing.
    for (const p of newProviders) {
      const exists = await ServiceProvider.findOne({ email: p.email });
      if (!exists) {
        await ServiceProvider.create(p);
        console.log(`Created: ${p.name} (${p.profession})`);
      } else {
        console.log(`Skipped (exists): ${p.email}`);
      }
    }

    const total = await ServiceProvider.countDocuments();
    console.log(`\nTotal providers in database: ${total}`);

    await mongoose.disconnect();
    console.log('Done!');
  } catch (err) {
    console.error('Failed:', err.message);
    process.exit(1);
  }
};

addProviders();
