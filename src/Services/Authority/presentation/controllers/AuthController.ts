import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { Inject, Service } from "typedi";
import LoginCommandRequest from "../../application/features/commands/login/LoginCommandRequest";
import RefreshTokenRequest from "../../application/features/commands/refresh-token/RefreshTokenCommandRequest";
import CustomError from "../../core/common/models/CustomError";
import Sender from "../../infrastructure/cqrs/Sender";

@Service()
export default class AuthController {
    constructor(
        @Inject("Sender") private _sender: Sender,
    ) { }

    public async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const result = await this._sender.send(new LoginCommandRequest(email, password));
            if (result instanceof CustomError) {
                return res.status(result.statusCode).json(result.message);
            }
            return res.status(StatusCodes.OK).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const refreshToken: string = req.body.refreshToken;
            const result = await this._sender.send(new RefreshTokenRequest(refreshToken));
            if (result instanceof CustomError) {
                return res.status(result.statusCode).json(result.message);
            }
            return res.status(StatusCodes.OK).json(result);
        } catch (error) {
            next(error);
        }
    }
}
