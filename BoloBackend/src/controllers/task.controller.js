const Task = require('../models/Task');
const response = require('../utils/response');

exports.createTask = async (req, res) => {
  try {
    const payload = req.body;
    payload.createdBy = req.user._id;
    const task = await Task.create(payload);
    response.success(res, task, 201);
  } catch (err) {
    console.error(err);
    response.error(res, 'Failed to create task');
  }
};

exports.getTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return response.error(res, 'Task not found', 404);
  response.success(res, task);
};

exports.listTasks = async (req, res) => {
  const tasks = await Task.find({ status: 'active' }).sort({ createdAt: -1 }).limit(100);
  response.success(res, tasks);
};
