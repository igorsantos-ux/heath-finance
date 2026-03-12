import prisma from './lib/prisma.js';
import { AuthService } from './services/AuthService.js';
async function debugAccess() {
    try {
        console.log('--- DIAGNÓSTICO DE ACESSO ---');
        const password = 'admin123';
        const hashedPassword = await AuthService.hashPassword(password);
        const monitorEmails = ['admin@heathfinance.com.br', 'roberta@alamino.com'];
        for (const email of monitorEmails) {
            console.log(`\nVerificando: ${email}`);
            const user = await prisma.user.findUnique({
                where: { email },
                include: { clinic: true }
            });
            if (user) {
                console.log(`✅ Usuário encontrado! Role: ${user.role}, Clínica: ${user.clinic?.name || 'Nenhuma'}`);
                // Força atualização
                await prisma.user.update({
                    where: { email },
                    data: { password: hashedPassword }
                });
                console.log(`🔄 Senha resetada para "admin123" com sucesso.`);
            }
            else {
                console.log(`❌ Usuário NÃO encontrado no banco.`);
                // Tenta criar se não existir (especialmente para Roberta)
                if (email === 'roberta@alamino.com') {
                    const clinic = await prisma.clinic.findFirst();
                    await prisma.user.create({
                        data: {
                            name: 'Roberta Alamino',
                            email,
                            password: hashedPassword,
                            role: 'CLINIC_ADMIN',
                            clinicId: clinic?.id
                        }
                    });
                    console.log(`🆕 Usuário criado agora!`);
                }
            }
        }
    }
    catch (error) {
        console.error('Erro no diagnóstico:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
debugAccess();
