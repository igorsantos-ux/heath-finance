import prisma from './lib/prisma.js';
async function listUsers() {
    try {
        const users = await prisma.user.findMany({
            select: { email: true, role: true }
        });
        console.log('--- LISTA DE USUÁRIOS ---');
        console.log(JSON.stringify(users, null, 2));
    }
    catch (error) {
        console.error('Erro ao listar usuários:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
listUsers();
