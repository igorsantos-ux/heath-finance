import { Transaction, FinancialGoal } from '@prisma/client';
import prisma from '../lib/prisma.js';

export class CashFlowService {
    static async getMonthlyFlow() {
        const transactions = await prisma.transaction.findMany();

        // Agrupar por mes/ano (simplificado para o mes atual no seed)
        const income = transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
        const expense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);

        return {
            income,
            expense,
            balance: income - expense
        };
    }
}

export class GoalService {
    static async getGoals() {
        return await prisma.financialGoal.findMany();
    }

    static async calculateSmartGoal(targetProfit: number) {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        // 1. Obter performance atual (Lucro Líquido do mês atual)
        const transactions = await prisma.transaction.findMany();
        const revenue = transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
        const expenses = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);
        const currentProfit = revenue - expenses;

        // 2. Upsert da meta no banco
        const goal = await prisma.financialGoal.upsert({
            where: { id: `goal-${month}-${year}-PROFIT` }, // ID determinístico para simplificar
            update: { target: targetProfit, achieved: currentProfit },
            create: {
                id: `goal-${month}-${year}-PROFIT`,
                month,
                year,
                target: targetProfit,
                achieved: currentProfit,
                type: 'PROFIT'
            }
        });

        // 3. Cálculos de projeção (Ticket Médio Global)
        const summary = await prisma.transaction.aggregate({
            _sum: { amount: true },
            where: { type: 'INCOME' }
        });
        const totalTransactions = await prisma.transaction.count({ where: { type: 'INCOME' } });
        const ticketMedio = totalTransactions > 0 ? (summary._sum.amount || 0) / totalTransactions : 0;

        const estimatedRevenueNeeded = targetProfit / 0.3; // Baseado em margem de 30%
        const proceduresNeeded = ticketMedio > 0 ? Math.ceil(estimatedRevenueNeeded / ticketMedio) : 0;

        return {
            goal,
            projections: {
                estimatedRevenueNeeded,
                proceduresNeeded,
                ticketMedio,
                message: `Para lucrar R$ ${targetProfit.toLocaleString('pt-BR')}, você precisa de aproximadamente ${proceduresNeeded} procedimentos.`
            }
        };
    }
}
