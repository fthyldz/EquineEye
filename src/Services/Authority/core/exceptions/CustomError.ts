export default class CustomError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500,
        public errorCode: string = 'INTERNAL_SERVER_ERROR'
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
