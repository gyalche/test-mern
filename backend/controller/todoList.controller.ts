import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import todoModel from "../model/todoList.model";
import ErrorHandler from "../utils/error/errorHandler";
import { TodoTypes } from "../@types/todo";

//create task;
export const createTodoList = catchAsyncError(async (req: any, res: Response, next: NextFunction) => {
    try {
        const id = req.user._id;
        const { title, description, priority } = req.body as TodoTypes;

        // Check if the title already exists among all tasks
        const existingTask = await todoModel.findOne({ title: { $regex: new RegExp(`^${title}$`, 'i') }, createdBy: id });
        if (existingTask) {
            return next(new ErrorHandler(400, 'Task with this title already exists'));
        }
        const data = {
            title, description, priority, createdBy: id
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

//get task;
export const getTodoList = catchAsyncError(async (req: any, res: Response, next: NextFunction) => {
    try {
        const role = req.user?.role
        const id = req.user?._id;

        //pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        //filter
        const title = req.query.title || '';
        const date = req.query.date || ''
        const priority = req.query.priority ? req.query.priority : '';

        const query: any = role === 'user' ? { createdBy: id } : {};
        console.log("query", query)
        if (title) {
            query.title = new RegExp(title, 'i');
        }
        if (priority) {
            query.priority = priority;
        }

        if (date) {
            const startDate = new Date(`${date}T00:00:00.000Z`);
            const endDate = new Date(`${date}T23:59:59.999Z`);
            console.log(startDate, endDate);
            query.createdAt = { $gte: startDate, $lte: endDate };
        }

        const todo = await todoModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
        console.log(todo)
        if (!todo.length) {
            return next(new ErrorHandler(400, 'No todo list found'))
        }
        const totalData = await todoModel.countDocuments(query)
        res.status(200).json({
            success: true,
            message: 'successfully fetch todo list',
            limit,
            totalPage: Math.ceil(totalData / limit),
            totalData,
            data: todo,
        })
    } catch (error: any) {
        new ErrorHandler(400, error.message)
    }
})

//update task;
export const updateTodoList = catchAsyncError(async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id
        if (!id) {
            return next(new ErrorHandler(404, 'No id found'))
        }
        const verifyUserCreated = await todoModel.findById(id)

        if (!verifyUserCreated) {
            return next(new ErrorHandler(400, 'No task found with given id'))
        }

        if (String(userId) !== String(verifyUserCreated?.createdBy)) {
            return next(new ErrorHandler(400, 'You are not authorized to delete  this task'));
        }
        const todo = await todoModel.findByIdAndUpdate(id, { $set: req.body }, { new: true });
        res.status(200).json({
            success: true,
            message: 'successfully updated',
            data: todo
        })

    } catch (error: any) {
        next(new ErrorHandler(400, error.message))
    }
})

//delete task;
export const deleteTask = catchAsyncError(async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id
        if (!id) {
            return next(new ErrorHandler(404, 'No id found'))
        }
        const verifyUserCreated = await todoModel.findById(id)
        if (!verifyUserCreated) {
            return next(new ErrorHandler(400, 'No task found with given id'))
        }
        if (String(userId) !== String(verifyUserCreated?.createdBy)) {
            return next(new ErrorHandler(400, 'Unable to delete'));
        }
        const todo = await todoModel.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: 'successfully deleted',
            data: todo
        })

    } catch (error: any) {
        next(new ErrorHandler(400, error.message))
    }
})



