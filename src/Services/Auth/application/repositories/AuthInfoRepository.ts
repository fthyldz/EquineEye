import { Service } from "typedi";
import { AuthInfo } from "../../core/entities/AuthInfo";
import { MongoDBRepository } from '../../interfaces/repositories/MongoDBRepository';
import { IAuthInfoRepository } from "../../interfaces/repositories/IAuthInfoRepository";
import { CustomError } from "../../core/models/CustomError";

@Service()
export class AuthInfoRepository extends MongoDBRepository<AuthInfo> implements IAuthInfoRepository<AuthInfo> {
  constructor() {
    super('auth_info');
  }

  async findByEmail(email: string): Promise<AuthInfo | null> {
    try {
      const result = await this.collection.findOne({ email: email });
      return result ? this.mapToEntity(result) : null;
    } catch (error) {
      throw new CustomError('Database error', 500, 'DATABASE_ERROR');
    }
  }
}