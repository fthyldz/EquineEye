import TokenPayload from "../../common/models/TokenPayload";

export default interface ITokenService {
    generateToken(payload: TokenPayload, isAccessToken: boolean): string;
    verifyToken(accessToken: string, isAccessToken: boolean): TokenPayload;
}