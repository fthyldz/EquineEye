import Container, { Inject, Service } from 'typedi';
import AuthInfo from '../../../../core/entities/AuthInfo';
import CustomError from '../../../../core/common/models/CustomError';
import { StatusCodes } from 'http-status-codes';
import * as bcrypt from 'bcryptjs';
import ICommandHandler from '../../../../core/interfaces/cqrs/ICommandHandler';
import LoginCommandRequest from './LoginCommandRequest';
import LoginCommandResponse from './LoginCommandResponse';
import TokenPayload from '../../../../core/common/models/TokenPayload';
import IAuthInfoRepository from '../../../../core/interfaces/repositories/IAuthInfoRepository';
import ITokenService from '../../../../core/interfaces/services/ITokenService';
import RedisDataSource from '../../../../infrastructure/cache/redis/RedisDataSource';

@Service("LoginCommandHandler")
export default class LoginCommandHandler implements ICommandHandler<LoginCommandRequest, LoginCommandResponse> {

    constructor(
        @Inject("AuthInfoRepository") private _authInfoRepository: IAuthInfoRepository,
        @Inject("TokenService") private _tokenService: ITokenService,
        @Inject("RedisDataSource") private readonly _redisDataSource: RedisDataSource
    ) { }

    async execute(commandRequest: LoginCommandRequest): Promise<LoginCommandResponse | CustomError> {
        const authInfo = await this._authInfoRepository.findByEmail(commandRequest.email);
        if (!authInfo) {
            return new CustomError("Email veya Şifre Hatalı.", StatusCodes.UNAUTHORIZED, "UNAUTHORIZED");
        }
        if (!await bcrypt.compare(commandRequest.password, authInfo.passwordHashed)) {
            return new CustomError("Email veya Şifre Hatalı.", StatusCodes.UNAUTHORIZED, "UNAUTHORIZED");
        }
        const tokenPayload: TokenPayload = { _id: authInfo._id as string, userId: authInfo.userId, email: authInfo.email, time: Date.now() };
        const accessToken = this._tokenService.generateToken(tokenPayload, true);
        const refreshToken = this._tokenService.generateToken(tokenPayload, false);
        const response = new LoginCommandResponse(accessToken, refreshToken);
        await this._redisDataSource.set(`${authInfo.userId}:accessToken`, accessToken, { EX: 20 * 60 });
        await this._redisDataSource.set(`${authInfo.userId}:refreshToken`, refreshToken, { EX: 45 * 60 });
        return response;
    }
}