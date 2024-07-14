import { createServer } from 'http';
import { app } from './app';
import Container from 'typedi';
import { MongoDBDataSource } from '../database/mongodb/MongoDbDataSource';
import { Config } from '../../shared/utils/config';
import { RedisDataSource } from '../cache/redis/redis';

export const startServer = async () => {
    const PORT = Config.getNumber("PORT");

    const server = createServer(app);

    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    process.on('SIGTERM', () => {
        console.log('SIGTERM signal received: closing HTTP server');
        server.close(() => {
            console.log('HTTP server closed');
            process.exit(0);
        });
    });

    const redisDataSource = Container.get(RedisDataSource);
    await redisDataSource.connect();
    const mongoDBDataSource = Container.get(MongoDBDataSource);
    await mongoDBDataSource.connect();
};
