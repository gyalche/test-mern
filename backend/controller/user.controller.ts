import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import userModel from "../model/user.model";
import { registerBody } from "../@types/user";
import { createActivationToken } from "../utils/activationToken";
import { sendMail } from "../utils/sendMail";

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
            const { activation_code, token } = createActivationToken(user);
            const data = { user: { name: user.name }, activation_code };


            try {
                process.nextTick(async () => {
                    await sendMail({
                        email: user.email,
                        subject: 'Active your email',
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
            new ErrorHandler(400, error.message)


        }
    })
