import Project from '../models/project.model.js';
import User from '../models/user.model.js';
import Task from '../models/task.model.js';


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

export const getProjects = async (req, res) => {
    try {
        const user = req.user;
        
        // Get all projects using the IDs from user.projects array
        const projects = await Project.find({
            _id: { $in: user.projects }
        }).select('_id name description status createdAt createdBy');

        // Return formatted projects
        const formattedProjects = projects.map(project => ({
            _id: project._id,
            name: project.name,
            description: project.description,
            status: project.status,
            createdAt: project.createdAt,
            createdBy: project.createdBy
        }));

        res.status(200).json({
            count: projects.length,
            projects: formattedProjects
        });
    } catch (error) {
        console.error('Error in getProjects:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getProjectById = async (req, res) => {
    try {
        const { projectId } = req.params;
        const user = req.user;

        // Check if project exists in user's projects array
        const hasProject = user.projects.some(project => 
            project.toString() === projectId
        );

        if (!hasProject) {
            return res.status(404).json({ message: 'Project not found or not authorized' });
        }

        // Get the project details using mongoose ObjectId
        const project = await Project.findById(projectId);
        
        if (!project) {
            // If project is not found but exists in user's projects array,
            // we should clean up the user's projects array
            await User.findByIdAndUpdate(
                user._id,
                { $pull: { projects: projectId } }
            );
            return res.status(404).json({ 
                message: 'Project not found in database. User projects list has been updated.'
            });
        }

        // Return formatted project
        const formattedProject = {
            _id: project._id,
            name: project.name,
            description: project.description,
            status: project.status,
            createdAt: project.createdAt,
            createdBy: project.createdBy
        };

        res.status(200).json(formattedProject);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                message: 'Invalid project ID format',
                details: error.message 
            });
        }
        console.error('Error in getProjectById:', error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const user = req.user;

        // First verify if the project belongs to the user using projects array
        const hasProject = user.projects.some(project => 
            project.toString() === projectId
        );

        if (!hasProject) {
            return res.status(404).json({ 
                message: 'Project not found or not authorized',
                success: false
            });
        }

        // 1. Delete all tasks associated with this project
        await Task.deleteMany({ createdBy: projectId });

        // 2. Delete the project
        const deletedProject = await Project.findByIdAndDelete(projectId);
        
        if (!deletedProject) {
            return res.status(404).json({ 
                message: 'Project not found',
                success: false
            });
        }

        // 3. Remove project from user's projects array
        await User.findByIdAndUpdate(
            user._id,
            { 
                $pull: { 
                    projects: projectId 
                } 
            }
        );

        res.status(200).json({ 
            message: 'Project and all associated tasks deleted successfully',
            success: true,
            deletedProject: {
                _id: deletedProject._id,
                name: deletedProject.name,
                description: deletedProject.description,
                status: deletedProject.status,
                createdAt: deletedProject.createdAt
            }
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                message: 'Invalid project ID format',
                success: false
            });
        }
        console.error('Error in deleteProject:', error);
        res.status(500).json({ 
            message: error.message,
            success: false
        });
    }
};