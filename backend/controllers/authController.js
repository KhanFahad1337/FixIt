const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ name, email, password, phone, address });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: 'user' });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.registerProvider = async (req, res) => {
  try {
    const { name, email, password, phone, profession, experience, description, pricePerHour } = req.body;
    const existing = await ServiceProvider.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Provider already exists' });
    }
    const provider = await ServiceProvider.create({
      name, email, password, phone, profession, experience, description, pricePerHour,
    });
    res.status(201).json({
      _id: provider._id,
      name: provider.name,
      email: provider.email,
      role: 'provider',
      profession: provider.profession,
      token: generateToken(provider._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginProvider = async (req, res) => {
  try {
    const { email, password } = req.body;
    const provider = await ServiceProvider.findOne({ email });
    if (provider && (await provider.matchPassword(password))) {
      res.json({
        _id: provider._id,
        name: provider.name,
        email: provider.email,
        role: 'provider',
        profession: provider.profession,
        token: generateToken(provider._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: 'admin' });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: 'admin',
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  res.json(req.user);
};

exports.loginSubAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: 'subadmin' });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: 'subadmin',
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid sub-admin credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createSubAdmin = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User with this email already exists' });
    const subAdmin = await User.create({ name, email, password, phone, role: 'subadmin' });
    res.status(201).json({ _id: subAdmin._id, name: subAdmin.name, email: subAdmin.email, role: subAdmin.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSubAdmins = async (req, res) => {
  try {
    const subAdmins = await User.find({ role: 'subadmin' }).select('-password').sort('-createdAt');
    res.json(subAdmins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSubAdmin = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sub-admin deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
