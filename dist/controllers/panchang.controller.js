"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanchangController = void 0;
const zod_1 = require("zod");
const panchang_service_1 = require("../services/panchang.service");
const panchangQuerySchema = zod_1.z.object({
    date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    lat: zod_1.z.string().transform(Number).refine(val => !isNaN(val) && val >= -90 && val <= 90, 'Valid latitude required'),
    lon: zod_1.z.string().transform(Number).refine(val => !isNaN(val) && val >= -180 && val <= 180, 'Valid longitude required'),
    tz: zod_1.z.string().optional().default('UTC')
});
class PanchangController {
    static async getPanchang(req, res) {
        try {
            const validated = panchangQuerySchema.parse(req.query);
            const data = panchang_service_1.PanchangService.getDailyPanchang(validated.date, validated.lat, validated.lon, validated.tz);
            res.status(200).json({
                success: true,
                data
            });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                res.status(400).json({ success: false, errors: error.issues });
                return;
            }
            console.error("Error generating panchang:", error);
            res.status(500).json({ success: false, error: error.message });
        }
    }
}
exports.PanchangController = PanchangController;
