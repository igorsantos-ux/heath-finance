import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { coreApi, integrationApi } from '../../services/api';
import {
    Users,
    Search,
    UserPlus,
    MoreHorizontal,
    Filter,
    Calendar,
    Phone,
    Mail,
    ChevronRight,
    TrendingUp,
    Loader2,
    RefreshCw
} from 'lucide-react';

const PatientsPage = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);

    const { data: patients, isLoading } = useQuery({
        queryKey: ['patients'],
        queryFn: async () => {
            const response = await coreApi.getPatients();
            return response.data;
        }
    });

    // Gatilho de Sincronização Automática On-Demand (Pacientes)
    useEffect(() => {
        const triggerSync = async () => {
            try {
                setIsSyncing(true);
                await integrationApi.sync('patients');
                queryClient.invalidateQueries({ queryKey: ['patients'] });
                console.log('✅ Base de pacientes sincronizada com Feegow.');
            } catch (error) {
                console.warn('Auto-sync Pacientes ignorado ou falhou:', error);
            } finally {
                setIsSyncing(false);
            }
        };

        triggerSync();
    }, [queryClient]);

    // Filtrar dados reais
    const displayPatients = (patients || []).filter((p: any) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-4 py-20">
                <Loader2 className="animate-spin text-[#8A9A5B]" size={48} />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Carregando base de pacientes...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black tracking-tight text-[#697D58]">Pacientes</h2>
                    <div className="flex items-center gap-4 mt-1">
                        <p className="text-slate-500 font-medium">Gestão completa da base de clientes da clínica.</p>
                        {isSyncing && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-[#8A9A5B]/10 border border-[#8A9A5B]/20 rounded-full animate-in fade-in zoom-in duration-300">
                                <RefreshCw className="w-3 h-3 text-[#8A9A5B] animate-spin" />
                                <span className="text-[10px] font-black text-[#697D58] uppercase tracking-widest">Sincronizando...</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-[#8A9A5B] text-white rounded-2xl font-bold text-sm shadow-xl shadow-[#8A9A5B]/20 hover:scale-[1.02] active:scale-95 transition-all">
                        <UserPlus size={20} />
                        Novo Paciente
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total de Pacientes"
                    value={patients?.length || 0}
                    icon={<Users size={20} />}
                    trend={`${patients?.length || 0} cadastrados`}
                />
                <StatCard
                    title="Atendimentos Hoje"
                    value="0"
                    icon={<Calendar size={20} />}
                    trend="Aguardando dados"
                />
                <StatCard
                    title="Taxa de Retorno"
                    value="0%"
                    icon={<TrendingUp size={20} />}
                    trend="Sem dados"
                />
            </div>

            {/* List Section */}
            <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-[#8A9A5B]/10 shadow-sm overflow-hidden min-h-[400px]">
                <div className="p-8 border-b border-[#8A9A5B]/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nome, CPF ou e-mail..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-[#8A9A5B]/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]/20 transition-all font-medium text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-5 py-3 bg-white border border-[#8A9A5B]/10 rounded-2xl font-bold text-xs text-slate-600 hover:bg-slate-50 transition-all">
                        <Filter size={16} />
                        Filtros Avançados
                    </button>
                </div>

                <div className="overflow-x-auto">
                    {displayPatients.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <Users size={48} className="text-slate-200" />
                            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest text-center">
                                {searchTerm ? 'Nenhum paciente encontrado para sua busca' : 'Nenhum paciente cadastrado na clínica'}
                            </p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Paciente</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contato</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Última Visita</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#8A9A5B]/5">
                                {displayPatients.map((patient: any) => (
                                    <tr key={patient.id} className="hover:bg-[#8A9A5B]/5 transition-colors group cursor-pointer">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-[#DEB587]/20 text-[#697D58] rounded-full flex items-center justify-center font-black text-xs">
                                                    {patient.name.split(' ').map((n: string) => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-700 text-sm">{patient.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold">ID: #{patient.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                {patient.phone && (
                                                    <div className="flex items-center gap-2 text-slate-500">
                                                        <Phone size={12} />
                                                        <span className="text-xs font-medium">{patient.phone}</span>
                                                    </div>
                                                )}
                                                {patient.email && (
                                                    <div className="flex items-center gap-2 text-slate-500">
                                                        <Mail size={12} />
                                                        <span className="text-xs font-medium">{patient.email}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-slate-600 font-bold text-xs">
                                                <Calendar size={14} className="text-[#8A9A5B]" />
                                                {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString('pt-BR') : 'Sem visitas'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${patient.status === 'Ativo' || !patient.status
                                                ? 'bg-[#8A9A5B]/10 text-[#697D58]'
                                                : 'bg-slate-100 text-slate-400'
                                                }`}>
                                                {patient.status || 'Ativo'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-[#8A9A5B]">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                                <button className="p-2 hover:bg-[#8A9A5B] rounded-lg transition-all text-slate-400 hover:text-white">
                                                    <ChevronRight size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {displayPatients.length > 0 && (
                    <div className="p-8 bg-slate-50/30 flex items-center justify-between border-t border-[#8A9A5B]/5">
                        <p className="text-xs font-bold text-slate-400">Mostrando {displayPatients.length} pacientes</p>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-white border border-[#8A9A5B]/10 rounded-xl text-xs font-bold text-slate-400 cursor-not-allowed">Anterior</button>
                            <button className="px-4 py-2 bg-white border border-[#8A9A5B]/10 rounded-xl text-xs font-bold text-[#697D58] hover:bg-[#8A9A5B]/5 transition-all">Próximo</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, trend }: any) => (
    <div className="bg-white p-6 rounded-3xl border border-[#8A9A5B]/10 shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 bg-[#8A9A5B]/10 rounded-2xl flex items-center justify-center text-[#8A9A5B]">
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
            <h5 className="text-2xl font-black text-[#1A202C]">{value}</h5>
            <p className="text-[10px] text-[#697D58] font-black">{trend}</p>
        </div>
    </div>
);

export default PatientsPage;
