import { GetUserInfoResponse } from "../../application/use-cases/user-info/GetUserInfoUseCase";
import { UserInfo } from "../../core/entities/UserInfo";

export interface IUserInfoService {
    getById(id: string): Promise<GetUserInfoResponse>;
}