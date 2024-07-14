import { TokenPayload } from "../../core/models/TokenPayload";

export interface ITokenService {
    generateToken(payload: TokenPayload, isAccessToken: boolean): string;
    verifyToken(accessToken: string, isAccessToken: boolean): TokenPayload;
}