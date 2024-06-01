import express, { NextFunction, Request, Response } from 'express';
import { errorMiddleware } from './middleware/error';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoute from './routes/user.routes'
import { DBConnection } from './utils/database';
import morgan from 'morgan';
const app = express();

//middleware;
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'))
app.use(cors({ origin: process.env.ORIGIN }));

//routes;
app.use('/auth', userRoute)

//unknown routes;
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err);
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
    DBConnection()
})




