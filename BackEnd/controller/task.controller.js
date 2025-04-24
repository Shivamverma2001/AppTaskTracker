import Task from '../models/task.model.js';

export const createTask = async (req, res) => {
    const { title, description, status, createdBy } = req.body;
    const task = await Task.create({ title, description, status, createdBy });
    res.status(201).json(task);
}

export const getTasks = async (req, res) => {
    const tasks = await Task.find();
    res.status(200).json(tasks);
}


export const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const task = await Task.findByIdAndUpdate(id, { title, description, status }, { new: true });
    res.status(200).json(task);
}

export const deleteTask = async (req, res) => {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: 'Task deleted successfully' });
}

