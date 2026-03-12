import { Request, Response } from 'express';
import { CashFlowService, GoalService, BillingService } from '../services/ReportingServices.js';
import { FinancialService } from '../services/FinancialService.js';
import prisma from '../lib/prisma.js';

export class ReportingController {
    static async getDashboardKPIs(req: any, res: Response) {
        try {
            const clinicId = req.clinicId;
            const summary = await FinancialService.getSummary(clinicId);
            const flow = await CashFlowService.getMonthlyFlow(clinicId);

            res.json({ ...summary, ...flow });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getCashFlow(req: any, res: Response) {
        try {
            const data = await CashFlowService.getMonthlyFlow(req.clinicId);
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getDRE(req: any, res: Response) {
        try {
            const data = await CashFlowService.getDRE(req.clinicId);
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getBillingAnalytics(req: any, res: Response) {
        try {
            const data = await BillingService.getBillingAnalytics(req.clinicId);
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getGoals(req: any, res: Response) {
        try {
            const data = await GoalService.getGoals(req.clinicId);
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getDashboardData(req: any, res: Response) {
        try {
            const clinicId = req.clinicId;
            if (!clinicId) return res.status(401).json({ message: 'Clínica não identificada' });

            const today = new Date();
            const firstDayMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const lastDayMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

            // 1. Contas a Pagar (Pendentes e Atrasadas - Sem filtro de data, tudo que deve)
            const unpaidInstallments = await prisma.accountPayableInstallment.aggregate({
                where: {
                    accountPayable: { clinicId },
                    status: { not: 'PAGO' }
                },
                _sum: { amount: true }
            });

            // 2. Despesas Totais (Tudo do mês atual, independente do status)
            const monthExpenses = await prisma.accountPayableInstallment.aggregate({
                where: {
                    accountPayable: { clinicId },
                    dueDate: {
                        gte: firstDayMonth,
                        lte: lastDayMonth
                    }
                },
                _sum: { amount: true }
            });

            // 3. Gráfico de Evolução (Últimos 6 meses)
            const chartData = [];
            for (let i = 5; i >= 0; i--) {
                const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
                const nextDate = new Date(today.getFullYear(), today.getMonth() - i + 1, 1);

                const expenses = await prisma.accountPayableInstallment.aggregate({
                    where: {
                        accountPayable: { clinicId },
                        dueDate: {
                            gte: date,
                            lt: nextDate
                        }
                    },
                    _sum: { amount: true }
                });

                chartData.push({
                    month: date.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase().replace('.', ''),
                    receita: 0, // Estático por enquanto
                    despesa: expenses._sum.amount || 0
                });
            }

            return res.json({
                cards: {
                    faturamentoTotal: 0,
                    recebimentosLiquidos: 0,
                    contasAPagar: unpaidInstallments._sum.amount || 0,
                    contasAReceber: 0,
                    despesasTotais: monthExpenses._sum.amount || 0,
                    margin: 0 // Mock por enquanto
                },
                chartData
            });

        } catch (error: any) {
            console.error('Error fetching dashboard data:', error);
            return res.json({
                cards: {
                    faturamentoTotal: 0,
                    recebimentosLiquidos: 0,
                    contasAPagar: 0,
                    contasAReceber: 0,
                    despesasTotais: 0,
                    margin: 0
                },
                chartData: []
            });
        }
    }

    static async postSmartGoal(req: any, res: Response) {
        try {
            const { targetProfit } = req.body;
            const data = await GoalService.calculateSmartGoal(req.clinicId, Number(targetProfit));
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
