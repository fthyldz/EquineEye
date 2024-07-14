import Container, { Service } from "typedi";
import { ILoginUseCase } from "../../../interfaces/use-cases/auth/ILoginUseCase";
import { AuthInfoRepository } from "../../repositories/AuthInfoRepository";
import { AuthInfo } from "../../../core/entities/AuthInfo";
import { CustomError } from "../../../core/models/CustomError";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import { TokenService } from "../../services/TokenService";
import { TokenPayload } from "../../../core/models/TokenPayload";
import { RedisDataSource } from "../../../infrastructure/cache/redis/redis";

export class LoginRequest {
    constructor(
        public email: string,
        public password: string
    ) { }
}

export class LoginResponse {
    constructor(
        public accessToken: string,
        public refreshToken: string
    ) { }
}

@Service()
export class LoginUseCase implements ILoginUseCase<LoginRequest, LoginResponse | CustomError> {
    private readonly _authInfoRepository: AuthInfoRepository;
    private readonly _tokenService: TokenService;
    private readonly _redisDataSource: RedisDataSource;

    constructor() {
        this._authInfoRepository = Container.get(AuthInfoRepository);
        this._tokenService = Container.get(TokenService);
        this._redisDataSource = Container.get(RedisDataSource);
    }

    async execute(request: LoginRequest): Promise<LoginResponse | CustomError> {
        const authInfo: AuthInfo | null = await this._authInfoRepository.findByEmail(request.email);
        if (!authInfo) {
            return new CustomError("Email veya Şifre Hatalı.", StatusCodes.UNAUTHORIZED, "UNAUTHORIZED");
        }
        if (!await bcrypt.compare(request.password, authInfo.passwordHashed)) {
            return new CustomError("Email veya Şifre Hatalı.", StatusCodes.UNAUTHORIZED, "UNAUTHORIZED");
        }
        await this._redisDataSource.delete(`${authInfo.externalId.toString()}:accessToken`);
        await this._redisDataSource.delete(`${authInfo.externalId.toString()}:refreshToken`);
        const tokenPayload: TokenPayload = { _id: authInfo._id as string, userId: authInfo.externalId, email: authInfo.email, time: Date.now() };
        const accessToken = this._tokenService.generateToken(tokenPayload, true);
        const refreshToken = this._tokenService.generateToken(tokenPayload, false);
        const response = new LoginResponse(accessToken, refreshToken);
        await this._redisDataSource.set(`${authInfo.externalId.toString()}:accessToken`, accessToken, { EX: 20 * 60 });
        await this._redisDataSource.set(`${authInfo.externalId.toString()}:refreshToken`, refreshToken, { EX: 45 * 60 });

        return response;
    }
}