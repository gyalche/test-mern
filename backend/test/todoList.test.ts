import { NextFunction, Request, Response } from 'express';
import todoModel from '../model/todoList.model';
import { createTodoList } from '../controller/todoList.controller';
import ErrorHandler from '../utils/error/errorHandler';

// Mock the dependencies
jest.mock('../model/todoList.model', () => ({
    todoModel: {
        findOne: jest.fn(),
        create: jest.fn().mockReturnThis(),
        save: jest.fn()
    }
}));

jest.mock("../utils/tokens/jwt");
jest.mock('jsonwebtoken');
describe('createTodoList', () => {
    let req: any;
    let res: any;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            user: { _id: 'userId123' },
            body: {
                title: 'Test Task',
                description: 'Test Description',
                dueDate: '2024-12-31',
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

    it('should create a new todo list if title does not exist for the user', async () => {
        (todoModel.findOne as jest.Mock).mockResolvedValue(null);
        (todoModel.findOne as jest.Mock).mockResolvedValue({
            _id: 'taskId123',
            title: 'Test Task',
            description: 'Test Description',
            dueDate: '2024-12-31',
            priority: 'High',
            createdBy: 'userId123'
        });

        await createTodoList(req, res, next);

        expect(todoModel.findOne).toHaveBeenCalledWith({
            title: { $regex: new RegExp('^Test Task$', 'i') },
            createdBy: 'userId123'
        });
        expect(todoModel.create).toHaveBeenCalledWith({
            title: 'Test Task',
            description: 'Test Description',
            dueDate: '2024-12-31',
            priority: 'High',
            createdBy: 'userId123'
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'successfully created',
            data: expect.objectContaining({
                _id: 'taskId123',
                title: 'Test Task',
                description: 'Test Description',
                dueDate: '2024-12-31',
                priority: 'High',
                createdBy: 'userId123'
            })
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
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it('should return 400 and call next with an error if there is an exception', async () => {
        const errorMessage = 'Database error';
        (todoModel.findOne as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await createTodoList(req, res, next);

        expect(todoModel.findOne).toHaveBeenCalledWith({
            title: { $regex: new RegExp('^Test Task$', 'i') },
            createdBy: 'userId123'
        });
        expect(next).toHaveBeenCalledWith(new ErrorHandler(400, errorMessage));
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});
