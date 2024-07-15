import { Request, Response, NextFunction } from 'express';
import CustomError from '../../core/exceptions/CustomError';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    const error = new CustomError(`Not Found - ${req.originalUrl}`, 404, 'ROUTE_NOT_FOUND');
    next(error);
};
