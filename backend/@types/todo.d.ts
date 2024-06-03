import { Document, Types } from "mongoose";

interface TodoTypes extends Document {
    title: string,
    description?: string,
    priority?: 'low' | 'medium' | 'high';
    createdBy?: Types.ObjectId,
    creationDate?: Date
}