const User = require('../models/User');
const response = require('../utils/response');

exports.getMe = async (req, res) => {
  response.success(res, req.user);
};

exports.updateMe = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    response.success(res, user);
  } catch (err) {
    console.error(err);
    response.error(res, 'Failed to update user');
  }
};

exports.listUsers = async (req, res) => {
  const users = await User.find().limit(100);
  response.success(res, users);
};
