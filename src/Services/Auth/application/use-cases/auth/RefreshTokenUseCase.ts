import Container, { Service } from "typedi";
import { IRefreshTokenUseCase } from "../../../interfaces/use-cases/auth/IRefreshTokenUseCase";
import { AuthInfoRepository } from "../../repositories/AuthInfoRepository";
import { CustomError } from "../../../core/models/CustomError";
import { StatusCodes } from "http-status-codes";
import { TokenService } from "../../services/TokenService";
import { LoginResponse } from "./LoginUseCase";
import { TokenPayload } from "../../../core/models/TokenPayload";

export class RefreshTokenRequest {
    constructor(
        public refreshToken: string
    ) { }
}

@Service()
export class RefreshTokenUseCase implements IRefreshTokenUseCase<RefreshTokenRequest, LoginResponse | CustomError> {
    private readonly _authInfoRepository: AuthInfoRepository;
    private readonly _tokenService: TokenService;

    constructor() {
        this._authInfoRepository = Container.get(AuthInfoRepository);
        this._tokenService = Container.get(TokenService);
    }

    async execute(request: RefreshTokenRequest): Promise<LoginResponse | CustomError> {
        try {
            const decode: TokenPayload = this._tokenService.verifyRefreshToken(request.refreshToken);
            const accessToken = this._tokenService.generateAccessToken(decode);
            const refreshToken = this._tokenService.generateRefreshToken(decode);
            return new LoginResponse(accessToken, refreshToken);
        } catch (error) {
            return new CustomError("", StatusCodes.UNAUTHORIZED, "UNAUTHORIZED");
        }
    }
}