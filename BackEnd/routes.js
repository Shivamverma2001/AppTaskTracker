import express from 'express';
import { signup, login, getUsers, getUserById, updateUser, deleteUser, addProjectToUser, logout } from './controller/user.controller.js';
import { createTask, getTasks, updateTask, deleteTask } from './controller/task.controller.js';
import { authenticate } from './middleware/auth.js';
import { getProjects, getProjectById, deleteProject, completeProject } from './controller/project.controller.js';
const router = express.Router();

// Auth routes
router.post('/auth/signup', signup);
router.post('/auth/login', login);
router.post('/auth/logout', authenticate, logout);

// Project routes (nested under users)
router.post('/users/projects', authenticate, addProjectToUser);      // Create project
router.delete('/users/projects/:projectId', authenticate, deleteProject);  // Instead of /projects/:projectId
router.get('/users/projects', authenticate, getProjects); // Get all projects
router.get('/users/projects/:projectId', authenticate, getProjectById); // Get project by ID

// User routes
router.get('/users', authenticate, getUsers);
router.get('/users/:id', authenticate, getUserById);
router.put('/users/:id', authenticate, updateUser);
router.delete('/users/:id', authenticate, deleteUser);

// Task routes (nested under projects)
router.post('/projects/:projectId/tasks', authenticate, createTask);
router.get('/projects/:projectId/tasks', authenticate, getTasks);
router.put('/projects/:projectId/tasks/:taskId', authenticate, updateTask);
router.delete('/projects/:projectId/tasks/:taskId', authenticate, deleteTask);

export default router;
