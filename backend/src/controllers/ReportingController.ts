import { Request, Response } from 'express';
import { CashFlowService, GoalService } from '../services/ReportingServices.js';

export class ReportingController {
    static async getCashFlow(req: Request, res: Response) {
        try {
            const data = await CashFlowService.getMonthlyFlow();
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getGoals(req: Request, res: Response) {
        try {
            const data = await GoalService.getGoals();
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async postSmartGoal(req: Request, res: Response) {
        try {
            const { targetProfit } = req.body;
            const data = await GoalService.calculateSmartGoal(Number(targetProfit));
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
