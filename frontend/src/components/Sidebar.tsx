import {
    LayoutDashboard,
    Users,
    Package,
    TrendingUp,
    Target,
    FileText,
    Wallet,
    BarChart3,
    ArrowDownCircle,
    ArrowUpCircle,
    FolderOpen,
    LogOut
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { reportingApi } from '../services/api';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Busca metas reais para o indicador global
    const { data: goalsResponse } = useQuery({
        queryKey: ['goals-report'],
        queryFn: () => reportingApi.getGoals(),
        staleTime: 1000 * 60 * 5 // 5 minutos de cache
    });

    const goals = Array.isArray(goalsResponse?.data) ? goalsResponse.data : [];
    const globalProgress = goals.length > 0
        ? Math.round(goals.reduce((acc: number, g: any) => acc + (Math.min(((g.current || g.achieved || 0) / g.target) * 100, 100)), 0) / goals.length)
        : 0;

    const menuItems = [
        { icon: <LayoutDashboard size={18} />, label: "Dashboard", path: "/dashboard" },
        { icon: <BarChart3 size={18} />, label: "Faturamento", path: "/billing" },
        { icon: <Users size={18} />, label: "Pacientes", path: "/patients" },
        { icon: <TrendingUp size={18} />, label: "Fluxo de Caixa", path: "/cash-flow" },
        { icon: <ArrowUpCircle size={18} />, label: "Contas a Receber", path: "/receivables" },
        { icon: <ArrowDownCircle size={18} />, label: "Contas a Pagar", path: "/payables" },
        { icon: <Wallet size={18} />, label: "Recebimentos (Caixa)", path: "/income" },
        { icon: <FileText size={18} />, label: "DRE", path: "/dre" },
        { icon: <FileText size={18} />, label: "DFC", path: "/dfc" },
        { icon: <Target size={18} />, label: "Metas", path: "/goals" },
        { icon: <Package size={18} />, label: "Estoque", path: "/inventory" },
        { icon: <FolderOpen size={18} />, label: "Documentos", path: "/documents" },
    ];

    return (
        <aside className="w-72 bg-[#F0EAD6] text-slate-800 flex flex-col h-screen fixed left-0 top-0 z-20 border-r border-[#8A9A5B]/20">
            <div className="p-8">
                <div className="flex justify-center mb-6">
                    <img src="/logo-alamino-dark.png" alt="Logo Rares360" className="h-40 w-auto object-contain" />
                </div>
            </div>

            <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar">
                <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Principal</p>
                <div className="space-y-1 mb-8">
                    {menuItems.slice(0, 3).map((item) => (
                        <SidebarLink key={item.path} item={item} active={location.pathname === item.path} />
                    ))}
                </div>

                <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Financeiro</p>
                <div className="space-y-1 mb-8">
                    {menuItems.slice(3, 9).map((item) => (
                        <SidebarLink key={item.path} item={item} active={location.pathname === item.path} />
                    ))}
                </div>

                <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Gestão</p>
                <div className="space-y-1">
                    {menuItems.slice(9).map((item) => (
                        <SidebarLink key={item.path} item={item} active={location.pathname === item.path} />
                    ))}
                </div>
            </nav>

            <div className="p-4 mt-auto">
                <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-[#8A9A5B]/10 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-[#DEB587]/20 flex items-center justify-center text-[#DEB587]">
                            <Target size={16} />
                        </div>
                        <p className="text-xs font-bold text-slate-600">Meta Mensal</p>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
                        <div
                            className="h-full bg-[#8A9A5B] rounded-full shadow-sm shadow-[#8A9A5B]/20 transition-all duration-1000"
                            style={{ width: `${globalProgress}%` }}
                        ></div>
                    </div>
                    <p className="text-[10px] font-bold text-[#8A9A5B] text-right">{globalProgress}% atingido</p>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 mt-4 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                >
                    <LogOut size={18} />
                    <span className="font-bold text-sm">Sair</span>
                </button>
            </div>
        </aside>
    );
};

const SidebarLink = ({ item, active }: { item: any; active: boolean }) => (
    <Link
        to={item.path}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${active
            ? 'bg-[#8A9A5B] text-white shadow-lg shadow-[#8A9A5B]/20'
            : 'text-slate-500 hover:bg-[#8A9A5B]/10 hover:text-[#697D58]'
            }`}
    >
        <span className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-[#8A9A5B]'}`}>
            {item.icon}
        </span>
        <span className="font-bold text-sm">{item.label}</span>
    </Link>
);

export default Sidebar;
