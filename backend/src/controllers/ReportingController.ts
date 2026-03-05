import { Request, Response } from 'express';
import { CashFlowService, GoalService, BillingService } from '../services/ReportingServices.js';
import { FinancialService } from '../services/FinancialService.js';

export class ReportingController {
    static async getDashboardKPIs(req: Request, res: Response) {
        try {
            const { clinicId } = req.query;
            if (!clinicId) return res.status(400).json({ error: 'clinicId is required' });

            const summary = await FinancialService.getSummary(String(clinicId));
            const flow = await CashFlowService.getMonthlyFlow(String(clinicId));

            res.json({ ...summary, ...flow });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getCashFlow(req: Request, res: Response) {
        try {
            const { clinicId } = req.query;
            const data = await CashFlowService.getMonthlyFlow(String(clinicId));
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getDRE(req: Request, res: Response) {
        try {
            const { clinicId } = req.query;
            const data = await CashFlowService.getDRE(String(clinicId));
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getBillingAnalytics(req: Request, res: Response) {
        try {
            const { clinicId } = req.query;
            const data = await BillingService.getBillingAnalytics(String(clinicId));
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getGoals(req: Request, res: Response) {
        try {
            const { clinicId } = req.query;
            const data = await GoalService.getGoals(String(clinicId));
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async postSmartGoal(req: Request, res: Response) {
        try {
            const { targetProfit, clinicId } = req.body;
            const data = await GoalService.calculateSmartGoal(String(clinicId), Number(targetProfit));
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
