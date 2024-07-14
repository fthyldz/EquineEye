import { Service } from 'typedi';
import AuthInfo from '../../../core/entities/AuthInfo';
import MongoDBRepository from '../../../core/interfaces/repositories/MongoDBRepository';
import IAuthInfoRepository from '../../../core/interfaces/repositories/IAuthInfoRepository';
import CustomError from '../../../core/common/models/CustomError';

@Service()
export default class AuthInfoRepository extends MongoDBRepository<AuthInfo> implements IAuthInfoRepository {
  constructor() {
    super('auth_info');
  }

  async findByEmail(email: string): Promise<AuthInfo | null> {
    try {
      const result = await this.collection.findOne({ email: email });
      return result ? this.mapToEntity(result) : null;
    } catch (error: any) {
      throw new CustomError('Database error: ' + error.message, 500, 'DATABASE_ERROR');
    }
  }
}