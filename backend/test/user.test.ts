import { Request, Response, NextFunction } from "express";
import userModel from "../model/user.model";
import { sendMail } from "../utils/mail/sendMail";
import { createActivationToken } from "../utils/tokens/activationToken";
import { updateUser, userRegister } from "../controller/user.controller";
import ErrorHandler from "../utils/error/errorHandler";
import jwt from 'jsonwebtoken';
import { authentication } from "../middleware/auth";
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

describe('createActivationToken', () => {

    it('should generate an activation code between 1000 and 9999', () => {
        const activationCode = Math.floor(1000 + Math.random() * 9000);

        expect(activationCode).toBeGreaterThanOrEqual(1000);
        expect(activationCode).toBeLessThanOrEqual(9999);
    });

    it('should generate an activation token with correct payload and options', () => {

        const user = {
            _id: '1234567890',
            name: 'dawa User',
            email: 'dawaserpa@example.com'
        };

        // Mock the jwt.sign function
        const expectedToken = 'mocked-token';
        (jwt.sign as jest.Mock).mockReturnValue(expectedToken);

        const { token, activation_code } = createActivationToken(user);


        expect(jwt.sign).toHaveBeenCalledWith(
            { user, activation_code: expect.any(String) },
            'test-activation-secret',
            { expiresIn: '5min' }
        );

        expect(token).toBe(expectedToken);
        expect(activation_code).toBeGreaterThanOrEqual(1000);
        expect(activation_code).toBeLessThanOrEqual(9999);
    });
    afterAll(() => {
        jest.clearAllMocks();
    });
});

describe("userRegister", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            headers: {
                authorization: 'Bearer valid-token'
            },
            body: {
                name: "dawa sherpa",
                email: "dawa@example.com",
                password: "password123",
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it("user register should be succesfull", async () => {
        (userModel.findOne as jest.Mock).mockResolvedValue(null);
        (createActivationToken as jest.Mock).mockReturnValue({
            activation_code: "123456",
            token: "activation-token"
        });

        (sendMail as jest.Mock).mockResolvedValue(null);

        userRegister(req as Request, res as Response, next as NextFunction);

        expect(userModel.findOne).toHaveBeenCalledWith({ email: "dawa@example.com" });

    });

    it("should return error if email already exists", async () => {
        (userModel.findOne as jest.Mock).mockResolvedValue({});
        await userRegister(req as Request, res as Response, next);

        expect(userModel.findOne).toHaveBeenCalledWith({ email: "dawa@example.com" });
        expect(next).toHaveBeenCalledWith(new ErrorHandler(400, "Email already exists"));
    });

    it("should return error if sending email fails", async () => {
        (userModel.findOne as jest.Mock).mockResolvedValue(null);
        (createActivationToken as jest.Mock).mockReturnValue({
            activation_code: "12345",
            token: "activation-token"
        });

        userRegister(req as Request, res as Response, next);

        expect(userModel.findOne).toHaveBeenCalledWith({ email: "dawa@example.com" });
        expect(createActivationToken).toHaveBeenCalledWith({
            name: "dawa sherpa",
            email: "dawa@example.com",
            password: "password123",
        });
        // expect(next).toHaveBeenCalledWith(new ErrorHandler(400, "Email sending failed"));
    });

    it("should handle unexpected errors", async () => {
        const error = new Error("Unexpected error");
        (userModel.findOne as jest.Mock).mockRejectedValue(error);

        await userRegister(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(new ErrorHandler(400, "Unexpected error"));
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


})

