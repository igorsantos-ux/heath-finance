import prisma from './lib/prisma.js';
async function sync() {
    console.log('🚀 Iniciando sincronização do banco de dados...');
    try {
        // SQL para adicionar as novas colunas se elas não existirem
        await prisma.$executeRawUnsafe(`
            ALTER TABLE "public"."Customer" 
            ADD COLUMN IF NOT EXISTS "externalId" TEXT,
            ADD COLUMN IF NOT EXISTS "externalSource" TEXT;
        `);
        console.log('✅ Colunas externalId e externalSource adicionadas.');
        // SQL para criar o índice único
        // Usamos um nome específico para o índice para evitar duplicatas se rodar novamente
        await prisma.$executeRawUnsafe(`
            CREATE UNIQUE INDEX IF NOT EXISTS "Customer_externalId_externalSource_clinicId_key" 
            ON "public"."Customer"("externalId", "externalSource", "clinicId") 
            WHERE "externalId" IS NOT NULL;
        `);
        console.log('✅ Índice único criado com sucesso.');
    }
    catch (error) {
        console.error('❌ Erro ao sincronizar banco:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
sync();
