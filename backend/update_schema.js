const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Running raw SQL to add isActive column...');
        await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;`);
        console.log('✅ Column "isActive" added successfully to User table.');
    } catch (error) {
        console.error('❌ Error executing SQL:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
