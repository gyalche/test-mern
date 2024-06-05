import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const url = process.env.MONGODB_URL || '';
export const DBConnection = async () => {
    try {
        await mongoose.connect(url).then((data: any) => {
            console.log(`database is connect to ${data?.connection?.host}`)
        })
    } catch (error: any) {
        setTimeout(DBConnection, 5000);
    }
}