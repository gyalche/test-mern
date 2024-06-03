/// <reference types="jest" />
import { NextFunction, Request, Response } from 'express';
import todoModel from '../model/todoList.model';
import { createTodoList, deleteTask, getTodoList, updateTodoList } from '../controller/todoList.controller';
import ErrorHandler from '../utils/error/errorHandler';


jest.mock('../model/todoList.model')
jest.mock("../utils/tokens/jwt");


describe('To do lists', () => {
    let req: any;
    let res: any;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            user: { _id: 'userId123' },
            params: { id: 'dawasherpa123' },
            body: {
                title: 'Test Task',
                description: 'Test Description',
                priority: 'High'
            }
        };
        res = {
            json: jest.fn()
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should find the user with user id and title', async () => {
        (todoModel.findOne as jest.Mock).mockResolvedValue(null);
        (todoModel.findOne as jest.Mock).mockResolvedValue({
            _id: 'taskId123',
            title: 'Test Task',
            description: 'Test Description',
            priority: 'High',
            createdBy: 'userId123'
        });

        await createTodoList(req, res, next);

        expect(todoModel.findOne).toHaveBeenCalledWith({
            title: { $regex: new RegExp('^Test Task$', 'i') },
            createdBy: 'userId123'
        });

    });

    it('should return 400 if title already exists for the user', async () => {
        (todoModel.findOne as jest.Mock).mockResolvedValue({
            _id: 'existingTaskId123',
            title: 'Test Task',
            createdBy: 'userId123'
        });

        await createTodoList(req, res, next);

        expect(todoModel.findOne).toHaveBeenCalledWith({
            title: { $regex: new RegExp('^Test Task$', 'i') },
            createdBy: 'userId123'
        });

        expect(next).toHaveBeenCalledWith(new ErrorHandler(400, 'Task with this title already exists'));
        expect(res.json).not.toHaveBeenCalled();
    });

    it('should return all todo lists of the given user ID', async () => {

        // Mock the result of todoModel.find()
        const expectedTodoLists = [
            { title: 'Task 1', description: 'Description 1', createdBy: 'userId123' },
            { title: 'Task 2', description: 'Description 2', createdBy: 'userId123' },
        ];
        (todoModel.find as jest.Mock).mockResolvedValue(expectedTodoLists);

        // Call the function to be tested
        await getTodoList(req as Request, res as Response, next);

        expect(todoModel.find).toHaveBeenCalledWith({ createdBy: 'userId123' });

        expect(next).not.toHaveBeenCalled();
    });

    it('should update the use successfully', async () => {
        const taskId = 'taskId123';
        const userId = 'userId123';
        const updatedTaskData = {
            title: 'Updated Task Title',
            description: 'Updated Task Description',
        };
        const req = { params: { id: taskId }, user: { _id: userId }, body: updatedTaskData };
        (todoModel.findById as jest.Mock).mockResolvedValueOnce({
            _id: taskId,
            createdBy: userId,
        });

        (todoModel.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce({
            _id: taskId,
            createdBy: userId,
            ...updatedTaskData,
        });

        const res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();

        await updateTodoList(req as any, res as any, next);
        expect(todoModel.findById).toHaveBeenCalledWith(taskId);
        expect(todoModel.findByIdAndUpdate).toHaveBeenCalledWith(taskId, { $set: updatedTaskData }, { new: true });
        expect(next).not.toHaveBeenCalled();
    })

    //delte task;
    it('should delete task successfully', async () => {
        const taskId = 'taskId123';
        const userId = 'userId123';

        const req = { params: { id: taskId }, user: { _id: userId } };
        (todoModel.findById as jest.Mock).mockResolvedValueOnce({
            _id: taskId,
            createdBy: userId,
        });

        (todoModel.findByIdAndDelete as jest.Mock).mockResolvedValueOnce({
            _id: taskId,
            createdBy: userId,
        });

        const res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const next = jest.fn();

        await deleteTask(req as any, res as any, next);

        expect(todoModel.findById).toHaveBeenCalledWith(taskId);
        expect(todoModel.findByIdAndDelete).toHaveBeenCalledWith(taskId);

        expect(next).not.toHaveBeenCalled();
    });

})

