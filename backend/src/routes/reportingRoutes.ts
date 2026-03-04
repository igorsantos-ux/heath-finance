import { Router } from 'express';
import { ReportingController } from '../controllers/ReportingController.js';

const router = Router();

router.get('/cash-flow', ReportingController.getCashFlow);
router.get('/goals', ReportingController.getGoals);
router.post('/smart-goal', ReportingController.postSmartGoal);

export default router;
