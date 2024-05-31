import express from 'express';
import { userRegister } from '../controller/user.controller';

const userRoute = express.Router();

userRoute.post('/register', userRegister)

export default userRoute;