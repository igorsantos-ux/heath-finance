import { Router } from 'express';
import { HistoryController } from '../controllers/HistoryController.js';

const router = Router();

router.get('/summary', HistoryController.getYearlySummary);
router.get('/procedures', HistoryController.getDetailedProcedures);
router.get('/weekly', HistoryController.getWeeklyAnalysis);

export default router;
