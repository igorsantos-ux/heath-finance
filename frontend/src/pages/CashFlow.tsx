import React, { useState } from 'react';
import {
    ArrowUpCircle,
    ArrowDownCircle,
    Wallet,
    Filter,
    Download,
    Plus,
    X,
    CreditCard,
    Loader2
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financialApi } from '../services/api';

const CashFlow = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();

    // Fetch summary for headers
    const { data: summary } = useQuery({
        queryKey: ['financial-summary'],
        queryFn: async () => {
            const response = await financialApi.getSummary();
            return response.data;
        }
    });

    // Create mutation
    const createMutation = useMutation({
        mutationFn: (newTransaction: any) => financialApi.createTransaction(newTransaction),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
            setIsModalOpen(false);
        }
    });

    const handleCreateTransaction = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            description: formData.get('description'),
            amount: Number(formData.get('amount')),
            type: formData.get('type'),
            category: formData.get('category'),
        };
        createMutation.mutate(data);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Fluxo de Caixa</h2>
                    <p className="text-slate-500 mt-1">Controle de entradas e saídas mensais com projeção financeira.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-2 bg-[#10b981] text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Plus size={18} /> Nova Transação
                    </button>
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
                        <Download size={18} /> Exportar
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FlowCard title="Saldo em Caixa" value={`R$ ${summary?.netProfit?.toLocaleString() || '0'}`} icon={<Wallet className="text-blue-500" />} />
                <FlowCard title="Entradas (Mês)" value={`R$ ${summary?.revenue?.toLocaleString() || '0'}`} icon={<ArrowUpCircle className="text-emerald-500" />} />
                <FlowCard title="Saídas (Mês)" value={`R$ ${summary?.expenses?.toLocaleString() || '0'}`} icon={<ArrowDownCircle className="text-red-500" />} />
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm">
                <div className="p-8 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <h3 className="font-bold text-xl text-slate-800">Transações Recentes</h3>
                        <div className="flex bg-slate-100 p-1 rounded-xl">
                            <button className="px-4 py-1.5 bg-white shadow-sm rounded-lg text-xs font-bold text-slate-800 transition-all">Todas</button>
                            <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-all">Entradas</button>
                            <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-all">Saídas</button>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-all">
                        <Filter size={18} /> Filtrar Período
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <tbody className="divide-y divide-slate-100">
                            {/* Aqui idealmente teríamos uma query para listar transações, mas usaremos os dados de exemplo integrados aos novos endpoints em breve */}
                            <TransactionRow date="Hoje, 14:20" title="Procedimento Dermatológico" category="Receita Profissional" amount="+ R$ 1.200" type="income" />
                            <TransactionRow date="Hoje, 10:15" title="Compra de Material Cirúrgico" category="Suprimentos" amount="- R$ 350" type="expense" />
                            <TransactionRow date="Ontem, 16:45" title="Pagamento de Energia Elétrica" category="Custos Fixos" amount="- R$ 890" type="expense" />
                            <TransactionRow date="02 Mar, 11:00" title="Consulta Dr. Marcelo" category="Receita Consulta" amount="+ R$ 300" type="income" />
                        </tbody>
                    </table>
                </div>

                <div className="p-6 border-t border-slate-200 text-center">
                    <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-all">Ver extrato completo</button>
                </div>
            </div>

            {/* Modal Nova Transação */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                                    <CreditCard size={24} />
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900">Nova Transação</h3>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Lançamento Financeiro</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateTransaction} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição</label>
                                    <input name="description" required placeholder="Ex: Pagamento Fornecedor X" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:border-emerald-500 focus:outline-none font-semibold transition-all" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Valor (R$)</label>
                                        <input name="amount" type="number" step="0.01" required placeholder="0.00" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:border-emerald-500 focus:outline-none font-semibold transition-all" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo</label>
                                        <select name="type" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:border-emerald-500 focus:outline-none font-semibold transition-all appearance-none cursor-pointer">
                                            <option value="INCOME">Entrada (+)</option>
                                            <option value="EXPENSE">Saída (-)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoria</label>
                                    <input name="category" required placeholder="Ex: Aluguel, Suprimentos, Folha" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:border-emerald-500 focus:outline-none font-semibold transition-all" />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-8 py-4 border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    disabled={createMutation.isPending}
                                    className="flex-1 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                                >
                                    {createMutation.isPending ? <Loader2 className="animate-spin" /> : 'Confirmar Lançamento'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const FlowCard = ({ title, value, icon }: any) => (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-[#10b981]/30 transition-all">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:shadow-inner transition-all">
            {icon}
        </div>
        <div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{title}</p>
            <h4 className="text-2xl font-black text-slate-900">{value}</h4>
        </div>
    </div>
);

const TransactionRow = ({ date, title, category, amount, type }: any) => (
    <tr className="hover:bg-slate-50/50 transition-all group">
        <td className="px-8 py-6">
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${type === 'income' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-400'}`}>
                    {type === 'income' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                </div>
                <div>
                    <p className="font-bold text-slate-800 text-sm group-hover:text-black">{title}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">{category}</p>
                </div>
            </div>
        </td>
        <td className="px-8 py-6 text-slate-500 font-bold text-xs">{date}</td>
        <td className={`px-8 py-6 text-right font-black text-lg ${type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
            {amount}
        </td>
    </tr>
);

export default CashFlow;
