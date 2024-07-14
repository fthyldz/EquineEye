import { createClient, RedisClientType, SetOptions } from 'redis';
import { Service } from 'typedi';
import Config from '../../../shared/utils/Config';

@Service()
export default class RedisDataSource {
    private client: RedisClientType | null = null;

    async connect(): Promise<void> {
        if (!this.client) {
            this.client = createClient({
                url: Config.get("REDIS_URI")
            });
            this.client.on('error', err => console.log('Redis Client Error', err));
        }
        await this.client.connect();
        console.log('Connected to Redis');
    }

    async set(key: string, value: any, options: SetOptions | undefined = undefined): Promise<void> {
        await this.client?.set(key, JSON.stringify(value), options);
    }

    async get(key: string): Promise<any> {
        return JSON.parse(await this.client?.get(key) ?? "");
    }

    async delete(key: string): Promise<any> {
        return await this.client?.del(key);
    }
}