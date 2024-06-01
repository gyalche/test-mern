import express from 'express';
import { activateUser, userRegister } from '../controller/user.controller';

const userRoute = express.Router();

userRoute.post('/register', userRegister)
userRoute.post('/active-user', activateUser)

export default userRoute;