import Container, { Inject, Service } from 'typedi';
import AuthInfo from '../../../../core/entities/AuthInfo';
import CustomError from '../../../../core/common/models/CustomError';
import { StatusCodes } from 'http-status-codes';
import * as bcrypt from 'bcryptjs';
import ICommandHandler from '../../../../core/interfaces/cqrs/ICommandHandler';
import RefreshTokenCommandRequest from './RefreshTokenCommandRequest';
import RefreshTokenCommandResponse from './RefreshTokenCommandResponse';
import TokenPayload from '../../../../core/common/models/TokenPayload';
import IAuthInfoRepository from '../../../../core/interfaces/repositories/IAuthInfoRepository';
import ITokenService from '../../../../core/interfaces/services/ITokenService';
import RedisDataSource from '../../../../infrastructure/cache/redis/RedisDataSource';

@Service("RefreshTokenCommandHandler")
export default class RefreshTokenCommandHandler implements ICommandHandler<RefreshTokenCommandRequest, RefreshTokenCommandResponse> {

    constructor(
        @Inject("AuthInfoRepository") private _authInfoRepository: IAuthInfoRepository,
        @Inject("TokenService") private _tokenService: ITokenService,
        @Inject("RedisDataSource") private readonly _redisDataSource: RedisDataSource
    ) { }

    async execute(commandRequest: RefreshTokenCommandRequest): Promise<RefreshTokenCommandResponse | CustomError> {
        const payload: TokenPayload = this._tokenService.verifyToken(commandRequest.refreshToken, false);
        if (await this._redisDataSource.get(`${payload.userId}:refreshToken`) !== commandRequest.refreshToken) {
            return new CustomError("Refresh Token bulunamadı.", StatusCodes.FORBIDDEN, "FORBIDDEN");
        }
        const accessToken = this._tokenService.generateToken(payload, true);
        const refreshToken = this._tokenService.generateToken(payload, false);
        await this._redisDataSource.set(`${payload.userId.toString()}:accessToken`, accessToken, { EX: 20 * 60 });
        await this._redisDataSource.set(`${payload.userId.toString()}:refreshToken`, refreshToken, { EX: 45 * 60 });
        return new RefreshTokenCommandResponse(accessToken, refreshToken);
    }
}