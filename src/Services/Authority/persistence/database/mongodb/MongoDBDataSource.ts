import { MongoClient, Db, Collection } from 'mongodb';
import { Service, ServiceOptions } from 'typedi';
import Config from '../../../shared/utils/Config';

@Service()
export default class MongoDBDataSource {
    private client: MongoClient | null = null;
    private db: Db | null = null;

    async connect(): Promise<void> {
        const a : ServiceOptions = {
            transient: true
        };
        if (!this.client) {
            this.client = new MongoClient(Config.get("MONGO_URI"), {
                maxPoolSize: 100,
                minPoolSize: 10,
                maxIdleTimeMS: 30000,
                connectTimeoutMS: 5000,
            });
        }
        await this.client.connect();
        if (!this.db) {
            this.db = this.client.db(Config.get("DB_NAME"));
            console.log('Connected to MongoDB');
        }
    }

    getCollection(collectionName: string): Collection {
        if (!this.db) {
            throw new Error('Database not connected. Call connect() first.');
        }
        return this.db.collection(collectionName);
    }

    async disconnect(): Promise<void> {
        if (this.client) {
            await this.client.close();
            this.db = null;
            console.log('Disconnected from MongoDB');
        }
    }
}