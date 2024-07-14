import * as express from 'express';
import * as cors from 'cors';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { requestLogger } from '../presentation/middlewares/RequestLogger';
import { errorHandler } from '../presentation/middlewares/ErrorHandler';
import { notFoundHandler } from '../presentation/middlewares/NotFoundHandler';
import apiRoutes from '../presentation/routes';

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
