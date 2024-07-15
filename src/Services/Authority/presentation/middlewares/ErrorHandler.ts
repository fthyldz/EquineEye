import { Request, Response, NextFunction } from 'express';
import CustomError from '../../core/exceptions/CustomError';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err);

    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({
            error: {
                message: err.message,
                code: err.errorCode,
            },
        });
    }

    res.status(500).json({
        error: {
            message: 'An unexpected error occurred',
            code: 'INTERNAL_SERVER_ERROR',
        },
    });
};
