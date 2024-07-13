import { createServer } from 'http';
import { app } from './app';
import Container from 'typedi';
import { MongoDBDataSource } from '../database/mongodb/MongoDbDataSource';

export const startServer = async () => {
    const PORT = parseInt(process.env.PORT as string, 10);

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

    const mongoDBDataSource = Container.get(MongoDBDataSource);
    await mongoDBDataSource.connect();
};
