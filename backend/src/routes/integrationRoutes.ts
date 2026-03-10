import { Router } from 'express';
import { IntegrationController } from '../controllers/IntegrationController.js';
import { authMiddleware, tenantMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware, tenantMiddleware);

router.get('/', IntegrationController.getIntegrations);
router.post('/save', IntegrationController.saveIntegration);
router.post('/test', IntegrationController.testConnection);
router.post('/sync', IntegrationController.syncIntegration);

export default router;
