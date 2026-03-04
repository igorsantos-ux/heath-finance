import { Transaction } from '@prisma/client';
import prisma from '../lib/prisma.js';

export class FinancialService {
    static async getSummary() {
        const transactions: Transaction[] = await prisma.transaction.findMany();

        const revenue = transactions
            .filter((t: Transaction) => t.type === 'INCOME')
            .reduce((acc: number, t: Transaction) => acc + t.amount, 0);

        const expenses = transactions
            .filter((t: Transaction) => t.type === 'EXPENSE')
            .reduce((acc: number, t: Transaction) => acc + t.amount, 0);

        return {
            revenue,
            expenses,
            netProfit: revenue - expenses,
            margin: revenue > 0 ? ((revenue - expenses) / revenue) * 100 : 0
        };
    }

    static async getBreakEven() {
        const transactions: Transaction[] = await prisma.transaction.findMany();

        // Simplificado: Custos Fixos são os categorizados como 'Fixo'
        const fixedCosts = transactions
            .filter((t: Transaction) => t.type === 'EXPENSE' && t.category === 'Fixo')
            .reduce((acc: number, t: Transaction) => acc + t.amount, 0);

        const variableCosts = transactions
            .filter((t: Transaction) => t.type === 'EXPENSE' && t.category !== 'Fixo')
            .reduce((acc: number, t: Transaction) => acc + t.amount, 0);

        const totalSales = transactions
            .filter((t: Transaction) => t.type === 'INCOME')
            .reduce((acc: number, t: Transaction) => acc + t.amount, 0);

        // Fórmula: Ponto de Equilíbrio = Custos Fixos / (1 - (Custos Variáveis / Vendas))
        const contributionMarginRatio = totalSales > 0 ? 1 - (variableCosts / totalSales) : 0;
        const breakEvenPoint = contributionMarginRatio > 0 ? fixedCosts / contributionMarginRatio : 0;

        return {
            fixedCosts,
            variableCosts,
            totalSales,
            breakEvenPoint,
            progress: totalSales > 0 ? Math.min((totalSales / breakEvenPoint) * 100, 100) : 0,
            remaining: Math.max(breakEvenPoint - totalSales, 0)
        };
    }

    static async createTransaction(data: { amount: number; type: 'INCOME' | 'EXPENSE'; category: string; description: string; doctorId?: string }) {
        return await prisma.transaction.create({
            data: {
                amount: data.amount,
                type: data.type,
                category: data.category,
                description: data.description,
                doctorId: data.doctorId || null,
                date: new Date()
            }
        });
    }
}
