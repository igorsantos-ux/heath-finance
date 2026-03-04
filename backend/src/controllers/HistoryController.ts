import { Request, Response } from 'express';
import { HistoryService } from '../services/HistoryService.js';

export class HistoryController {
    static async getYearlySummary(req: Request, res: Response) {
        try {
            const summary = await HistoryService.getYearlySummary(2026);
            res.json(summary);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar resumo anual' });
        }
    }

    static async getDetailedProcedures(req: Request, res: Response) {
        try {
            const procedures = await HistoryService.getDetailedProcedures();
            res.json(procedures);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar procedimentos detalhados' });
        }
    }

    static async getWeeklyAnalysis(req: Request, res: Response) {
        try {
            const { month } = req.query;
            const analysis = await HistoryService.getWeeklyAnalysis(Number(month || 2)); // Default para Março (2)
            res.json(analysis);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar análise semanal' });
        }
    }
}
