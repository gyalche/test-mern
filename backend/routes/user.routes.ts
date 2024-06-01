import express from 'express';
import { activateUser, changePassword, forgotPassword, forgotPasswordUpdate, getUserInfo, updateUser, uploadPhotos, userLogin, userRegister } from '../controller/user.controller';
import { authentication } from '../middleware/auth';
import { refreshToken } from '../utils/tokens/refreshToken';

const userRoute = express.Router();

//post request
userRoute.post('/register', userRegister)
userRoute.post('/active-user', activateUser)
userRoute.post('/login', userLogin)
userRoute.post('/forgot-password', authentication, forgotPassword)

//get request
userRoute.get('/refresh', refreshToken)
userRoute.get('/user-info', authentication, getUserInfo)

//put && patch;
userRoute.patch('/upload-photo', authentication, uploadPhotos)
userRoute.put('/update-user', authentication, updateUser)
userRoute.put('/update-password', authentication, forgotPasswordUpdate)
userRoute.patch('/change-password', authentication, changePassword)

export default userRoute;