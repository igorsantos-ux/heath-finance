import prisma from './lib/prisma.js';
async function syncTable() {
    try {
        console.log('--- Sincronizando Tabela Integration ---');
        // 1. Criar a tabela
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "Integration" (
                "id" TEXT NOT NULL,
                "type" TEXT NOT NULL,
                "token" TEXT NOT NULL,
                "settings" JSONB,
                "isActive" BOOLEAN NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "clinicId" TEXT NOT NULL,
                CONSTRAINT "Integration_pkey" PRIMARY KEY ("id")
            );
        `);
        // 2. Criar o índice único
        await prisma.$executeRawUnsafe(`
            CREATE UNIQUE INDEX IF NOT EXISTS "Integration_clinicId_type_key" ON "Integration"("clinicId", "type");
        `);
        // 3. Adicionar FK se não existir
        await prisma.$executeRawUnsafe(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Integration_clinicId_fkey') THEN
                    ALTER TABLE "Integration" ADD CONSTRAINT "Integration_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
                END IF;
            END
            $$;
        `);
        console.log('✅ Tabela Integration sincronizada com sucesso!');
        console.log('✅ Tabela Integration criada ou já existente!');
    }
    catch (error) {
        console.error('Erro ao sincronizar tabela:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
syncTable();
