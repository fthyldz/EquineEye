import { LoginResponse } from "../../application/use-cases/auth/LoginUseCase";
import { CustomError } from "../../core/models/CustomError";

export interface IAuthService {
    login(email: string, password: string): Promise<LoginResponse | CustomError>;
    refreshToken(refreshToken: string): Promise<LoginResponse | CustomError>;
}