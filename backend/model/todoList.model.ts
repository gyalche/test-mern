import mongoose, { Schema, model } from 'mongoose'
import { TodoTypes } from '../@types/todo';


const todoSchema = new Schema<TodoTypes>({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: '',
        trim: true,

    },
    dueDate: {
        type: Date,
        required: true,
        default: Date.now()
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true })

const todoModel = model<TodoTypes>('todo', todoSchema);
export default todoModel;