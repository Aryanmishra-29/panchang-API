"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.apiRateLimiter = (0, express_rate_limit_1.default)({
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
