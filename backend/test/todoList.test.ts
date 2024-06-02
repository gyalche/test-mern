import { NextFunction, Request, Response } from 'express';
import todoModel from '../model/todoList.model';
import { createTodoList, getTodoList } from '../controller/todoList.controller';
import ErrorHandler from '../utils/error/errorHandler';


jest.mock('../model/todoList.model')
jest.mock("../utils/tokens/jwt");


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

    it('should find the user with user id and title', async () => {
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
});
