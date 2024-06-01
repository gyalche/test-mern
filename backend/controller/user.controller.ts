import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import userModel from "../model/user.model";
import { ActivateUser, registerBody, userType } from "../@types/user";
import { createActivationToken } from "../utils/activationToken";
import { sendMail } from "../utils/sendMail";
import jwt from 'jsonwebtoken'
import { jwtToken } from "../utils/jwt";

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
        const activationToken = user?.signAccessToken
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
//user info;
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
