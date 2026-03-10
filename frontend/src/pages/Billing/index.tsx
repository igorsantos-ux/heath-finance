import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { reportingApi, integrationApi } from '../../services/api';
import {
    BarChart3,
    Users,
    Tags,
    TrendingUp,
    Calendar,
    Filter,
    Download,
    RefreshCw,
    Loader2
} from 'lucide-react';

const BillingPage = () => {
    const queryClient = useQueryClient();
    const [isSyncing, setIsSyncing] = useState(false);

    const { data: billingData, isLoading } = useQuery({
        queryKey: ['billing-analytics'],
        queryFn: async () => {
            const response = await reportingApi.getBillingAnalytics();
            return response.data;
        }
    });

    // Gatilho de Sincronização Automática On-Demand
    useEffect(() => {
        const triggerSync = async () => {
            try {
                // Verifica se a integração está ativa antes de disparar (opcional, o backend já valida)
                setIsSyncing(true);
                await integrationApi.sync('finance');
                // Invalida a query para forçar o reload dos dados novos
                queryClient.invalidateQueries({ queryKey: ['billing-analytics'] });
                console.log('✅ Dados financeiros atualizados com Feegow via auto-sync.');
            } catch (error) {
                console.warn('Auto-sync Feegow ignorado ou falhou:', error);
            } finally {
                setIsSyncing(false);
            }
        };

        triggerSync();
    }, [queryClient]);

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-[#8A9A5B] animate-spin" />
                <p className="text-[#697D58] font-bold animate-pulse">Carregando painel de faturamento...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black tracking-tight text-[#697D58]">Faturamento Detalhado</h2>
                    <div className="flex items-center gap-4 mt-1">
                        <p className="text-slate-500 font-medium">Análise de performance por médico e categoria.</p>
                        {isSyncing && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-[#8A9A5B]/10 border border-[#8A9A5B]/20 rounded-full animate-in fade-in zoom-in duration-300">
                                <RefreshCw className="w-3 h-3 text-[#8A9A5B] animate-spin" />
                                <span className="text-[10px] font-black text-[#697D58] uppercase tracking-widest">Atualizando com Feegow...</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-3 bg-white border border-[#8A9A5B]/20 rounded-2xl font-bold text-sm text-[#697D58] hover:bg-[#8A9A5B]/5 transition-all shadow-sm">
                        <Download size={18} /> Exportar
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-[#8A9A5B] text-white rounded-2xl font-bold text-sm shadow-xl shadow-[#8A9A5B]/20 hover:scale-[1.02] active:scale-95 transition-all">
                        <Filter size={20} /> Período
                    </button>
                </div>
            </div>

            {/* Total Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPICard
                    title="Faturamento Total"
                    value={`R$ ${billingData?.totalBilling?.toLocaleString() || '0'}`}
                    icon={<BarChart3 size={24} />}
                />
                <KPICard
                    title="Média Mensal"
                    value={`R$ ${(billingData?.totalBilling / 12 || 0).toLocaleString() || '0'}`}
                    icon={<Calendar size={24} />}
                />
                <KPICard
                    title="Melhor Médico"
                    value={billingData?.byDoctor?.[0]?.doctorName || '---'}
                    icon={<Users size={24} />}
                    subtitle={`R$ ${billingData?.byDoctor?.[0]?.total?.toLocaleString() || '0'}`}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Doctor Breakdown */}
                <div className="bg-white/70 backdrop-blur-md p-10 rounded-[2.5rem] border border-[#8A9A5B]/10 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-[#8A9A5B]/10 rounded-2xl flex items-center justify-center text-[#8A9A5B]">
                            <Users size={24} />
                        </div>
                        <h3 className="font-extrabold text-2xl text-[#697D58]">Por Médico</h3>
                    </div>
                    <div className="space-y-6">
                        {billingData?.byDoctor?.map((doc: any, i: number) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center text-sm font-bold">
                                    <span className="text-slate-700">{doc.doctorName}</span>
                                    <span className="text-[#697D58]">R$ {doc.total.toLocaleString()}</span>
                                </div>
                                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#8A9A5B] rounded-full transition-all duration-1000"
                                        style={{ width: `${(doc.total / (billingData.totalBilling || 1)) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Participação: {doc.percentage?.toFixed(1)}%</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="bg-white/70 backdrop-blur-md p-10 rounded-[2.5rem] border border-[#8A9A5B]/10 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-[#DEB587]/10 rounded-2xl flex items-center justify-center text-[#DEB587]">
                            <Tags size={24} />
                        </div>
                        <h3 className="font-extrabold text-2xl text-[#697D58]">Por Categoria</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {billingData?.byCategory?.map((cat: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-[#8A9A5B]/5 hover:border-[#8A9A5B]/20 transition-all group cursor-default shadow-sm hover:shadow-md">
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-[#DEB587] group-hover:text-white transition-all duration-300">
                                        <TrendingUp size={20} />
                                    </div>
                                    <span className="font-black text-slate-700">{cat.category || 'Outros'}</span>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-[#697D58] text-lg">R$ {cat.total.toLocaleString()}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{cat.count} transação(ões)</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const KPICard = ({ title, value, icon, subtitle }: any) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-[#8A9A5B]/10 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            {icon}
        </div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">{title}</p>
        <div className="flex flex-col">
            <h4 className="text-3xl font-black text-[#1A202C]">{value}</h4>
            {subtitle && (
                <div className="flex items-center gap-1.5 mt-2 bg-[#8A9A5B]/5 w-fit px-3 py-1 rounded-full border border-[#8A9A5B]/10 animate-in zoom-in-90 duration-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8A9A5B]"></span>
                    <span className="text-xs font-black text-[#697D58]">{subtitle}</span>
                </div>
            )}
        </div>
    </div>
);

export default BillingPage;
