import { Request, Response } from 'express';
import { AnalyticsService } from '../services/AnalyticsService.js';

export class AnalyticsController {
    static async getInsights(req: Request, res: Response) {
        try {
            const insights = await AnalyticsService.getDashboardInsights();
            res.json(insights);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar insights' });
        }
    }
}
