import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import todoModel from "../model/todoList.model";
import ErrorHandler from "../utils/error/errorHandler";
import { TodoTypes } from "../@types/todo";

export const createTodoList = catchAsyncError(async (req: any, res: Response, next: NextFunction) => {
    try {
        const id = req.user._id;
        const { title, description, dueDate, priority } = req.body as TodoTypes;

        // Check if the title already exists among all tasks
        const existingTask = await todoModel.findOne({ title: { $regex: new RegExp(`^${title}$`, 'i') }, createdBy: id });
        if (existingTask) {
            return next(new ErrorHandler(400, 'Task with this title already exists'));
        }
        const data = {
            title, description, dueDate, priority, createdBy: id
        }
        const todoList = await todoModel.create(data)
        todoList.save();
        res.status(201).json({
            success: true,
            message: 'successfully created',
            data: todoList
        })
    } catch (error: any) {
        return next(new ErrorHandler(400, error.message))
    }
})

export const getTodoList = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.user?._id;
        const user = await todoModel.find({ createdBy: id });
        if (!user) {
            return next(new ErrorHandler(400, 'No todo list found'))
        }
        res.status(200).json({
            success: true,
            message: 'successfully fetch todo list',
            data: user,
        })
    } catch (error: any) {
        new ErrorHandler(400, error.message)
    }
})