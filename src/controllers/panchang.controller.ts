import { Request, Response } from 'express';
import { z } from 'zod';
import { PanchangService } from '../services/panchang.service';

const panchangQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  lat: z.string().transform(Number).refine(val => !isNaN(val) && val >= -90 && val <= 90, 'Valid latitude required'),
  lon: z.string().transform(Number).refine(val => !isNaN(val) && val >= -180 && val <= 180, 'Valid longitude required'),
  tz: z.string().optional().default('UTC')
});

export class PanchangController {
  static async getPanchang(req: Request, res: Response): Promise<void> {
    try {
      const validated = panchangQuerySchema.parse(req.query);
      
      const data = PanchangService.getDailyPanchang(
        validated.date,
        validated.lat,
        validated.lon,
        validated.tz
      );

      res.status(200).json({
        success: true,
        data
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, errors: error.issues });
        return;
      }
      console.error("Error generating panchang:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
