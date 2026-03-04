import { Router } from 'express';
import { AnalyticsController } from '../controllers/AnalyticsController.js';

const router = Router();

router.get('/insights', AnalyticsController.getInsights);

export default router;
