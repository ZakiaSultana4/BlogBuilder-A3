import { Application, Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // Correct import

import router from './app/routes';
import { adminRoute } from './app/routes/adminroute';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';

const app: Application = express();

// Middleware setup
app.use(express.json());
app.use(cors());
app.use(cookieParser()); // Initialize cookie-parser middleware

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to assignment 3 server!');
});

// Routes
app.use('/api', router);
app.use('/api/admin', adminRoute);

// Error handlers
app.use(globalErrorHandler);
app.use(notFound);

export default app;
