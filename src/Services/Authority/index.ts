import 'reflect-metadata';
import * as dotevnv from 'dotenv';
import { startServer } from './server/server';

dotevnv.config();

startServer().catch((error) => {
    console.error("--> Failed to start server: ", error);
    process.exit(1);
});
