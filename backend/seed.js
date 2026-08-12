const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const ServiceProvider = require('./models/ServiceProvider');
const Category = require('./models/Category');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await ServiceProvider.deleteMany({});
    await Category.deleteMany({});

    const categories = await Category.create([
      { name: 'Electrician', description: 'Electrical repairs, installation, wiring' },
      { name: 'Plumber', description: 'Pipe repair, drainage, water heater' },
      { name: 'Painter', description: 'Interior & exterior painting' },
      { name: 'AC Technician', description: 'AC repair, installation, servicing' },
      { name: 'Carpenter', description: 'Furniture, cabinets, woodwork' },
      { name: 'Cleaner', description: 'Home & office cleaning services' },
    ]);
    console.log(`Created ${categories.length} categories`);

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@fixit.com',
      password: 'admin123',
      phone: '0000000000',
      role: 'admin',
    });
    console.log(`Admin created: admin@fixit.com / admin123`);

    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'user123',
      phone: '1111111111',
      address: '123 Main St',
    });
    console.log(`User created: john@example.com / user123`);

    const providersData = [
      { name: 'Mike Smith', email: 'mike@fixit.com', password: 'prov123', phone: '2222222222', profession: 'Electrician', experience: 8, description: 'Expert in residential and commercial electrical work', pricePerHour: 50, rating: 4.8, totalReviews: 24, isApproved: true },
      { name: 'Sarah Johnson', email: 'sarah@fixit.com', password: 'prov123', phone: '3333333333', profession: 'Plumber', experience: 6, description: 'Fast and reliable plumbing services', pricePerHour: 45, rating: 4.6, totalReviews: 18, isApproved: true },
      { name: 'David Wilson', email: 'david@fixit.com', password: 'prov123', phone: '4444444444', profession: 'Painter', experience: 10, description: 'Professional painting for homes and offices', pricePerHour: 40, rating: 4.9, totalReviews: 32, isApproved: true },
      { name: 'Ahmed Khan', email: 'ahmed@fixit.com', password: 'prov123', phone: '5555555555', profession: 'AC Technician', experience: 7, description: 'AC installation, repair, and maintenance', pricePerHour: 55, rating: 4.7, totalReviews: 15, isApproved: true },
      { name: 'Robert Chen', email: 'robert@fixit.com', password: 'prov123', phone: '6666666666', profession: 'Carpenter', experience: 12, description: 'Custom furniture and home renovation', pricePerHour: 48, rating: 4.5, totalReviews: 28, isApproved: true },
      { name: 'Maria Garcia', email: 'maria@fixit.com', password: 'prov123', phone: '7777777777', profession: 'Cleaner', experience: 5, description: 'Thorough home and office cleaning', pricePerHour: 30, rating: 4.4, totalReviews: 20, isApproved: true },
    ];

    const providers = await ServiceProvider.create(providersData);
    console.log(`Created ${providers.length} providers (all pre-approved)`);

    console.log('\n--- Login Credentials ---');
    console.log('Admin:       admin@fixit.com / admin123');
    console.log('User:        john@example.com / user123');
    console.log('Providers:   any provider email / prov123');

    await mongoose.disconnect();
    console.log('\nSeed completed successfully!');
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
