import {
    Target,
    Sparkles,
    TrendingUp,
    Rocket,
    CheckCircle2,
    ChevronRight
} from 'lucide-react';

const Goals = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Metas & Performance</h2>
                    <p className="text-slate-500 mt-1">Crie objetivos estratégicos para expandir o lucro da sua clínica.</p>
                </div>
                <button className="bg-[#10b981] text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-emerald-500/20 hover:bg-emerald-400 transition-all">
                    Nova Meta Smart
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Active Goal */}
                <div className="bg-[#0f172a] text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mb-32 -mr-32 blur-3xl group-hover:bg-emerald-500/10 transition-all duration-700"></div>

                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-[#10b981]/10 rounded-xl flex items-center justify-center border border-[#10b981]/20">
                            <Target size={24} className="text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Meta Ativa</p>
                            <h3 className="text-xl font-bold">Faturamento Recorde Março</h3>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Atingido</p>
                                <p className="text-4xl font-black">R$ 145.200</p>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Objetivo</p>
                                <p className="text-2xl font-bold text-slate-400">R$ 200.000</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="h-4 bg-slate-800/50 rounded-full border border-slate-700 p-1">
                                <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-1000" style={{ width: '72%' }}></div>
                            </div>
                            <p className="text-xs font-bold text-center text-slate-500 uppercase tracking-widest italic">Faltam R$ 54.800 para o próximo nível</p>
                        </div>
                    </div>
                </div>

                {/* AI Suggestion */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-[#10b981]/30 transition-all">
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                <Sparkles size={22} />
                            </div>
                            <h3 className="font-black text-xl text-slate-800 tracking-tight italic">Insight da Meta</h3>
                        </div>

                        <p className="text-slate-500 text-lg leading-relaxed font-medium mb-8">
                            "Para atingir sua meta de faturamento, você precisa de mais <span className="text-[#0f172a] font-black underline decoration-emerald-500/50 decoration-4">45 consultas de Botox</span> baseadas no seu ticket médio atual de <span className="text-emerald-600 font-bold">R$ 1.200</span>."
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-3">
                                <TrendingUp className="text-emerald-500" size={20} />
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase">Conversão</p>
                                    <p className="font-bold text-slate-800 text-sm">+8% este mês</p>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-3">
                                <Rocket className="text-blue-500" size={20} />
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase">Projeção</p>
                                    <p className="font-bold text-slate-800 text-sm">Atinge em 12 dias</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* History */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 bg-slate-50/50 border-b border-slate-200">
                    <h3 className="font-black text-slate-900 tracking-wider uppercase text-sm">Histórico de Objetivos</h3>
                </div>
                <div className="p-4 space-y-2">
                    <GoalHistoryItem title="Liquidez Total Fev/26" status="CONCLUÍDO" date="Feb 2026" result="105%" primary />
                    <GoalHistoryItem title="Redução Custos Operacionais" status="NÃO ATINGIDO" date="Jan 2026" result="88%" />
                    <GoalHistoryItem title="Performance Janeiro 2026" status="CONCLUÍDO" date="Jan 2026" result="112%" primary />
                </div>
            </div>
        </div>
    );
};

const GoalHistoryItem = ({ title, status, date, result, primary = false }: any) => (
    <div className="flex items-center justify-between p-4 px-6 hover:bg-slate-50/50 rounded-2xl transition-all group">
        <div className="flex items-center gap-6">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${primary ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-400'}`}>
                <CheckCircle2 size={18} />
            </div>
            <div>
                <h4 className="font-bold text-slate-800 group-hover:text-black transition-colors">{title}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{date}</p>
            </div>
        </div>
        <div className="flex items-center gap-8">
            <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-0.5">Resultado</p>
                <p className={`font-black ${primary ? 'text-emerald-600' : 'text-slate-500'}`}>{result}</p>
            </div>
            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest ${primary ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                {status}
            </span>
            <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
        </div>
    </div>
);

export default Goals;
