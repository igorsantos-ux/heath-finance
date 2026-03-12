const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const clinics = await prisma.clinic.findMany();
  console.log('Clínicas:', clinics.map(c => ({ id: c.id, name: c.name })));

  const users = await prisma.user.findMany();
  console.log('Usuários:', users.map(u => ({ id: u.id, name: u.name, clinicId: u.clinicId })));

  const installments = await prisma.accountPayableInstallment.findMany({
    take: 5,
    include: { accountPayable: true }
  });
  console.log('Últimas 5 parcelas:', installments.map(i => ({
    id: i.id,
    amount: i.amount,
    status: i.status,
    clinicId: i.accountPayable.clinicId
  })));

  const unpaid = await prisma.accountPayableInstallment.count({
    where: { status: { not: 'PAGO' } }
  });
  console.log('Total parcelas não pagas (todas clínicas):', unpaid);
}

main().catch(console.error).finally(() => prisma.$disconnect());
