import dotenv from 'dotenv';
import mongoose, { ConnectOptions } from 'mongoose';
import ErrorHandler from './errorHandler';

dotenv.config();

export const database = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL as string).then((data: any) => {
            console.log(`database is connect to ${data?.connection?.host}`)
        })
    } catch (error: any) {
        return new ErrorHandler(400, error.message)
    }
}