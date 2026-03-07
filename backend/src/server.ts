import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import saasRoutes from './routes/saasRoutes.js';
import financialRoutes from './routes/financialRoutes.js';
import coreRoutes from './routes/coreRoutes.js';
import reportingRoutes from './routes/reportingRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import { SeedService } from './services/SeedService.js';

dotenv.config();

app.use('/api/history', historyRoutes);

process.on('SIGTERM', () => {
    console.log('SIGTERM recebido. Encerrando graciosamente...');
    process.exit(0);
});

process.on('uncaughtException', (err) => {
    console.error('Exceção não capturada:', err);
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Heath Finance API is running' });
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    SeedService.autoSeedIfEmpty().catch(err => console.error('Erro no auto-seed background:', err));
});
