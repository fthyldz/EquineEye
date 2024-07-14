import Container, { Service } from "typedi";
import { ILoginUseCase } from "../../../interfaces/use-cases/auth/ILoginUseCase";
import { AuthInfoRepository } from "../../repositories/AuthInfoRepository";
import { AuthInfo } from "../../../core/entities/AuthInfo";
import { CustomError } from "../../../core/models/CustomError";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import { TokenService } from "../../services/TokenService";
import { TokenPayload } from "../../../core/models/TokenPayload";

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

    constructor() {
        this._authInfoRepository = Container.get(AuthInfoRepository);
        this._tokenService = Container.get(TokenService);
    }

    async execute(request: LoginRequest): Promise<LoginResponse | CustomError> {
        const authInfo: AuthInfo | null = await this._authInfoRepository.findByEmail(request.email);
        if (!authInfo) {
            return new CustomError("Email veya Şifre Hatalı.", StatusCodes.UNAUTHORIZED, "UNAUTHORIZED");
        }
        if (!await bcrypt.compare(request.password, authInfo.passwordHashed)) {
            return new CustomError("Email veya Şifre Hatalı.", StatusCodes.UNAUTHORIZED, "UNAUTHORIZED");
        }
        const tokenPayload: TokenPayload = { _id: authInfo._id as string, userId: authInfo.externalId, email: authInfo.email };
        const accessToken = this._tokenService.generateAccessToken(tokenPayload);
        const refreshToken = this._tokenService.generateRefreshToken(tokenPayload);
        return new LoginResponse(accessToken, refreshToken);
    }
}