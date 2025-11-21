const express = require('express');
const router = express.Router();
const taskCtrl = require('../controllers/task.controller');
const auth = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

router.post('/', auth, allowRoles(['admin', 'moderator']), taskCtrl.createTask);
router.get('/', auth, taskCtrl.listTasks);
router.get('/:id', auth, taskCtrl.getTask);
router.delete('/:id', auth, allowRoles(['admin', 'moderator']), taskCtrl.deleteTask);

module.exports = router;
