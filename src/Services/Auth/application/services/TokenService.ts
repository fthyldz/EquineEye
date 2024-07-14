import { Service } from "typedi";
import { ITokenService } from "../../interfaces/services/ITokenService";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { Config } from "../../shared/utils/config";
import { TokenPayload } from "../../core/models/TokenPayload";

@Service()
export class TokenService implements ITokenService {

    public generateToken(payload: TokenPayload, isAccessToken: boolean = true): string {
        const tokenPayload: TokenPayload = payload;
        const tokenSecret: Secret = this.getTokenSecret(isAccessToken);
        const tokenOptions: SignOptions = { expiresIn: this.getTokenExpiry(isAccessToken) };
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