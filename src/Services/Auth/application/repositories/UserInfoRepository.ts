import { Service } from "typedi";
import { UserInfo } from "../../core/entities/UserInfo";
import { IUserInfoRepository } from '../../interfaces/repositories/IUserInfoRepository';
import { MongoDBRepository } from '../../interfaces/repositories/MongoDBRepository';

@Service()
export class UserInfoRepository extends MongoDBRepository<UserInfo> implements IUserInfoRepository {
  constructor() {
    super('user-info');
  }
}