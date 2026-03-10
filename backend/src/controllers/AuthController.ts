import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { AuthService } from '../services/AuthService.js';

export class AuthController {
    static async login(req: Request, res: Response) {
        try {
            const { email: rawEmail, password } = req.body;
            const email = rawEmail?.toLowerCase().trim();

            console.log(`Tentativa de login para: ${email}`);

            const user = await prisma.user.findUnique({
                where: { email },
                include: { clinic: true }
            });

            if (!user) {
                console.warn(`[AUTH] Falha de login: Usuário NÃO ENCONTRADO (${email})`);
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            console.log(`[AUTH] Usuário encontrado: ${email}. Verificando senha...`);
            const isPasswordValid = await AuthService.comparePasswords(password, user.password);

            if (!isPasswordValid) {
                console.warn(`[AUTH] Falha de login: Senha INCORRETA para ${email}`);
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            console.log(`Login bem-sucedido: ${email} (${user.role})`);

            const token = AuthService.generateToken({
                id: user.id,
                email: user.email,
                role: user.role,
                clinicId: user.clinicId || undefined
            });

            res.json({
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    clinic: user.clinic
                },
                token
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Erro interno no servidor' });
        }
    }

    static async me(req: any, res: Response) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.user.id },
                include: { clinic: true }
            });

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                clinic: user.clinic
            });
        } catch (error) {
            res.status(500).json({ error: 'Erro interno no servidor' });
        }
    }
}
