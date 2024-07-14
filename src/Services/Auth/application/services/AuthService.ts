import Container, { Service } from "typedi";
import { IAuthService } from "../../interfaces/services/IAuthService";
import { LoginRequest, LoginResponse, LoginUseCase } from "../use-cases/auth/LoginUseCase";
import { isEmailValid } from "../../shared/utils/Validation";
import { CustomError } from "../../core/models/CustomError";
import { StatusCodes } from "http-status-codes";
import { RefreshTokenRequest, RefreshTokenUseCase } from "../use-cases/auth/RefreshTokenUseCase";

@Service()
export class AuthService implements IAuthService {
    private readonly _loginUseCase: LoginUseCase;
    private readonly _refreshTokenUseCase: RefreshTokenUseCase;

    constructor() {
        this._loginUseCase = Container.get(LoginUseCase);
        this._refreshTokenUseCase = Container.get(RefreshTokenUseCase);
    }

    async login(email: string, password: string): Promise<LoginResponse | CustomError> {
        if (!isEmailValid(email)) {
            return new CustomError("Email adresi geçerli değil.", StatusCodes.BAD_REQUEST, "BAD_REQUEST");
        }
        const request: LoginRequest = new LoginRequest(email, password);
        return await this._loginUseCase.execute(request);
    }

    async refreshToken(refreshToken: string): Promise<LoginResponse | CustomError> {
        const request: RefreshTokenRequest = new RefreshTokenRequest(refreshToken);
        return await this._refreshTokenUseCase.execute(request);
    }
}