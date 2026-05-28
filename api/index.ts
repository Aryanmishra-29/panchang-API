import app from '../src/app';

// Vercel serverless functions expect the Express app to be exported directly.
// Vercel handles the server listening process under the hood.
export default app;
