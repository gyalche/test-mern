import express, { NextFunction, Request, Response } from 'express';
import { errorMiddleware } from './middleware/error';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { DBConnection } from './utils/db/database';
import morgan from 'morgan';
// import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';



//routes import
import userRoute from './routes/user.routes'
import todoRoutes from './routes/todo.routes';

dotenv.config();

// //cloudianry configuration
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

const app = express();

//middleware;
app.use(express.json({ limit: '40mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'))
app.use(cors({ origin: process.env.ORIGIN }));

//routes;
app.use('/api/v1/auth', userRoute)
app.use('/api/v1/task', todoRoutes)

//unknown routes;
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err);
});

app.use(errorMiddleware);


const PORT = process.env.PORT || 8000;

export { app, PORT }




