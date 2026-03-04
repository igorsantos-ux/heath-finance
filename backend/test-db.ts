import prisma from './src/lib/prisma.js';

async function main() {
    try {
        const count = await prisma.transaction.count();
        console.log('Database connection successful. Transaction count:', count);
    } catch (error) {
        console.error('Database connection failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
