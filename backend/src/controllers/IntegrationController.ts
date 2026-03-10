import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { FeegowService } from '../services/FeegowService.js';
import { FeegowSyncService } from '../services/FeegowSyncService.js';

export class IntegrationController {
    static async saveIntegration(req: Request, res: Response) {
        try {
            const { type, token, isActive, settings } = req.body;
            let clinicId = (req as any).user?.clinicId;

            if (!clinicId && (req as any).user?.role === 'ADMIN_GLOBAL') {
                const firstClinic = await prisma.clinic.findFirst();
                clinicId = firstClinic?.id;
            }

            if (!clinicId) {
                return res.status(401).json({ message: 'Clínica não identificada. Administradores globais precisam ter ao menos uma clínica cadastrada.' });
            }

            if (!token) {
                return res.status(400).json({ message: 'Token é obrigatório' });
            }

            const integration = await prisma.integration.upsert({
                where: {
                    clinicId_type: {
                        clinicId,
                        type
                    }
                },
                update: {
                    token,
                    isActive: isActive ?? true,
                    settings: settings || undefined
                },
                create: {
                    clinicId,
                    type,
                    token,
                    isActive: isActive ?? true,
                    settings: settings || undefined
                }
            });

            return res.json(integration);
        } catch (error: any) {
            console.error('Erro ao salvar integração:', error);
            return res.status(500).json({ message: 'Erro ao salvar integração', error: error.message });
        }
    }

    static async getIntegrations(req: Request, res: Response) {
        try {
            let clinicId = (req as any).user?.clinicId;

            if (!clinicId && (req as any).user?.role === 'ADMIN_GLOBAL') {
                const firstClinic = await prisma.clinic.findFirst();
                clinicId = firstClinic?.id;
            }

            if (!clinicId) {
                return res.status(401).json({ message: 'Clínica não identificada' });
            }

            const integrations = await prisma.integration.findMany({
                where: { clinicId }
            });

            return res.json(integrations);
        } catch (error: any) {
            return res.status(500).json({ message: 'Erro ao buscar integrações', error: error.message });
        }
    }

    static async testConnection(req: Request, res: Response) {
        try {
            const { type, token } = req.body;

            if (type === 'FEEGOW') {
                const isValid = await FeegowService.validateToken(token);
                if (isValid) {
                    return res.json({ success: true, message: 'Conexão com Feegow estabelecida com sucesso!' });
                } else {
                    return res.status(400).json({ success: false, message: 'Token inválido ou sem permissão.' });
                }
            }

            return res.status(400).json({ message: 'Tipo de integração não suportado para teste direto.' });
        } catch (error: any) {
            return res.status(500).json({ message: 'Erro ao testar conexão', error: error.message });
        }
    }

    static async syncIntegration(req: Request, res: Response) {
        try {
            const { module } = req.query as { module?: string };
            let clinicId = (req as any).user?.clinicId;

            if (!clinicId && (req as any).user?.role === 'ADMIN_GLOBAL') {
                const firstClinic = await prisma.clinic.findFirst();
                clinicId = firstClinic?.id;
            }

            if (!clinicId) {
                return res.status(401).json({ message: 'Clínica não identificada' });
            }

            const results = await FeegowSyncService.syncAll(clinicId, module);
            return res.json({ success: true, results });
        } catch (error: any) {
            console.error('Erro ao sincronizar integração:', error);
            return res.status(500).json({ message: 'Erro ao sincronizar dados', error: error.message });
        }
    }
}
