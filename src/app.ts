import express from 'express';
import cors from 'cors';
import panchangRoutes from './routes/panchang.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
import { apiKeyAuth } from './middleware/auth.middleware';
import { apiRateLimiter } from './middleware/rateLimit.middleware';
app.use('/api/v1/panchang', apiRateLimiter, apiKeyAuth, panchangRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
