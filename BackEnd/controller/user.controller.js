import User from '../models/user.model.js';

export const signup = async (req, res) => {
    const { name, email, password, country } = req.body;
    const user = await User.create({ name, email, password, country });
    res.status(201).json(user);
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    res.status(200).json(user);
}

export const getUsers = async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
}

export const getUserById = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
}

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, country } = req.body;
    const user = await User.findByIdAndUpdate(id, { name, email, password, country }, { new: true });
    res.status(200).json(user);
}

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'User deleted successfully' });
}

