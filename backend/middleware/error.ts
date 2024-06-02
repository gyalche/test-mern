import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/error/errorHandler";

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {

    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal server error';


    //if wrong mongodbid error;
    if (err.name === 'CastError') {
        const message = `Resource not found`;
        err = new ErrorHandler(400, message);
    }

    //validation error;
    if (err.name === 'ValidationError') {
        const messages = Object.values(err).map((val: any) => val.message);
        err = new ErrorHandler(400, messages)
    }

    //duplicate key error;
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(400, message);
    }

    //wrong jwt error;
    if (err.name === 'JsonWebTokenError') {
        const message = `Json web token is invalid, try again`;
        err = new ErrorHandler(400, message);
    }

    //JWT expired error;
    if (err.name === 'TokenExpiredError') {
        const message = `Json web token is expired try again`;
        err = new ErrorHandler(400, message);
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
}