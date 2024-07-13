import { ObjectId, Collection } from 'mongodb';
import { MongoDBDataSource } from '../../infrastructure/database/mongodb/MongoDbDataSource';
import { CustomError } from '../../core/models/CustomError';
import { IEntity } from '../../core/entities/interfaces/IEntity'
import Container from 'typedi';

export abstract class MongoDBRepository<T extends IEntity> {
    protected collection: Collection;

    constructor(collectionName: string) {
        const dataSource = Container.get(MongoDBDataSource);
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
            entity.id = result.insertedId.toString();
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
        const { id, ...rest } = entity;
        return { ...rest };
    }
}