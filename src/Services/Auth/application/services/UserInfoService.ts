import Container, { Service } from "typedi";
import { UserInfo } from "../../core/entities/UserInfo";
import { IUserInfoService } from "../../interfaces/services/IUserInfoService";
import { UserInfoRepository } from "../repositories/UserInfoRepository";
import { GetUserInfoResponse, GetUserInfoUseCase } from "../use-cases/user-info/GetUserInfoUseCase";

@Service()
export class UserInfoService implements IUserInfoService {
    private readonly _getUserInfoUseCase: GetUserInfoUseCase;

    constructor() {
        this._getUserInfoUseCase = Container.get(GetUserInfoUseCase);
    }

    async getById(id: string): Promise<GetUserInfoResponse> {
        return await this._getUserInfoUseCase.execute({ id: id });
    }
}