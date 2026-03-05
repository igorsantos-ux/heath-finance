import {
    Target,
    TrendingUp,
    CheckCircle2,
    Clock,
    ArrowUpRight,
    BarChart3,
    Trophy,
    Flame
} from 'lucide-react';

const Goals = () => {
    const goalsList = [
        { id: '1', title: 'Faturamento Mensal', current: 45000, target: 60000, deadline: '31/03', type: 'finance' },
        { id: '2', title: 'Novos Pacientes', current: 28, target: 40, deadline: '31/03', type: 'growth' },
        { id: '3', title: 'Margem Líquida', current: 18, target: 25, deadline: '30/06', type: 'efficiency' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black tracking-tight text-[#697D58]">Metas e OKRs</h2>
                    <p className="text-slate-500 font-medium mt-1">Acompanhamento estratégico de objetivos do negócio.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-[#8A9A5B] text-white rounded-2xl font-bold text-sm shadow-xl shadow-[#8A9A5B]/20 hover:scale-[1.02] active:scale-95 transition-all">
                        <PlusIcon />
                        Nova Meta
                    </button>
                </div>
            </div>

            {/* Top Insight */}
            <div className="bg-[#697D58] text-white p-12 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="relative z-10 w-32 h-32 bg-white/10 rounded-[2.5rem] border border-white/20 flex items-center justify-center shrink-0">
                    <Trophy size={64} className="text-[#DEB587]" />
                </div>
                <div className="relative z-10 flex-1">
                    <h3 className="text-3xl font-black mb-4">Você está no caminho certo!</h3>
                    <p className="text-[#F0EAD6]/80 font-medium text-lg leading-relaxed mb-8 max-w-2xl">
                        Este trimestre sua clínica atingiu <span className="text-white font-black text-xl">82%</span> do objetivo global. O foco agora deve ser na fidelização de pacientes eletivos.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <span className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-xs font-black uppercase tracking-widest"><CheckCircle2 size={16} /> 2 Metas Batidas</span>
                        <span className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-xs font-black uppercase tracking-widest"><Flame size={16} /> 1 Em Atraso</span>
                    </div>
                </div>
            </div>

            {/* Goals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {goalsList.map((goal) => (
                    <div key={goal.id} className="bg-white p-8 rounded-[2.5rem] border border-[#8A9A5B]/10 shadow-sm hover:shadow-xl transition-all group">
                        <div className="flex justify-between items-start mb-8">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${goal.type === 'finance' ? 'bg-[#8A9A5B]/10 text-[#8A9A5B]' :
                                goal.type === 'growth' ? 'bg-[#DEB587]/10 text-[#DEB587]' :
                                    'bg-slate-100 text-slate-500'
                                }`}>
                                {goal.type === 'finance' ? <BarChart3 size={28} /> : goal.type === 'growth' ? <TrendingUp size={28} /> : <Target size={28} />}
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                <Clock size={12} /> {goal.deadline}
                            </span>
                        </div>

                        <h4 className="text-xl font-black text-[#697D58] mb-2">{goal.title}</h4>

                        <div className="mb-6">
                            <div className="flex justify-between items-end mb-3">
                                <span className="text-2xl font-black text-slate-800">
                                    {goal.type === 'finance' ? `R$ ${goal.current.toLocaleString()}` : goal.type === 'efficiency' ? `${goal.current}%` : goal.current}
                                </span>
                                <span className="text-xs font-bold text-slate-400">Objetivo: {goal.type === 'finance' ? `R$ ${goal.target.toLocaleString()}` : goal.type === 'efficiency' ? `${goal.target}%` : goal.target}</span>
                            </div>
                            <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 shadow-md ${goal.type === 'finance' ? 'bg-[#8A9A5B]' : 'bg-[#DEB587]'
                                        }`}
                                    style={{ width: `${(goal.current / goal.target) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <button className="w-full py-4 bg-slate-50 text-slate-400 group-hover:bg-[#8A9A5B] group-hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                            Ver Detalhes <ArrowUpRight size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export default Goals;
