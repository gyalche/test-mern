import express from 'express';
import { activateUser, getUserInfo, userLogin, userRegister } from '../controller/user.controller';
import { authentication } from '../middleware/authentication';

const userRoute = express.Router();

userRoute.post('/register', userRegister)
userRoute.post('/active-user', activateUser)
userRoute.post('/login', userLogin)
userRoute.get('/user-info', authentication, getUserInfo)

export default userRoute;