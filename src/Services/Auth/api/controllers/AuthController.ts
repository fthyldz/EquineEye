import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import Container, { Service } from "typedi";
import { AuthService } from "../../application/services/AuthService";
import { IAuthController } from "../../interfaces/controllers/IAuthController";
import { CustomError } from "../../core/models/CustomError";
import { TokenService } from "../../application/services/TokenService";

@Service()
export class AuthController implements IAuthController {
    private readonly _authService: AuthService;
    constructor() {
        this._authService = Container.get(AuthService);
    }

    public async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const result = await this._authService.login(email, password);
            return res.status(StatusCodes.OK).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const refreshToken: string = req.body.refreshToken;
            const result = await this._authService.refreshToken(refreshToken);
            return res.status(StatusCodes.OK).json(result);
        } catch (error) {
            next(error);
        }
    }
}
