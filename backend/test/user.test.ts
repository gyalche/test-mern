import { Request, Response, NextFunction } from "express";
import userModel from "../model/user.model";
import { sendMail } from "../utils/mail/sendMail";
import { createActivationToken } from "../utils/tokens/activationToken";
import { userRegister } from "../controller/user.controller";
import ErrorHandler from "../utils/error/errorHandler";


jest.mock("../model/user.model");
jest.mock("../utils/mail/sendMail");
jest.mock("../utils/tokens/activationToken");
jest.mock("../utils/tokens/jwt");


describe("userRegister", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
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

    it("user register shoudd be sucesfull", async () => {
        (userModel.findOne as jest.Mock).mockResolvedValue(null);
        (createActivationToken as jest.Mock).mockReturnValue({
            activation_code: "123456",
            token: "activation-token"
        });

        (sendMail as jest.Mock).mockResolvedValue(null);

        userRegister(req as Request, res as Response, next as NextFunction);

        expect(userModel.findOne).toHaveBeenCalledWith({ email: "dawa@example.com" });
        // const data = {
        //     name: "dawa sherpa",
        //     email: "dawa@example.com",
        //     password: "password123"
        // }
        // expect(createActivationToken).toHaveBeenCalledWith(data);
        // expect(res.status).toHaveBeenCalledWith(201);
        // expect(res.json).toHaveBeenCalledWith({
        //     success: true,
        //     message: "Please check your email:dawa sherpa",
        //     activationToken: "activation-token"
        // });
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
        // (sendMail as jest.Mock).mockRejectedValue(new ErrorHandler(400, "Email sending failed"));

        await userRegister(req as Request, res as Response, next);

        expect(userModel.findOne).toHaveBeenCalledWith({ email: "dawa@example.com" });
        expect(createActivationToken).toHaveBeenCalledWith({
            name: "dawa sherpa",
            email: "john@example.com",
            password: "password123",
        });
        expect(next).toHaveBeenCalledWith(new ErrorHandler(400, "Email sending failed"));
    });

    it("should handle unexpected errors", async () => {
        const error = new Error("Unexpected error");
        (userModel.findOne as jest.Mock).mockRejectedValue(error);

        await userRegister(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(new ErrorHandler(400, "Unexpected error"));
    });
});
