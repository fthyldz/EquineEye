import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { Inject, Service } from "typedi";
import LoginCommandHandler from "../../application/features/commands/login/LoginCommandHandler";
import LoginCommandRequest from "../../application/features/commands/login/LoginCommandRequest";
import RefreshTokenCommandHandler from "../../application/features/commands/refresh-token/RefreshTokenCommandHandler";
import RefreshTokenRequest from "../../application/features/commands/refresh-token/RefreshTokenCommandRequest";

@Service()
export default class AuthController {
    constructor(
        @Inject("LoginCommandHandler") private _loginCommandHandler: LoginCommandHandler,
        @Inject("RefreshTokenCommandHandler") private _refreshTokenCommandHandler: RefreshTokenCommandHandler
    ) { }

    public async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const result = await this._loginCommandHandler.execute(new LoginCommandRequest(email, password));
            return res.status(StatusCodes.OK).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const refreshToken: string = req.body.refreshToken;
            const result = await this._refreshTokenCommandHandler.execute(new RefreshTokenRequest(refreshToken));
            return res.status(StatusCodes.OK).json(result);
        } catch (error) {
            next(error);
        }
    }
}
