import { NextFunction, Response, Request } from "express";
import { catchAsyncError } from "./catchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import jwt, { JwtPayload } from 'jsonwebtoken'
import userModel from "../model/user.model";
export const authentication = catchAsyncError(async (req: any, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return next(new ErrorHandler(404, 'user is not authenticated'));
        }
        const verify = jwt.verify(token, process.env.ACCESS_TOKEN as string) as JwtPayload;
        if (!verify) {
            return next(new ErrorHandler(404, 'invalid access token'))
        }
        const user = await userModel.findById({ _id: verify._id });
        if (!user) {
            return next(new ErrorHandler(404, 'User not found'))
        }
        req.user = user;
        next()
    } catch (error: any) {
        next(new ErrorHandler(404, error.message))
    }

})