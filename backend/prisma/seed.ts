import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    // Limpar dados existentes
    await prisma.transaction.deleteMany()
    await prisma.doctor.deleteMany()
    await prisma.customer.deleteMany()
    await prisma.lead.deleteMany()
    await prisma.stockItem.deleteMany()
    await prisma.financialGoal.deleteMany()

    // 1. Criar Médicos
    const drSilva = await prisma.doctor.create({
        data: { name: 'Dr. Marcelo Silva', specialty: 'Dermatologia', commission: 0.15 }
    })
    const draOliveira = await prisma.doctor.create({
        data: { name: 'Dra. Ana Oliveira', specialty: 'Estética Avançada', commission: 0.20 }
    })

    // 2. Criar Clientes (Pacientes)
    const customers = [
        { name: 'Maria Santos', email: 'maria@email.com', phone: '(11) 98888-7777' },
        { name: 'João Pereira', email: 'joao@email.com', phone: '(11) 97777-6666' },
        { name: 'Ana Costa', email: 'ana.c@email.com', phone: '(11) 96666-5555' },
        { name: 'Roberto Lima', email: 'roberto@email.com', phone: '(11) 95555-4444' },
    ]
    const createdCustomers = []
    for (const c of customers) {
        createdCustomers.push(await prisma.customer.create({ data: c }))
    }

    // 3. Criar Transações de Procedimentos (Rentabilidade)
    // Botox: Preço 1500, Custo 600 -> Lucro 900
    // Preenchimento: Preço 2200, Custo 1100 -> Lucro 1100
    // Bioestimulador: Preço 3500, Custo 1800 -> Lucro 1700
    const transactions = [
        { description: 'Aplicação Botox 50U', amount: 1500, procedureName: 'Botox', cost: 600, type: 'INCOME', category: 'Procedimento', doctorId: drSilva.id, customerId: createdCustomers[0].id },
        { description: 'Aplicação Botox 50U', amount: 1500, procedureName: 'Botox', cost: 600, type: 'INCOME', category: 'Procedimento', doctorId: draOliveira.id, customerId: createdCustomers[1].id },
        { description: 'Preenchimento Labial', amount: 2200, procedureName: 'Preenchimento', cost: 1100, type: 'INCOME', category: 'Procedimento', doctorId: draOliveira.id, customerId: createdCustomers[2].id },
        { description: 'Bioestimulador de Colágeno', amount: 3500, procedureName: 'Bioestimulador', cost: 1800, type: 'INCOME', category: 'Procedimento', doctorId: drSilva.id, customerId: createdCustomers[0].id },
        { description: 'Peeling Químico', amount: 600, procedureName: 'Peeling', cost: 150, type: 'INCOME', category: 'Procedimento', doctorId: drSilva.id, customerId: createdCustomers[3].id },
        { description: 'Aluguel Unidade Central', amount: 8000, type: 'EXPENSE', category: 'Custos Fixos' },
        { description: 'Salários Equipe', amount: 12000, type: 'EXPENSE', category: 'Custos Fixos' },
    ]

    for (const t of transactions) {
        await prisma.transaction.create({ data: t })
    }

    // 4. Criar Leads (Análise de Funil)
    const leads = [
        { name: 'Carla Dias', source: 'Instagram', status: 'Novo' },
        { name: 'Bruno Souza', source: 'Instagram', status: 'Contatado' },
        { name: 'Fernanda Lima', source: 'Google', status: 'Convertido' },
        { name: 'Marcos Reus', source: 'Google', status: 'Convertido' },
        { name: 'Julia Roberts', source: 'Indicação', status: 'Contatado' },
        { name: 'Silvio Santos', source: 'Indicação', status: 'Novo' },
        { name: 'Sandra Rosa', source: 'Instagram', status: 'Convertido' },
    ]

    for (const l of leads) {
        await prisma.lead.create({ data: l })
    }

    // 5. Itens de Estoque (Sincronizado com custos)
    const stockItems = [
        { name: 'Toxina Botulínica 100U', category: 'Injetáveis', quantity: 8, minQuantity: 5, price: 1200 },
        { name: 'Ácido Hialurônico 1ml', category: 'Injetáveis', quantity: 12, minQuantity: 10, price: 850 },
        { name: 'Fios de PDO', category: 'Injetáveis', quantity: 3, minQuantity: 10, price: 450 },
    ]

    for (const item of stockItems) {
        await prisma.stockItem.create({ data: item })
    }

    // 6. Meta
    await prisma.financialGoal.create({
        data: { month: 3, year: 2026, target: 200000, achieved: 9300, type: 'PROFIT' }
    })

    console.log('Seed completed with Advanced Insights Data!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
