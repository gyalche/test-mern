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
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    creationDate: {
        type: String,
        default: new Date(Date.now()).toISOString().split("T")[0]
    }
}, { timestamps: true })

const todoModel = model<TodoTypes>('todo', todoSchema);
export default todoModel;