import { Request, Response, NextFunction } from 'express';

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.header('x-api-key');

  const validKeys = process.env.VALID_API_KEYS
    ? process.env.VALID_API_KEYS.split(',').map(key => key.trim())
    : [];

  if (!apiKey || !validKeys.includes(apiKey)) {
    res.status(401).json({ error: 'Unauthorized: Invalid or missing API Key' });
    return;
  }

  next();
};
