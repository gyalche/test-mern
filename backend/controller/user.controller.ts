import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/errorHandler";

export const userRegister = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

    try {

    } catch (error: any) {
        new ErrorHandler(400, error.message)
    }
})