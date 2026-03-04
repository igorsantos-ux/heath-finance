import { Request, Response } from 'express';
import { MedicalService, InventoryService } from '../services/CoreServices.js';

export class CoreController {
    static async getProductivity(req: Request, res: Response) {
        try {
            const data = await MedicalService.getProductivity();
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getStock(req: Request, res: Response) {
        try {
            const data = await InventoryService.getStockStatus();
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async createStock(req: Request, res: Response) {
        try {
            const { name, quantity, minQuantity, price, category } = req.body;
            const data = await InventoryService.createStockItem({
                name,
                quantity: Number(quantity),
                minQuantity: Number(minQuantity),
                price: Number(price),
                category
            });
            res.status(201).json(data);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async createDoctor(req: Request, res: Response) {
        try {
            const { name, specialty, commission } = req.body;
            const data = await MedicalService.createDoctor({
                name,
                specialty,
                commission: Number(commission)
            });
            res.status(201).json(data);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
