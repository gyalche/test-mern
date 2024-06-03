import express from 'express';
import { activateUser, changePassword, forgotPassword, forgotPasswordUpdate, getUserInfo, updateUser, uploadPhotos, userLogin, userRegister } from '../controller/user.controller';
import { authentication } from '../middleware/auth';
import { refreshToken } from '../utils/tokens/refreshToken';
import { dataValidation } from '../middleware/validationMiddleware';
import { updateUserSchema, userRegistrationSchema } from '../utils/schemas/userSchema';

const userRoute = express.Router();

const registerValidation = dataValidation(userRegistrationSchema);
const updateUserValidation = dataValidation(updateUserSchema);

//post request
userRoute.post('/register', registerValidation, userRegister)
userRoute.post('/activate', activateUser)
userRoute.post('/login', userLogin)


//get request
userRoute.get('/refresh-token', refreshToken)
userRoute.get('/user', authentication, getUserInfo)
userRoute.post('/forgot-password', authentication, forgotPassword)

//put && patch;
userRoute.patch('/upload-photo', authentication, uploadPhotos)
userRoute.put('/update-user', updateUserValidation, authentication, updateUser)
userRoute.put('/update-password', authentication, forgotPasswordUpdate)
userRoute.patch('/change-password', authentication, changePassword)

export default userRoute;