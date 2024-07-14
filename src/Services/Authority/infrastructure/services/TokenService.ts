import { Service } from "typedi";
import ITokenService from "../../core/interfaces/services/ITokenService";
import * as jwt from "jsonwebtoken";
import Config from "../../shared/utils/Config";
import TokenPayload from "../../core/common/models/TokenPayload";

@Service()
export default class TokenService implements ITokenService {

    public generateToken(payload: TokenPayload, isAccessToken: boolean = true): string {
        const tokenPayload: TokenPayload = payload;
        const tokenSecret: jwt.Secret = this.getTokenSecret(isAccessToken);
        const tokenOptions: jwt.SignOptions = { expiresIn: this.getTokenExpiry(isAccessToken) };
        const token = jwt.sign(tokenPayload, tokenSecret, tokenOptions);
        return token;
    }

    public verifyToken(token: string, isAccessToken: boolean = true): TokenPayload {
        const decode: any = jwt.verify(token, this.getTokenSecret(isAccessToken));
        return { _id: decode._id, userId: decode.userId, email: decode.email, time: decode.time };
    }

    private getTokenSecret(isAccessToken: boolean = true): string {
        return Config.get(isAccessToken ? "JWT_ACCESS_TOKEN_SECRET" : "JWT_REFRESH_TOKEN_SECRET")
    }

    private getTokenExpiry(isAccessToken: boolean = true): string {
        return Config.get(isAccessToken ? "JWT_ACCESS_TOKEN_EXPIRY" : "JWT_REFRESH_TOKEN_EXPIRY")
    }
}