import express from 'express';
import { signup, login, getUsers, getUserById, updateUser, deleteUser, addProjectToUser, removeProjectFromUser, logout } from './controller/user.controller.js';
import { createTask, getTasks, updateTask, deleteTask } from './controller/task.controller.js';
import { authenticate } from './middleware/auth.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);


router.get('/users', authenticate, getUsers);
router.get('/users/:id', authenticate, getUserById);
router.put('/users/:id', authenticate, updateUser);
router.delete('/users/:id', authenticate, deleteUser);
router.post('/users/:id/add-project', authenticate, addProjectToUser);
router.post('/users/:id/remove-project', authenticate, removeProjectFromUser);
router.post('/users/logout', authenticate, logout);
router.post('/tasks', authenticate, createTask);
router.get('/tasks', authenticate, getTasks);
router.put('/tasks/:id', authenticate, updateTask);
router.delete('/tasks/:id', authenticate, deleteTask);

export default router;
