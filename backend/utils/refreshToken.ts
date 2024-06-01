import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "./errorHandler";
import jwt, { JwtPayload } from 'jsonwebtoken'
import userModel from "../model/user.model";
export const refreshToken = catchAsyncError(async (req: any, res: Response, next: NextFunction) => {
    try {
        const { refresh_token } = req.body as any;
        const verify = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET_KEY as string) as JwtPayload;
        console.log('verify', verify)
        if (!verify) {
            return next(new ErrorHandler(404, 'Invalid refresh token'))
        }
        console.log(verify.id)
        const user = await userModel.findById(verify.id);
        console.log('user', user)
        if (!user) return next(new ErrorHandler(404, 'user does not exist'));
        const access_token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET_KEY as string, {
            expiresIn: '5m'
        });
        console.log('access_token')
        req.user = user;
        res.status(200).json({
            success: true,
            access_token
        })

    } catch (error: any) {
        return next(new ErrorHandler(404, error.message))
    }
})