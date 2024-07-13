import { MongoClient, Db, Collection } from 'mongodb';
import { Service } from 'typedi';

@Service()
export class MongoDBDataSource {
    private client: MongoClient | null = null;
    private db: Db | null = null;

    async connect(): Promise<void> {
        if (!this.client) {
            this.client = new MongoClient(process.env.MONGO_URI as string, {
                maxPoolSize: 100,
                minPoolSize: 10,
                maxIdleTimeMS: 30000,
                connectTimeoutMS: 5000,
            });
        }
        await this.client.connect();
        if (!this.db) {
            this.db = this.client.db(process.env.DB_NAME);
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