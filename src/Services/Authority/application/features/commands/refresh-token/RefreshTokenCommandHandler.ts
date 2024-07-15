import { Inject, Service } from 'typedi';
import CustomError from '../../../../core/exceptions/CustomError';
import { StatusCodes } from 'http-status-codes';
import ICommandHandler from '../../../interfaces/cqrs/ICommandHandler';
import RefreshTokenCommandRequest from './RefreshTokenCommandRequest';
import RefreshTokenCommandResponse from './RefreshTokenCommandResponse';
import TokenPayload from '../../../../core/models/TokenPayload';
import ITokenService from '../../../interfaces/services/ITokenService';
import RedisDataSource from '../../../../infrastructure/cache/redis/RedisDataSource';

@Service()
export default class RefreshTokenCommandHandler implements ICommandHandler<RefreshTokenCommandRequest, RefreshTokenCommandResponse> {

    constructor(
        @Inject("TokenService") private _tokenService: ITokenService,
        @Inject("RedisDataSource") private readonly _redisDataSource: RedisDataSource
    ) { }

    async execute(request: RefreshTokenCommandRequest): Promise<RefreshTokenCommandResponse | CustomError> {
        const payload: TokenPayload = this._tokenService.verifyToken(request.refreshToken, false);
        if (await this._redisDataSource.get(`${payload.userId}:refreshToken`) !== request.refreshToken) {
            return new CustomError("Refresh Token bulunamadı.", StatusCodes.FORBIDDEN, "FORBIDDEN");
        }
        const accessToken = this._tokenService.generateToken(payload, true);
        const refreshToken = this._tokenService.generateToken(payload, false);
        await this._redisDataSource.set(`${payload.userId.toString()}:accessToken`, accessToken, { EX: 20 * 60 });
        await this._redisDataSource.set(`${payload.userId.toString()}:refreshToken`, refreshToken, { EX: 45 * 60 });
        return new RefreshTokenCommandResponse(accessToken, refreshToken);
    }
}