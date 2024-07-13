import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { requestLogger } from '../../api/middlewares/RequestLogger';
import { errorHandler } from '../../api/middlewares/ErrorHandler';
import { notFoundHandler } from '../../api/middlewares/NotFoundHandler';
import apiRoutes from '../../api/routes';

const app = express();

// Middleware
app.use(requestLogger);
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', apiRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
