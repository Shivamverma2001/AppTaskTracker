import Task from '../models/task.model.js';
import Project from '../models/project.model.js';

export const createTask = async (req, res) => {
    try {
        const { title, description, projectId } = req.body;
        const userId = req.user.id;

        // Verify project belongs to user
        const project = await Project.findOne({
            _id: projectId,
            createdBy: userId
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const task = await Task.create({
            title,
            description,
            createdBy: projectId
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTasks = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user.id;

        // Verify project belongs to user
        const project = await Project.findOne({
            _id: projectId,
            createdBy: userId
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const tasks = await Task.find({ createdBy: projectId });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title, description, status } = req.body;
        const userId = req.user.id;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Verify project belongs to user
        const project = await Project.findOne({
            _id: task.createdBy,
            createdBy: userId
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;
        await task.save();

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user.id;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Verify project belongs to user
        const project = await Project.findOne({
            _id: task.createdBy,
            createdBy: userId
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        await Task.findByIdAndDelete(taskId);
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};