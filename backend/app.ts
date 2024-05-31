import express from 'express';
import { errorMiddleware } from './middleware/error';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoute from './routes/user.routes'
import { database } from './utils/database';
import morgan from 'morgan';
const app = express();

//middleware;
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(errorMiddleware)
app.use(morgan('dev'))
app.use(cors({ origin: process.env.ORIGIN }));

//routes;
app.use('/auth', [userRoute])

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
    database()
})




