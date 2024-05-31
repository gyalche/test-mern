class ErrorHandler extends Error {
    statusCode: Number;
    constructor(statusCode: number, message: any,) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor)
    }
}

export default ErrorHandler;