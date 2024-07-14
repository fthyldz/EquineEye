import { IEntity } from "../../core/entities/interfaces/IEntity";

export interface IAuthInfoRepository<T extends IEntity> {
    findByEmail(email: string): Promise<T | null>;
}
