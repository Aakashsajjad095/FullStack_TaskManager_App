import express from 'express';
import { getTasks, addTask, toggleCompletion, removeTask } from '../controllers/taskController.js';

const router = express.Router();

router.get('/tasks', getTasks);
router.post('/tasks', addTask);
router.put('/tasks/:id', toggleCompletion);
router.delete('/tasks/:id', removeTask);

export default router;
