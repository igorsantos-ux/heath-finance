import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    TrendingUp,
    TrendingDown,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    MessageSquare,
    Activity,
    ArrowRight
} from 'lucide-react';
import {
    LineChart,
    Line,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    AreaChart,
    Area,
    BarChart,
    Bar,
    Cell,
    PieChart as RePieChart,
    Pie
} from 'recharts';
// import { useQuery } from '@tanstack/react-query';
// import { financialApi, reportingApi } from '../services/api';

const Dashboard = () => {
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('Este Mês');
    const [customStartDate, setCustomStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [customEndDate, setCustomEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [transactionType, setTransactionType] = useState<'income' | 'expense' | null>(null);
    const [formData, setFormData] = useState({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        description: '',
        status: 'PAID'
    });
    const [isSaving, setIsSaving] = useState(false);

    // Dados Fictícios de Alta Densidade (Mock Data)
    const summary = {
        revenue: 125400,
        balance: 98200,
        pendingPayables: 15400,
        pendingReceivables: 42300,
        margin: 78.4,
        projections: { estimatedBalance: 112000 },
        expenses: 27200,
        riskLevel: 40,
        loanTracking: 85
    };

    const sparklineData = [
        { value: 400 }, { value: 700 }, { value: 500 }, { value: 800 },
        { value: 650 }, { value: 900 }, { value: 750 }, { value: 1100 },
        { value: 950 }, { value: 1300 }, { value: 1200 }, { value: 1400 }
    ];

    const evolution = [
        { day: '01', income: 4500, expenses: 2100 },
        { day: '02', income: 5200, expenses: 2400 },
        { day: '03', income: 4800, expenses: 2800 },
        { day: '04', income: 6100, expenses: 3100 },
        { day: '05', income: 5500, expenses: 2600 },
        { day: '06', income: 5900, expenses: 2900 },
        { day: '07', income: 7200, expenses: 1500 },
        { day: '08', income: 6800, expenses: 2200 },
        { day: '09', income: 7500, expenses: 1800 },
        { day: '10', income: 8100, expenses: 2500 },
        { day: '11', income: 7900, expenses: 2100 },
        { day: '12', income: 8500, expenses: 1900 },
        { day: '13', income: 9200, expenses: 2400 },
        { day: '14', income: 8800, expenses: 2000 },
        { day: '15', income: 9500, expenses: 2300 }
    ];

    // Mini Sparkline para KPIs
    const MiniSparkline = ({ color }: { color: string }) => (
        <div className="h-8 w-24">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={true}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );

    // Gráfico de Meia-Lua (Gauge) para Riscos/Metas
    const GaugeChart = ({ value, label, color }: { value: number, label: string, color: string }) => {
        const data = [
            { name: 'Progress', value: value },
            { name: 'Remaining', value: 100 - value }
        ];

        return (
            <div className="relative flex flex-col items-center">
                <div className="h-32 w-32">
                    <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="80%"
                                startAngle={180}
                                endAngle={0}
                                innerRadius={45}
                                outerRadius={60}
                                paddingAngle={0}
                                dataKey="value"
                                stroke="none"
                            >
                                <Cell key="cell-0" fill={color} />
                                <Cell key="cell-1" fill="#f1f5f9" /> {/* Zinc-100 for light theme track */}
                            </Pie>
                        </RePieChart>
                    </ResponsiveContainer>
                </div>
                <div className="absolute top-[55%] text-center">
                    <p className="text-xl font-black text-[#697D58] leading-none">{value}%</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{label}</p>
                </div>
            </div>
        );
    };

    const handleSaveTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!transactionType) return;

        setIsSaving(true);
        try {
            // Em uma implementação real, chamaríamos:
            // await financialApi.createTransaction({ ...formData, type: transactionType, clinicId: 'default' });

            // Simulação de sucesso para demonstração
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log('Transaction saved:', { ...formData, type: transactionType });
            setIsTransactionModalOpen(false);
            setTransactionType(null);
            setFormData({
                amount: '',
                date: new Date().toISOString().split('T')[0],
                category: '',
                description: '',
                status: 'PAID'
            });
            alert('Lançamento realizado com sucesso!');
        } catch (error) {
            console.error('Error saving transaction:', error);
            alert('Erro ao salvar lançamento. Tente novamente.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            {/* Dash Header - Micro Stats */}
            <div className="flex flex-wrap items-end gap-12 mb-4">
                <div className="flex items-center gap-4">
                    <span className="text-4xl font-black text-[#697D58] tracking-tighter">165</span>
                    <div className="flex flex-col">
                        <MiniSparkline color="#8A9A5B" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Novos Pacientes</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-4xl font-black text-[#697D58] tracking-tighter">16</span>
                    <div className="flex flex-col">
                        <MiniSparkline color="#DEB587" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Faturas a Vencer</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-4xl font-black text-[#697D58] tracking-tighter">21</span>
                    <div className="flex flex-col">
                        <MiniSparkline color="#8A9A5B" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Em Atendimento</span>
                    </div>
                </div>

                <div className="ml-auto flex items-center gap-3">
                    <button
                        onClick={() => setIsFilterModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/50 border border-[#8A9A5B]/10 rounded-xl font-bold text-xs text-[#697D58] hover:bg-white transition-all shadow-sm"
                    >
                        <Filter size={14} />
                        {selectedPeriod}
                    </button>
                    <button
                        className="p-2.5 bg-white/50 border border-[#8A9A5B]/10 rounded-xl text-[#697D58] hover:bg-white transition-all shadow-sm"
                        title="Customização"
                    >
                        <Activity size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Column - Detailed Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] border border-[#8A9A5B]/10 shadow-sm relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-6">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Taxa de Conversão</span>
                            <ArrowUpRight size={16} className="text-[#8A9A5B]" />
                        </div>
                        <h4 className="text-2xl font-black text-[#697D58] mb-1">NO.1 CLINIC</h4>
                        <p className="text-[10px] text-slate-400 font-bold mb-6">#UNIDADE-MATRIZ</p>

                        <div className="flex items-center justify-center mb-6">
                            <GaugeChart value={78} label="Conversão" color="#8A9A5B" />
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-500">Fixed-Rate</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-black text-[#697D58]">5.82%</span>
                                    <span className="text-[9px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded font-black">+0.24</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-500">ARM</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-black text-[#697D58]">4.47%</span>
                                    <span className="text-[9px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded font-black">+0.16</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#697D58] p-6 rounded-[2rem] shadow-xl text-white relative h-64 overflow-hidden group cursor-pointer">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <MessageSquare size={24} className="mb-4 text-[#DEB587]" />
                        <h5 className="text-lg font-black leading-tight mb-2">Insights do <br />Assistente IA</h5>
                        <p className="text-xs text-[#F0EAD6]/70 leading-relaxed mb-4">Seu faturamento aumentou 12% em comparação à semana passada. Sugerimos revisar as contas a pagar.</p>

                        <div className="flex flex-wrap gap-2">
                            {['Risco', 'Tendência', 'Status'].map(t => (
                                <span key={t} className="text-[9px] font-black bg-white/10 px-2 py-1 rounded-lg border border-white/10">{t}</span>
                            ))}
                        </div>
                        <div className="absolute bottom-6 right-6 p-2 bg-white/20 rounded-full group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                            <ArrowUpRight size={16} />
                        </div>
                    </div>
                </div>

                {/* Center Column - Large Chart Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-[#8A9A5B]/10 relative h-[500px]">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h3 className="text-2xl font-black text-[#697D58]">Fluxo de Evolução</h3>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Visão Detalhada Diária</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400">
                                    <div className="w-2 h-2 rounded-full bg-[#8A9A5B]"></div> RECEITA
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400">
                                    <div className="w-2 h-2 rounded-full bg-[#DEB587]"></div> DESPESA
                                </div>
                            </div>
                        </div>

                        <div className="h-[340px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={evolution}>
                                    <defs>
                                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8A9A5B" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8A9A5B" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 900, fill: '#cbd5e1' }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="income" stroke="#8A9A5B" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                                    <Area type="monotone" dataKey="expenses" stroke="#DEB587" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="absolute bottom-10 left-10 right-10 flex justify-between items-center pt-6 border-t border-slate-50">
                            <div className="flex gap-8">
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Área Total</p>
                                    <p className="text-lg font-black text-[#697D58]">2,5K m²</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Valor de Mercado</p>
                                    <p className="text-lg font-black text-[#697D58]">R$ 650k</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsTransactionModalOpen(true)}
                                className="px-6 py-3 bg-[#8A9A5B] text-white rounded-2xl font-black text-xs shadow-lg shadow-[#8A9A5B]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                            >
                                <Plus size={16} /> NOVO LANÇAMENTO
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white/70 p-8 rounded-[2rem] border border-[#8A9A5B]/10">
                            <div className="flex justify-between mb-4">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Faturamento</span>
                                <ArrowUpRight size={14} className="text-[#8A9A5B]" />
                            </div>
                            <div className="flex items-end justify-between">
                                <h4 className="text-2xl font-black text-[#697D58]">R$ {(summary.revenue / 1000).toFixed(1)}k</h4>
                                <MiniSparkline color="#8A9A5B" />
                            </div>
                        </div>
                        <div className="bg-white/70 p-8 rounded-[2rem] border border-[#8A9A5B]/10">
                            <div className="flex justify-between mb-4">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Despesas</span>
                                <ArrowDownRight size={14} className="text-rose-400" />
                            </div>
                            <div className="flex items-end justify-between">
                                <h4 className="text-2xl font-black text-[#697D58]">R$ {(summary.expenses / 1000).toFixed(1)}k</h4>
                                <MiniSparkline color="#DEB587" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Small Gauges & Community */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[2rem] border border-[#8A9A5B]/10 shadow-sm overflow-hidden">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Prazos e Metas</h4>

                        <div className="space-y-10">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs font-black text-[#697D58]">Metas do Trimestre</span>
                                    <span className="text-xs font-black text-[#8A9A5B]">{summary.loanTracking}%</span>
                                </div>
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#8A9A5B] w-[85%] rounded-full shadow-sm shadow-[#8A9A5B]/20"></div>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <GaugeChart value={summary.riskLevel} label="Risco Médio" color="#DEB587" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Borrower</p>
                                    <p className="text-sm font-black text-[#697D58]">19%</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending</p>
                                    <p className="text-sm font-black text-[#697D58]">18%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#8A9A5B] to-[#697D58] p-8 rounded-[2rem] shadow-xl text-white relative h-64 flex flex-col justify-between overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:scale-125 transition-transform"></div>
                        <div>
                            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-4">Comunidade</h5>
                            <h4 className="text-lg font-black leading-tight">Conecte-se com <br />outros gestores</h4>
                        </div>
                        <div className="flex -space-x-3 mb-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#8A9A5B] bg-slate-200 overflow-hidden shadow-sm shadow-black/20">
                                    <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" />
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-[#8A9A5B] bg-white/20 backdrop-blur-sm flex items-center justify-center text-[10px] font-black">
                                +2K
                            </div>
                        </div>
                        <button className="w-full py-3 bg-white text-[#697D58] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#F0EAD6] transition-all flex items-center justify-center gap-2">
                            Acessar Forúm <ArrowRight size={12} />
                        </button>
                    </div>
                </div>
            </div>


            {/* Filter Modal */}
            {isFilterModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
                    <div className="bg-white rounded-[2.5rem] max-w-md w-full p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-[#697D58]">Filtrar Período</h3>
                            <button onClick={() => setIsFilterModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <Plus size={24} className="rotate-45 text-slate-400" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {['Hoje', 'Últimos 7 dias', 'Este Mês', 'Últimos 30 dias', 'Este Ano', 'Personalizado'].map((period) => (
                                <button
                                    key={period}
                                    onClick={() => {
                                        setSelectedPeriod(period);
                                        if (period !== 'Personalizado') {
                                            setIsFilterModalOpen(false);
                                        }
                                    }}
                                    className={`w-full py-4 px-6 rounded-2xl font-bold text-left transition-all flex justify-between items-center ${selectedPeriod === period
                                        ? 'bg-[#8A9A5B] text-white shadow-lg shadow-[#8A9A5B]/20 translate-x-1'
                                        : 'bg-slate-50 text-slate-600 hover:bg-[#8A9A5B]/10 hover:text-[#697D58]'
                                        }`}
                                >
                                    {period}
                                    {selectedPeriod === period && <ArrowRight size={18} />}
                                </button>
                            ))}
                        </div>

                        {selectedPeriod === 'Personalizado' && (
                            <div className="mt-6 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-300">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Data Início</label>
                                    <input
                                        type="date"
                                        value={customStartDate}
                                        onChange={(e) => setCustomStartDate(e.target.value)}
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-bold outline-none focus:border-[#8A9A5B] transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Data Fim</label>
                                    <input
                                        type="date"
                                        value={customEndDate}
                                        onChange={(e) => setCustomEndDate(e.target.value)}
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-bold outline-none focus:border-[#8A9A5B] transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => {
                                console.log('Applying filter for:', selectedPeriod, selectedPeriod === 'Personalizado' ? { customStartDate, customEndDate } : '');
                                setIsFilterModalOpen(false);
                            }}
                            className="w-full mt-8 py-4 bg-[#697D58] text-white rounded-2xl font-black shadow-xl hover:brightness-110 active:scale-95 transition-all"
                        >
                            Aplicar Filtro
                        </button>
                    </div>
                </div>
            )}

            {/* Transaction Modal */}
            {isTransactionModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white rounded-[3rem] max-w-xl w-full max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl relative"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-10 py-8 flex justify-between items-center border-b border-slate-100">
                            <div>
                                <h3 className="text-3xl font-black text-[#697D58] tracking-tight">
                                    {transactionType ? (transactionType === 'income' ? 'Nova Receita' : 'Nova Despesa') : 'Novo Lançamento'}
                                </h3>
                                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Gestão de Patrimônio</p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsTransactionModalOpen(false);
                                    setTransactionType(null);
                                }}
                                className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-[#DEB587]"
                            >
                                <Plus size={24} className="rotate-45" />
                            </button>
                        </div>

                        <div className="p-10">
                            {!transactionType ? (
                                <div className="space-y-8">
                                    <p className="text-slate-500 font-medium leading-relaxed">Qual a natureza do lançamento que deseja realizar hoje?</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <button
                                            onClick={() => setTransactionType('income')}
                                            className="p-10 bg-[#8A9A5B]/5 border-2 border-[#8A9A5B]/10 rounded-[2.5rem] flex flex-col items-center gap-6 hover:bg-[#8A9A5B] hover:text-white transition-all group hover:scale-[1.02] shadow-sm hover:shadow-xl hover:shadow-[#8A9A5B]/20"
                                        >
                                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-[#8A9A5B] group-hover:scale-110 transition-transform shadow-sm">
                                                <TrendingUp size={40} />
                                            </div>
                                            <div className="text-center">
                                                <span className="font-black text-xl block mb-1">Receita</span>
                                                <span className="text-xs font-bold opacity-60 uppercase tracking-widest">Entrada de Capital</span>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => setTransactionType('expense')}
                                            className="p-10 bg-[#DEB587]/5 border-2 border-[#DEB587]/10 rounded-[2.5rem] flex flex-col items-center gap-6 hover:bg-[#DEB587] hover:text-white transition-all group hover:scale-[1.02] shadow-sm hover:shadow-xl hover:shadow-[#DEB587]/20"
                                        >
                                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-[#DEB587] group-hover:scale-110 transition-transform shadow-sm">
                                                <TrendingDown size={40} />
                                            </div>
                                            <div className="text-center">
                                                <span className="font-black text-xl block mb-1">Despesa</span>
                                                <span className="text-xs font-bold opacity-60 uppercase tracking-widest">Saída de Capital</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSaveTransaction} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    {/* Value Input - Highlighted */}
                                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 focus-within:ring-4 focus-within:ring-[#8A9A5B]/10 focus-within:border-[#8A9A5B] transition-all">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Valor do Lançamento</label>
                                        <div className="flex items-center gap-4">
                                            <span className="text-4xl font-black text-[#697D58]">R$</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                autoFocus
                                                value={formData.amount}
                                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                                placeholder="0,00"
                                                className="bg-transparent text-5xl font-black text-[#1A202C] outline-none w-full placeholder:text-slate-200"
                                            />
                                        </div>
                                    </div>

                                    {/* Secondary Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Data</label>
                                            <input
                                                type="date"
                                                required
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-600 focus:border-[#8A9A5B] outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Categoria</label>
                                            <select
                                                required
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-600 focus:border-[#8A9A5B] outline-none transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="">Selecione...</option>
                                                {transactionType === 'income' ? (
                                                    <>
                                                        <option value="CONSULTA">Consulta Particular</option>
                                                        <option value="PROCEDIMENTO">Procedimento</option>
                                                        <option value="CONVENIO">Repasse Convênio</option>
                                                        <option value="OUTROS">Outras Receitas</option>
                                                    </>
                                                ) : (
                                                    <>
                                                        <option value="ALUGUEL">Aluguel / Condomínio</option>
                                                        <option value="SALARIO">Salários / Folha</option>
                                                        <option value="FORNECEDOR">Fornecedores</option>
                                                        <option value="MARKETING">Marketing / Tráfego</option>
                                                        <option value="OUTROS">Outras Despesas</option>
                                                    </>
                                                )}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Descrição (Opcional)</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Detalhes sobre este lançamento..."
                                            rows={2}
                                            className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-600 focus:border-[#8A9A5B] outline-none transition-all resize-none"
                                        />
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setTransactionType(null)}
                                            className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-2xl font-black hover:bg-slate-100 transition-all active:scale-95"
                                        >
                                            Voltar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className={`flex-[2] py-5 text-white rounded-2xl font-black shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${transactionType === 'income' ? 'bg-[#8A9A5B] shadow-[#8A9A5B]/20' : 'bg-[#DEB587] shadow-[#DEB587]/20'
                                                } ${isSaving ? 'opacity-70 cursor-not-allowed scale-100' : 'hover:scale-[1.02]'}`}
                                        >
                                            {isSaving ? (
                                                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <>Confirmar Lançamento <ArrowRight size={20} /></>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
