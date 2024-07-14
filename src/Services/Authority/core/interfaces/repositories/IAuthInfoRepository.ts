import AuthInfo from "../../entities/AuthInfo";
import IMongoDBRepository from "./IMongoDBRepository";

export default interface IAuthInfoRepository extends IMongoDBRepository<AuthInfo> {
    findByEmail(email: string): Promise<AuthInfo | null>;
}
