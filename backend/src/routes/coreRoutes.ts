import { Router } from 'express';
import { CoreController } from '../controllers/CoreController.js';

const router = Router();

router.get('/productivity', CoreController.getProductivity);
router.post('/doctors', CoreController.createDoctor);
router.get('/stock', CoreController.getStock);
router.post('/stock', CoreController.createStock);

export default router;
