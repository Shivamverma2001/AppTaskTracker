import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import Project from '../models/project.model.js';

// You should store this in environment variables
const JWT_SECRET = process.env.JWT_SECRET; // In production, use process.env.JWT_SECRET

// Helper function to generate token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, {
        expiresIn: '30d' // Token expires in 30 days
    });
};

export const signup = async (req, res) => {
    try {
        const { name, email, password, country } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = await User.create({ 
            name, 
            email, 
            password, 
            country 
        });

        // Generate token
        const token = generateToken(user._id);

        // Return user data and token
        res.status(201).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                country: user.country,
                projects: user.projects
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate token
        const token = generateToken(user._id);

        // Return user data and token
        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                country: user.country,
                projects: user.projects
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        const usersData = users.map(user => ({
            id: user._id,
            name: user.name,
            email: user.email,
            country: user.country
        }));
        res.status(200).json(usersData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, country } = req.body;
        const user = await User.findByIdAndUpdate(id, { name, email, password, country }, { new: true });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const addProjectToUser = async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create new project
        const project = await Project.create({
            name,
            description,
            createdBy: userId
        });

        // Add project to user's projects
        user.projects.push(project._id);
        await user.save();

        const updatedUser = await User.findById(userId).populate('projects');
        res.status(200).json(sanitizeUser(updatedUser));
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

export const removeProjectFromUser = async (req, res) => {
    try {
        const { projectId } = req.body;
        const userId = req.user._id;  // Get user ID from authenticated user
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if project exists in user's projects
        if (!user.projects.includes(projectId)) {
            return res.status(400).json({ message: 'Project not found in user\'s projects' });
        }

        // Remove project from user's projects
        user.projects = user.projects.filter(project => 
            project.toString() !== projectId
        );
        
        await user.save();
        const updatedUser = await User.findById(userId).populate('projects');
        res.status(200).json(sanitizeUser(updatedUser));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update the sanitizeUser helper function to include projects
const sanitizeUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    country: user.country,
    projects: user.projects
});

