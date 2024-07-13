import { Request, Response, NextFunction } from "express";

export interface IUserInfoController {
    getUserInfo(req: Request, res: Response, next: NextFunction);
}
