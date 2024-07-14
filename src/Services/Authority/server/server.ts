import { createServer } from 'http';
import { app } from './app';
import Container from 'typedi';
import MongoDBDataSource from '../persistence/database/mongodb/MongoDBDataSource';
import Config from '../shared/utils/Config';
import * as PersistenceDependencyInjection from '../persistence/DependencyInjection';
import * as InfrastructureDependencyInjection from '../infrastructure/DependencyInjection';
import RedisDataSource from '../infrastructure/cache/redis/RedisDataSource';

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

    InfrastructureDependencyInjection.default();
    const redisDataSource: RedisDataSource = Container.get("RedisDataSource");
    await redisDataSource.connect();
    Container.set("MongoDBDataSource", Container.get(MongoDBDataSource));
    const mongoDBDataSource: MongoDBDataSource = Container.get("MongoDBDataSource");
    await mongoDBDataSource.connect();
    PersistenceDependencyInjection.default();
};
