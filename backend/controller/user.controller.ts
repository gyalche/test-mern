import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import userModel from "../model/user.model";
import { ActivateUser, registerBody, userType } from "../@types/user";
import { createActivationToken } from "../utils/activationToken";
import { sendMail } from "../utils/sendMail";
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import { jwtToken } from "../utils/jwt";
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcrypt';

//register account
export const userRegister = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, password, profile } = req.body as registerBody
            const emailExist = await userModel.findOne({ email })
            if (emailExist) {
                return next(new ErrorHandler(400, 'Email already exists'))
            }
            const user: registerBody = {
                name, email, password, profile
            }

            console.log("user", user)
            const { activation_code, token } = createActivationToken(user);
            const data = { user: { name: user.name }, activation_code };
            try {
                process.nextTick(async () => {
                    await sendMail({
                        email: user.email,
                        subject: 'Email Activation',
                        template: 'mail-activation.ejs',
                        data: data,
                    })
                })
                return res.status(201).json({
                    success: true,
                    message: `Please check your email:${user.name}`,
                    activationToken: token
                })
            } catch (error: any) {
                new ErrorHandler(400, error.message)
            }
        } catch (error: any) {
            return next(new ErrorHandler(400, error.message))
        }
    });

//activate account with opt
export const activateUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token, activation_code } = req.body as ActivateUser;
        const myUser: { user: userType, activation_code: any } = jwt.verify(
            token,
            process.env.ACTIVATION_SECRET as string
        ) as any;

        console.log("users", myUser)

        if (myUser.activation_code !== activation_code) {
            return next(new ErrorHandler(400, 'Invalid activation code'))
        }
        const { name, email, password } = myUser.user;
        const emailExist = await userModel.findOne({ email });
        if (emailExist) {
            return next(new ErrorHandler(400, 'Email already exists'))
        }
        const user = await userModel.create({ name, email, password })
        user.save();
        res.status(201).json({ success: true, data: user })
    } catch (error: any) {
        next(new ErrorHandler(400, error.message))
    }
})

//login;
export const userLogin = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorHandler(404, 'Invalid credentials'))
        }
        const user = await userModel.findOne({ email }).select("+password") as userType;
        if (!user) {
            return next(new ErrorHandler(404, 'user not found'))
        }
        console.log("email", user)
        const passwordMatch = await user.comparePassword(password);
        console.log("check compare", passwordMatch)
        if (!passwordMatch) {
            return next(new ErrorHandler(404, 'incorrect password'))
        }
        process.nextTick(() => {
            jwtToken(user, 200, res)
        })

    } catch (error: any) {
        return next(new ErrorHandler(400, error.message))
    }
})

//get user info;
export const getUserInfo = catchAsyncError(async (req: any, res: Response, next: NextFunction) => {
    try {
        const id = req.user?._id;
        console.log("userid", id)
        const user = await userModel.findById(id);
        // console.log("user", user)
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error: any) {
        return next(new ErrorHandler(404, error.message))
    }
})

//upload photo
export const uploadPhotos = catchAsyncError(async (req: any, res: Response, next: NextFunction) => {
    try {
        const { profile } = req.body;
        console.log(profile)
        const id = req.user?._id;
        const user = await userModel.findById(id) as any;

        if (!profile) {
            return next(new ErrorHandler(400, 'please select profile'))
        }
        if (user?.profile?.public_id) {
            await cloudinary.uploader.destroy(user?.profile?.public_id);
            const image = await cloudinary.uploader.upload(profile, {
                folder: 'profile',
                width: 200
            })
            user.profile = {
                public_id: image.public_id,
                url: image.secure_url
            }
        } else {
            const image = await cloudinary.uploader.upload(profile, {
                folder: 'profile',
                width: 200
            })
            user.profile = {
                public_id: image.public_id,
                url: image.secure_url
            }
        }

        await user.save();
        res.status(201).json({
            success: true,
            message: 'profile updated sucessfully',
            data: user
        })
    } catch (error: any) {
        next(new ErrorHandler(404, error.message))
    }
})

//update user account;
export const updateUser = catchAsyncError(async (req: any, res: Response, next: NextFunction) => {
    try {
        const id = req.user?._id;
        const user = await userModel.findByIdAndUpdate(id, { $set: req.body }, { new: true });
        res.status(201).json({
            success: true,
            message: 'Successfully updated',
            data: user
        })

    } catch (error: any) {
        next(new ErrorHandler(400, error.message))
    }
})

//forgot password token
export const forgotPassword = catchAsyncError(async (req: any, res: Response, next: NextFunction) => {
    try {
        const id = req.user?._id;
        const user: any = await userModel.findById(id).select("+password");
        if (!user) {
            return next(new ErrorHandler(404, 'user doesnt exist'));
        }
        const { activation_code, token } = createActivationToken(user);
        const data = { user: { name: user.name }, activation_code };
        console.log(data)
        process.nextTick(async () => {
            sendMail({
                email: user.email,
                subject: 'Password reset',
                template: 'mail-activation.ejs',
                data: data,
            })
        })
        res.status(200).json({
            success: true,
            message: `Please check your email:${user.name}`,
            token
        })
    } catch (error: any) {
        next(new ErrorHandler(400, error.message))
    }
})

// update password with code;
export const forgotPasswordUpdate = catchAsyncError(async (req: any, res: Response, next: NextFunction) => {
    try {
        const { password, activation_code, token } = req.body;
        const id = req.user?._id;

        if (!password) return next(new ErrorHandler(400, 'Password enter password'))

        const myUser: { user: userType, activation_code: any } = jwt.verify(
            token,
            process.env.ACTIVATION_SECRET as string
        ) as any;

        if (myUser.activation_code !== activation_code) {
            return next(new ErrorHandler(400, 'Invalid activation code'))
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        await userModel.findByIdAndUpdate(id, { password: hashedPassword })
        const user = await userModel.findById(id)
        res.status(200).json({
            success: true,
            message: 'successfully password updated',
            data: user
        })
    } catch (error: any) {
        next(new ErrorHandler(400, error.message))
    }
})

//change password
export const changePassword = catchAsyncError(async (req: any, res: Response, next: NextFunction) => {
    try {

        const { oldPassword, password, reTypePassword } = req.body;
        if (!oldPassword) return next(new ErrorHandler(400, 'please enter old password'))
        if (oldPassword && password !== reTypePassword) {
            return next(new ErrorHandler(400, 'Password doestnot match'))
        }
        const id = req.user._id;
        const user = await userModel.findById(id).select("+password");
        if (!user) return next(new ErrorHandler(400, 'User doesnt exist'));

        const oldPasswordMatch = await bcrypt.compare(oldPassword, user?.password);
        if (!oldPasswordMatch) return next(new ErrorHandler(400, 'old password doest not match'));
        const hashPassword = await bcrypt.hash(password, 10);
        await userModel.findByIdAndUpdate(id, { password: hashPassword });
        res.status(201).json({
            success: true,
            message: 'password update sucessfully',

        })
    } catch (error: any) {
        return next(new ErrorHandler(400, error.message))
    }
})