import { Router } from 'express';
import { PanchangController } from '../controllers/panchang.controller';

const router = Router();

router.get('/', PanchangController.getPanchang);

export default router;
