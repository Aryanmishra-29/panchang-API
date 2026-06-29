import rateLimit from 'express-rate-limit';

export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // Limit each client to 60 requests per minute
  keyGenerator: (req) => {
    // Use x-api-key if provided, otherwise fallback to IP address
    const apiKey = req.header('x-api-key');
    if (apiKey) {
      return apiKey;
    }
    // For TypeScript compatibility, ensure it returns a string
    return req.ip || req.socket.remoteAddress || 'unknown';
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too Many Requests: You have exceeded your quota of 60 requests per minute.'
    });
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
