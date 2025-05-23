import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

export default Task;
