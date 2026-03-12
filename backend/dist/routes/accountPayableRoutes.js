import { Router } from 'express';
import { AccountPayableController } from '../controllers/AccountPayableController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
const router = Router();
// Todas as rotas de contas a pagar são protegidas
router.use(authMiddleware);
// Rota de listagem de contas a pagar
router.get('/', AccountPayableController.list);
// Rota para cadastrar uma nova conta a pagar (à vista ou com parcelas múltiplas)
router.post('/', AccountPayableController.create);
export default router;
