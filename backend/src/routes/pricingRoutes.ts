import { Router } from 'express';
import { PricingController } from '../controllers/PricingController.js';
import { authMiddleware, tenantMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware, tenantMiddleware);

router.post('/', PricingController.create);
router.get('/', PricingController.list);

export default router;
