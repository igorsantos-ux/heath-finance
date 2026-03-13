import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

export class PricingController {
    static async create(req: Request, res: Response): Promise<void> {
        try {
            const { name, sellingPrice, totalCost, netProfit, profitMargin, cardFeePercentage, taxPercentage, fixedCost, commission, supplies } = req.body;
            const clinicId = (req as any).user.clinicId;

            if (!clinicId) {
                res.status(403).json({ error: 'Acesso negado. Clínica não identificada.' });
                return;
            }

            const simulation = await prisma.$transaction(async (tx) => {
                const newSimulation = await tx.pricingSimulation.create({
                    data: {
                        name,
                        sellingPrice: Number(sellingPrice),
                        totalCost: Number(totalCost),
                        netProfit: Number(netProfit),
                        profitMargin: Number(profitMargin),
                        cardFeePercentage: Number(cardFeePercentage),
                        taxPercentage: Number(taxPercentage),
                        fixedCost: Number(fixedCost),
                        commission: Number(commission),
                        clinicId
                    }
                });

                if (supplies && supplies.length > 0) {
                    await tx.pricingSupply.createMany({
                        data: supplies.map((supply: any) => ({
                            name: supply.name,
                            quantity: Number(supply.quantity),
                            cost: Number(supply.cost),
                            pricingSimulationId: newSimulation.id
                        }))
                    });
                }

                return newSimulation;
            });

            res.status(201).json({ message: 'Simulação de precificação salva com sucesso', simulation });
        } catch (error) {
            console.error('Erro ao salvar simulação de precificação:', error);
            res.status(500).json({ error: 'Erro interno ao salvar simulação.' });
        }
    }

    static async list(req: Request, res: Response): Promise<void> {
        try {
            const clinicId = (req as any).user.clinicId;

            if (!clinicId) {
                res.status(403).json({ error: 'Acesso negado. Clínica não identificada.' });
                return;
            }

            const simulations = await prisma.pricingSimulation.findMany({
                where: { clinicId },
                include: { supplies: true },
                orderBy: { updatedAt: 'desc' }
            });

            res.json(simulations);
        } catch (error) {
            console.error('Erro ao listar simulações de precificação:', error);
            res.status(500).json({ error: 'Erro interno ao listar simulações.' });
        }
    }
}
