import { Document, Types } from "mongoose";

interface TodoTypes extends Document {
    title: string,
    description?: string,
    dueDate?: Date,
    priority?: 'low' | 'medium' | 'high';
    createdBy?: Types.ObjectId,
}