import Container, { Service } from "typedi";
import { IRefreshTokenUseCase } from "../../../interfaces/use-cases/auth/IRefreshTokenUseCase";
import { CustomError } from "../../../core/models/CustomError";
import { StatusCodes } from "http-status-codes";
import { TokenService } from "../../services/TokenService";
import { LoginResponse } from "./LoginUseCase";
import { TokenPayload } from "../../../core/models/TokenPayload";
import { RedisDataSource } from "../../../infrastructure/cache/redis/redis";

export class RefreshTokenRequest {
    constructor(
        public refreshToken: string
    ) { }
}

@Service()
export class RefreshTokenUseCase implements IRefreshTokenUseCase<RefreshTokenRequest, LoginResponse | CustomError> {
    private readonly _tokenService: TokenService;
    private readonly _redisDataSource: RedisDataSource;

    constructor() {
        this._tokenService = Container.get(TokenService);
        this._redisDataSource = Container.get(RedisDataSource);
    }

    async execute(request: RefreshTokenRequest): Promise<LoginResponse | CustomError> {
        try {
            const payload: TokenPayload = this._tokenService.verifyToken(request.refreshToken, false);
            if (!await this._redisDataSource.get(`${payload.userId}:refreshToken`)) {
                return new CustomError("", StatusCodes.FORBIDDEN, "FORBIDDEN");
            }
            const accessToken = this._tokenService.generateToken(payload, true);
            const refreshToken = this._tokenService.generateToken(payload, false);
            await this._redisDataSource.set(`${payload.userId.toString()}:accessToken`, accessToken, { EX: 20 * 60 });
            await this._redisDataSource.set(`${payload.userId.toString()}:refreshToken`, refreshToken, { EX: 45 * 60 });
            return new LoginResponse(accessToken, refreshToken);
        } catch (error) {
            return new CustomError("", StatusCodes.UNAUTHORIZED, "UNAUTHORIZED");
        }
    }
}