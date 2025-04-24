import express from 'express';
import { signup, login, getUsers, getUserById, updateUser, deleteUser } from './controller/user.controller.js';
import { createTask, getTasks, updateTask, deleteTask } from './controller/task.controller.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.post('/tasks', createTask);
router.get('/tasks', getTasks);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

export default router;
