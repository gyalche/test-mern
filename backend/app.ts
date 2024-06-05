import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { errorMiddleware } from './middleware/error';
import dotenv from 'dotenv';
dotenv.config();

//routes import
import todoRoutes from './routes/todo.routes';
import userRoute from './routes/user.routes';
import adminRoutes from './routes/admin.routes';

const app = express();

//middleware;
app.use(express.json({ limit: '40mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'))
app.use(cors({ origin: process.env.CORS_ORIGIN }));


//routes;
const baseUrl = '/api/v1';
app.use(`${baseUrl}/auth`, userRoute)
app.use(`${baseUrl}/task`, todoRoutes)
app.use(`${baseUrl}/admin`, adminRoutes)

//unknown routes;
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err);
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 8000;

export { PORT, app };




