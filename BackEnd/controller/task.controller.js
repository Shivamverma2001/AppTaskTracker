import Task from '../models/task.model.js';
import Project from '../models/project.model.js';

export const createTask = async (req, res) => {
    console.log("createTask===>",req.user);
    try {
        const { title, description, status } = req.body;
        const { projectId } = req.params;  // Get projectId from route params
        const user = req.user;

        // Verify if the project belongs to the user using the projects array
        const hasProject = user.projects.some(project => 
            project.toString() === projectId
        );

        if (!hasProject) {
            return res.status(404).json({ message: 'Project not found or not authorized' });
        }

        // Create the task
        const task = await Task.create({
            title,
            description,
            status: status || 'pending', // Use provided status or default to 'pending'
            createdBy: projectId
        });

        // Return formatted task
        const formattedTask = {
            _id: task._id,
            title: task.title,
            description: task.description,
            status: task.status,
            createdBy: task.createdBy,
            createdAt: task.createdAt
        };

        res.status(201).json({
            message: 'Task created successfully',
            task: formattedTask
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid project ID format' });
        }
        console.error('Error in createTask:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getTasks = async (req, res) => {
    try {
        const { projectId } = req.params;
        const user = req.user;

        // First verify if the project belongs to the user
        const hasProject = user.projects.some(project => 
            project.toString() === projectId
        );

        if (!hasProject) {
            return res.status(404).json({ message: 'Project not found or not authorized' });
        }

        // Find all tasks for this project
        const tasks = await Task.find({ createdBy: projectId })
            .select('_id title description status createdAt')
            .sort({ createdAt: -1 }); // Sort by newest first

        res.status(200).json({
            count: tasks.length,
            tasks: tasks.map(task => ({
                _id: task._id,
                title: task.title,
                description: task.description,
                status: task.status,
                createdAt: task.createdAt
            }))
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid project ID format' });
        }
        console.error('Error in getTasks:', error);
        res.status(500).json({ message: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { projectId, taskId } = req.params;
        const { title, description, status } = req.body;
        const user = req.user;

        // First verify if the project belongs to the user
        const hasProject = user.projects.some(project => 
            project.toString() === projectId
        );

        if (!hasProject) {
            return res.status(404).json({ message: 'Project not found or not authorized' });
        }

        // Find the task that belongs to this project
        const existingTask = await Task.findOne({
            _id: taskId,
            createdBy: projectId
        });

        if (!existingTask) {
            return res.status(404).json({ message: 'Task not found or not authorized' });
        }

        // Update task fields
        const updateData = {
            ...(title && { title }),
            ...(description && { description }),
            ...(status && { status })
        };

        // If status is being toggled
        if (status) {
            if (status !== 'pending' && status !== 'completed') {
                return res.status(400).json({ 
                    message: 'Status must be either "pending" or "completed"' 
                });
            }
        }

        // Update the task
        const updatedTask = await Task.findOneAndUpdate(
            {
                _id: taskId,
                createdBy: projectId
            },
            updateData,
            { new: true } // Return the updated document
        );

        res.status(200).json({
            message: 'Task updated successfully',
            task: {
                _id: updatedTask._id,
                title: updatedTask.title,
                description: updatedTask.description,
                status: updatedTask.status,
                createdBy: updatedTask.createdBy,
                createdAt: updatedTask.createdAt,
                updatedAt: updatedTask.updatedAt
            }
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid project or task ID format' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        console.error('Error in updateTask:', error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { projectId, taskId } = req.params;
        const user = req.user;

        // First verify if the project belongs to the user
        const hasProject = user.projects.some(project => 
            project.toString() === projectId
        );

        if (!hasProject) {
            return res.status(404).json({ message: 'Project not found or not authorized' });
        }

        // Find and delete the task that belongs to this project
        const task = await Task.findOneAndDelete({
            _id: taskId,
            createdBy: projectId
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found or not authorized' });
        }

        res.status(200).json({ 
            message: 'Task deleted successfully',
            deletedTask: {
                _id: task._id,
                title: task.title,
                description: task.description,
                status: task.status,
                createdBy: task.createdBy,
                createdAt: task.createdAt
            }
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid project or task ID format' });
        }
        console.error('Error in deleteTask:', error);
        res.status(500).json({ message: error.message });
    }
};