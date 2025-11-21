const Task = require('../models/Task');
const response = require('../utils/response');
const { extractTextFromImage } = require('../services/ocr.service');
const path = require('path');

exports.createTask = async (req, res) => {
  try {
    const payload = req.body;
    payload.createdBy = req.user._id;
    // If image is uploaded, extract text using OCR
    if (req.file && req.file.mimetype.startsWith('image/')) {
      try {
        // OCR expects local file path
        const ocrText = await extractTextFromImage(req.file.path);
        payload.textImage = ocrText;
      } catch (ocrErr) {
        console.error('OCR error:', ocrErr.message);
        // Optionally, you can fail or continue without textImage
        payload.textImage = '';
      }
    }
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

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return response.error(res, 'Task not found', 404);
    
    await Task.findByIdAndDelete(req.params.id);
    response.success(res, { message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    response.error(res, 'Failed to delete task');
  }
};
