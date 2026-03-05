import prisma from '../lib/prisma.js';

export class SeedService {
    static async autoSeedIfEmpty() {
        try {
            const count = await prisma.transaction.count();
            if (count === 0) {
                console.log('Database is empty. Starting auto-seed with 2026 data...');
                await this.runSeed();
                console.log('Auto-seed completed successfully! 🚀');
            } else {
                console.log(`Database already has ${count} transactions. Skipping auto-seed.`);
            }
        } catch (error) {
            console.error('Failed to run auto-seed:', error);
        }
    }

    static async runSeed() {
        // Limpeza (opcional, mas bom para o comando manual)
        await prisma.transaction.deleteMany();
        await prisma.financialGoal.deleteMany();
        await prisma.lead.deleteMany();
        await prisma.stockItem.deleteMany();
        await prisma.doctor.deleteMany();
        await prisma.customer.deleteMany();

        // 1. Médicos
        const doctors = [
            { name: 'Dr. Marcelo Silva', specialty: 'Dermatologia', commission: 0.15 },
            { name: 'Dra. Ana Oliveira', specialty: 'Estética Avançada', commission: 0.20 },
            { name: 'Dr. Ricardo Santos', specialty: 'Cirurgia Plástica', commission: 0.25 },
            { name: 'Dra. Juliana Lima', specialty: 'Harmonização Facial', commission: 0.18 },
        ];

        const createdDoctors = [];
        for (const d of doctors) {
            createdDoctors.push(await prisma.doctor.create({ data: d }));
        }

        // 2. Clientes
        const customers = [
            { name: 'Maria Santos', email: 'maria@email.com', phone: '(11) 98888-7777' },
            { name: 'João Pereira', email: 'joao@email.com', phone: '(11) 97777-6666' },
            { name: 'Ana Costa', email: 'ana.c@email.com', phone: '(11) 96666-5555' },
            { name: 'Roberto Lima', email: 'roberto@email.com', phone: '(11) 95555-4444' },
            { name: 'Carla Dias', email: 'carla@email.com', phone: '(11) 94444-3333' },
        ];

        const createdCustomers = [];
        for (const c of customers) {
            createdCustomers.push(await prisma.customer.create({ data: c }));
        }

        // 3. Transações 2026
        const procedures = [
            { name: 'Botox', price: 1500, cost: 600 },
            { name: 'Preenchimento', price: 2200, cost: 1100 },
            { name: 'Bioestimulador', price: 3500, cost: 1800 },
            { name: 'Peeling', price: 600, cost: 150 },
        ];

        // Gerar JAN, FEB e MAR de 2026
        for (let month = 1; month <= 3; month++) {
            const transCount = 20;
            for (let i = 0; i < transCount; i++) {
                const proc = procedures[Math.floor(Math.random() * procedures.length)];
                const doc = createdDoctors[Math.floor(Math.random() * createdDoctors.length)];
                const cust = createdCustomers[Math.floor(Math.random() * createdCustomers.length)];
                const day = Math.floor(Math.random() * 28) + 1;

                await prisma.transaction.create({
                    data: {
                        description: `Atendimento ${proc.name} - ${cust.name}`,
                        amount: proc.price,
                        type: 'INCOME',
                        category: 'Procedimento',
                        procedureName: proc.name,
                        cost: proc.cost,
                        doctorId: doc.id,
                        customerId: cust.id,
                        date: new Date(2026, month - 1, day)
                    }
                });
            }

            // Despesas mensais
            await prisma.transaction.create({
                data: { description: 'Aluguel', amount: 8000, type: 'EXPENSE', category: 'Custos Fixos', date: new Date(2026, month - 1, 5) }
            });
            await prisma.transaction.create({
                data: { description: 'Salários Equipe', amount: 12000, type: 'EXPENSE', category: 'Custos Fixos', date: new Date(2026, month - 1, 20) }
            });
        }

        // 4. Metas
        const goals = [
            { month: 1, year: 2026, target: 120000, achieved: 125000, type: 'PROFIT' },
            { month: 2, year: 2026, target: 120000, achieved: 110000, type: 'PROFIT' },
            { month: 3, year: 2026, target: 150000, achieved: 45000, type: 'PROFIT' },
        ];
        for (const g of goals) {
            await prisma.financialGoal.create({ data: g });
        }

        // 5. Leads
        const leads = [
            { name: 'Juliana P.', source: 'Instagram', status: 'Novo' },
            { name: 'Marcos R.', source: 'Google', status: 'Contatado' },
            { name: 'Beatriz F.', source: 'Instagram', status: 'Convertido' },
        ];
        for (const l of leads) {
            await prisma.lead.create({ data: l });
        }

        // 6. Estoque
        const items = [
            { name: 'Botox 100U', category: 'Injetáveis', quantity: 15, minQuantity: 5, price: 1200 },
            { name: 'Ácido Hialurônico', category: 'Injetáveis', quantity: 25, minQuantity: 10, price: 850 },
        ];
        for (const it of items) {
            await prisma.stockItem.create({ data: it });
        }
    }
}
