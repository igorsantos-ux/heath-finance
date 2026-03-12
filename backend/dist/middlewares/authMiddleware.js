import { AuthService } from '../services/AuthService.js';
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    const [, token] = authHeader.split(' ');
    const decoded = AuthService.verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
    req.user = decoded;
    next();
};
export const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Acesso negado: permissão insuficiente' });
        }
        next();
    };
};
export const tenantMiddleware = (req, res, next) => {
    // Se for ADMIN_GLOBAL, ele pode acessar qualquer tenant se passar um clinicId via query ou header?
    // Ou ele atua como um tenant "nulo".
    // Para usuários normais, o clinicId vem do token.
    if (req.user.role !== 'ADMIN_GLOBAL' && !req.user.clinicId) {
        return res.status(403).json({ error: 'Usuário sem clínica vinculada' });
    }
    // Injeta o clinicId para ser usado nos serviços
    req.clinicId = req.user.clinicId;
    next();
};
