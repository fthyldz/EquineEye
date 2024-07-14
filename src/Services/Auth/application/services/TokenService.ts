import { Service } from "typedi";
import { ITokenService } from "../../interfaces/services/ITokenService";
import { AuthInfo } from "../../core/entities/AuthInfo";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { Config } from "../../shared/utils/config";
import { TokenPayload } from "../../core/models/TokenPayload";

@Service()
export class TokenService implements ITokenService {

    public generateAccessToken(payload: TokenPayload): string {
        const accessTokenPayload: TokenPayload = payload;
        const accessTokenSecret: Secret = Config.get("JWT_TOKEN_SECRET");
        const accessTokenOptions: SignOptions = { expiresIn: Config.get("JWT_ACCESS_TOKEN_EXPIRY") };
        const accessToken = jwt.sign(accessTokenPayload, accessTokenSecret, accessTokenOptions);
        return accessToken;
    }

    public generateRefreshToken(payload: TokenPayload): string {
        const refreshTokenPayload: TokenPayload = payload;
        const refreshTokenSecret: Secret = Config.get("JWT_REFRESH_TOKEN_SECRET");
        const refreshTokenOptions: SignOptions = { expiresIn: Config.get("JWT_REFRESH_TOKEN_EXPIRY") };
        const refreshToken = jwt.sign(refreshTokenPayload, refreshTokenSecret, refreshTokenOptions);
        return refreshToken;

    }

    public verifyAccessToken(accessToken: string): TokenPayload {
        const decode: any = jwt.verify(accessToken, Config.get("JWT_TOKEN_SECRET")) as TokenPayload;
        return { _id: decode._id, userId: decode.userId, email: decode.email };

    }

    public verifyRefreshToken(refreshToken: string): TokenPayload {
        const decode: any = jwt.verify(refreshToken, Config.get("JWT_REFRESH_TOKEN_SECRET"));
        return { _id: decode._id, userId: decode.userId, email: decode.email };
    }
}