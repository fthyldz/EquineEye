import { TokenPayload } from "../../core/models/TokenPayload";

export interface ITokenService {
    generateAccessToken(payload: TokenPayload): string;
    generateRefreshToken(payload: TokenPayload): string;
    verifyAccessToken(accessToken: string): TokenPayload;
    verifyRefreshToken(refreshToken: string): TokenPayload;
}