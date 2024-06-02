import { NextFunction, Request, Response } from 'express';
;
import jwt from 'jsonwebtoken';
import userModel from '../model/user.model';
import ErrorHandler from '../utils/error/errorHandler';
import { authentication, authorization } from '../middleware/auth';
import { userType } from "../@types/user";


declare module 'express-serve-static-core' {
    interface Request {
        user?: userType;
    }
}

jest.mock("../model/user.model");
jest.mock("../utils/mail/sendMail");
jest.mock("../utils/tokens/activationToken");
jest.mock("../utils/tokens/jwt");
jest.mock('jsonwebtoken');

describe('authentication middleware', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            headers: {
                authorization: 'Bearer valid-token'
            }
        };
        res = {};
        next = jest.fn();
    });

    it('should authenticate successfully with a valid token and user exists', async () => {
        const mockUser = { _id: 'userId', name: 'dawa sherpa', email: 'dawa@example.com', role: 'user' };
        (jwt.verify as jest.Mock).mockReturnValue({ id: 'userId' });
        (userModel.findById as jest.Mock).mockResolvedValue(mockUser);

        await authentication(req as Request, res as Response, next);

        expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.ACCESS_TOKEN_SECRET_KEY);
        expect(userModel.findById).toHaveBeenCalledWith({ _id: 'userId' });
        expect(req.user).toEqual(mockUser);
        expect(next).toHaveBeenCalled();
    });

    it('should return an error if token is missing', async () => {
        req.headers = {}

        await authentication(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(new ErrorHandler(404, 'user is not authenticated'));
    });

    it('should return an error if user is not found', async () => {
        (jwt.verify as jest.Mock).mockReturnValue({ id: 'userId' });
        (userModel.findById as jest.Mock).mockResolvedValue(null);

        await authentication(req as Request, res as Response, next);

        expect(userModel.findById).toHaveBeenCalledWith({ _id: 'userId' });
        expect(next).toHaveBeenCalledWith(new ErrorHandler(404, 'User not found'));
    });
});

describe('authorization middleware', () => {
    let req: Partial<any>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            user: 'admin'
        };

        res = {};
        next = jest.fn();
    });

    it('should deny access if role is user', () => {
        const authorizeUser = authorization('user');
        authorizeUser(req as Request, res as Response, next);
        expect(next).toHaveBeenCalledWith(new ErrorHandler(404, 'Accessed denied to user '));
    });

    it('should allow access if role is admin', () => {
        const authorizeAdmin = authorization('admin');
        authorizeAdmin(req as Request, res as Response, next);
        expect(next).toHaveBeenCalled();
        expect(next).not.toHaveBeenCalledWith(expect.any(ErrorHandler));
    });
});
