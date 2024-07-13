import Container, { Service } from "typedi";
import { IUseCase } from "../../../interfaces/use-cases/IUseCase";
import { UserInfoRepository } from "../../repositories/UserInfoRepository";
import { IGetUserInfoUseCase } from "../../../interfaces/use-cases/IGetUserInfoUseCase";

export interface GetUserInfoRequest {
    id: string;
}

export interface GetUserInfoResponse {
    email?: string;
}

@Service()
export class GetUserInfoUseCase extends IUseCase<GetUserInfoRequest, GetUserInfoResponse> implements IGetUserInfoUseCase {
    private readonly _userInfoRepository: UserInfoRepository;

    constructor() {
        super();
        this._userInfoRepository = Container.get(UserInfoRepository);
    }

    async execute(request: GetUserInfoRequest): Promise<GetUserInfoResponse> {
        const result = await this._userInfoRepository.findById(request.id);
        return { email: result?.email };
    }
}