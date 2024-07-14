import IEntity from "../entities/IEntity";

export default interface IMongoDBRepository<T extends IEntity> {
    findById(id: string): Promise<T | null>;
    findAll(options?: { limit?: number; skip?: number }): Promise<T[]>;
    create(entity: T): Promise<T>;
    update(id: string, entityData: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}
