import Container, { Service } from "typedi";
import { UserInfoRepository } from "../../repositories/UserInfoRepository";
import { IGetUserInfoUseCase } from "../../../interfaces/use-cases/IGetUserInfoUseCase";

export interface GetUserInfoRequest {
    id: string;
}

export interface GetUserInfoResponse {
    email?: string;
}

@Service()
export class GetUserInfoUseCase implements IGetUserInfoUseCase<GetUserInfoRequest, GetUserInfoResponse> {
    private readonly _userInfoRepository: UserInfoRepository;

    constructor() {
        this._userInfoRepository = Container.get(UserInfoRepository);
    }

    async execute(request: GetUserInfoRequest): Promise<GetUserInfoResponse> {
        const result = await this._userInfoRepository.findById(request.id);
        return { email: result?.email };
    }
}