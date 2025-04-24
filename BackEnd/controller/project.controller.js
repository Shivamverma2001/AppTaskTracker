import Project from '../models/project.model.js';
import User from '../models/user.model.js';

export const createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req.user.id; // Assuming you have authentication middleware

        // Check if user has reached project limit
        const user = await User.findById(userId);
        if (user.projects.length >= 4) {
            return res.status(400).json({
                message: 'You have reached the maximum limit of 4 projects'
            });
        }

        const project = await Project.create({
            name,
            description,
            createdBy: userId
        });

        // Add project to user's projects
        user.projects.push(project._id);
        await user.save();

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const completeProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user.id;

        const project = await Project.findOne({
            _id: projectId,
            createdBy: userId
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.status = 'completed';
        project.completedAt = new Date();
        await project.save();

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};