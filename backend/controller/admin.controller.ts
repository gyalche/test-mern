import { NextFunction, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import userModel from "../model/user.model";
import ErrorHandler from "../utils/error/errorHandler";

//get all user;
export const getAllUsers = catchAsyncError(async (req: any, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const name = req.query.name || '';
        const date = req.query.date || ''

        const query: any = {}
        if (name) {
            query.name = new RegExp(name, 'i');
        }
        if (date) {
            const startDate = new Date(`${date}T00:00:00.000Z`);
            const endDate = new Date(`${date}T23:59:59.999Z`);
            console.log(startDate, endDate);
            query.createdAt = { $gte: startDate, $lte: endDate };
        }
        const users = await userModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
        const totalData = await userModel.countDocuments(query);
        return res.status(200).json({
            status: 200,
            success:true,
            message: 'successfull',
            limit,
            totalPage: Math.ceil(totalData / limit),
            totalData,
            data: users,
        })
    } catch (error: any) {
        return next(new ErrorHandler(400, error.message))
    }
})