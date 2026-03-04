import prisma from '../lib/prisma.js';

export class AnalyticsService {
    static async getDashboardInsights() {
        // 1. Procedimento mais rentável (Agregação manual pois SQLite é limitado)
        const transactions = await prisma.transaction.findMany({
            where: { type: 'INCOME', NOT: { procedureName: null } }
        });

        const procedureStats = transactions.reduce((acc: any, t) => {
            const name = t.procedureName!;
            if (!acc[name]) acc[name] = { name, revenue: 0, cost: 0, count: 0 };
            acc[name].revenue += t.amount;
            acc[name].cost += t.cost;
            acc[name].count += 1;
            return acc;
        }, {});

        const sortedProcedures = Object.values(procedureStats)
            .map((p: any) => ({
                ...p,
                profit: p.revenue - p.cost,
                margin: ((p.revenue - p.cost) / p.revenue) * 100,
                avgTicket: p.revenue / p.count
            }))
            .sort((a, b) => b.profit - a.profit);

        // 2. Cliente que mais compra
        const customerTransactions = await prisma.transaction.findMany({
            where: { NOT: { customerId: null } },
            include: { customer: true }
        });

        const customerStats = customerTransactions.reduce((acc: any, t) => {
            const id = t.customerId!;
            if (!acc[id]) acc[id] = { name: t.customer?.name, total: 0, count: 0 };
            acc[id].total += t.amount;
            acc[id].count += 1;
            return acc;
        }, {});

        const topCustomers = Object.values(customerStats)
            .sort((a: any, b: any) => b.total - a.total)
            .slice(0, 5);

        // 3. Ticket Médio por Médico
        const doctors = await prisma.doctor.findMany({
            include: { transactions: { where: { type: 'INCOME' } } }
        });

        const doctorStats = doctors.map(d => {
            const total = d.transactions.reduce((acc, t) => acc + t.amount, 0);
            return {
                name: d.name,
                avgTicket: d.transactions.length > 0 ? total / d.transactions.length : 0,
                totalRevenue: total,
                count: d.transactions.length
            };
        }).sort((a, b) => b.avgTicket - a.avgTicket);

        // 4. Análise de Leads
        const leads = await prisma.lead.findMany();
        const leadBySource = leads.reduce((acc: any, l) => {
            acc[l.source] = (acc[l.source] || 0) + 1;
            return acc;
        }, {});

        const leadByStatus = leads.reduce((acc: any, l) => {
            acc[l.status] = (acc[l.status] || 0) + 1;
            return acc;
        }, {});

        return {
            proceduresRentability: sortedProcedures,
            topCustomers,
            doctorPerformance: doctorStats,
            leadsAnalytics: {
                bySource: Object.entries(leadBySource).map(([label, value]) => ({ label, value })),
                byStatus: Object.entries(leadByStatus).map(([label, value]) => ({ label, value })),
                total: leads.length
            }
        };
    }
}
