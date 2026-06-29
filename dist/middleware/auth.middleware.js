"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiKeyAuth = void 0;
const apiKeyAuth = (req, res, next) => {
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
exports.apiKeyAuth = apiKeyAuth;
