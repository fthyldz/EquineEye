import { ObjectId, Collection } from 'mongodb';
import MongoDBDataSource from '../../../persistence/database/mongodb/MongoDBDataSource';
import CustomError from '../../exceptions/CustomError'
import IEntity from '../../interfaces/entities/IEntity'
import Container from 'typedi';
import IMongoDBRepository from './IMongoDBRepository';

export default abstract class MongoDBRepository<T extends IEntity> implements IMongoDBRepository<T> {
    protected collection: Collection;

    constructor(collectionName: string) {
        const dataSource: MongoDBDataSource = Container.get("MongoDBDataSource");
        this.collection = dataSource.getCollection(collectionName);
    }

    async findById(id: string): Promise<T | null> {
        try {
            const result = await this.collection.findOne({ _id: new ObjectId(id) });
            return result ? this.mapToEntity(result) : null;
        } catch (error) {
            throw new CustomError('Database error', 500, 'DATABASE_ERROR');
        }
    }

    async findAll(options?: { limit?: number; skip?: number }): Promise<T[]> {
        try {
            const cursor = this.collection.find({});
            if (options?.skip) cursor.skip(options.skip);
            if (options?.limit) cursor.limit(options.limit);
            const results = await cursor.toArray();
            return results.map(result => this.mapToEntity(result));
        } catch (error) {
            throw new CustomError('Database error', 500, 'DATABASE_ERROR');
        }
    }

    async create(entity: T): Promise<T> {
        try {
            const result = await this.collection.insertOne(this.mapToDocument(entity));
            entity._id = result.insertedId.toString();
            return entity;
        } catch (error) {
            throw new CustomError('Database error', 500, 'DATABASE_ERROR');
        }
    }

    async update(id: string, entityData: Partial<T>): Promise<T | null> {
        try {
            const result = await this.collection.findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: this.mapToDocument(entityData) },
                { returnDocument: 'after' }
            );
            return result?.value ? this.mapToEntity(result.value) : null;
        } catch (error) {
            throw new CustomError('Database error', 500, 'DATABASE_ERROR');
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
            return result.deletedCount === 1;
        } catch (error) {
            throw new CustomError('Database error', 500, 'DATABASE_ERROR');
        }
    }

    protected mapToEntity(document: any): T {
        const { _id, ...rest } = document;
        return { id: _id.toString(), ...rest } as T;
    }

    protected mapToDocument(entity: Partial<T>): any {
        const { _id, ...rest } = entity;
        return { ...rest };
    }
}