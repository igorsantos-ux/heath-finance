import {
    LayoutDashboard,
    Users,
    Package,
    TrendingUp,
    Target,
    Sparkles,
    ClipboardList
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/" },
        { icon: <Users size={20} />, label: "Produtividade", path: "/productivity" },
        { icon: <Package size={20} />, label: "Estoque", path: "/inventory" },
        { icon: <TrendingUp size={20} />, label: "Fluxo de Caixa", path: "/cash-flow" },
        { icon: <Target size={20} />, label: "Metas", path: "/goals" },
        { icon: <Sparkles size={20} />, label: 'Insights', path: '/insights' },
        { icon: <ClipboardList size={20} />, label: 'Relatórios', path: '/history' },
    ];

    return (
        <aside className="w-64 bg-[#0f172a] text-white flex flex-col h-screen fixed left-0 top-0 z-20">
            <div className="p-6 border-b border-slate-700">
                <h1 className="text-xl font-bold tracking-tight text-emerald-400">ClinicaFin</h1>
                <p className="text-xs text-slate-400 mt-1 font-medium">Medical Finance 2026</p>
            </div>

            <nav className="flex-1 p-4 space-y-2 mt-4">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${location.pathname === item.path
                            ? 'bg-[#10b981] text-white shadow-lg shadow-emerald-500/20'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        <span className={`${location.pathname === item.path ? 'text-white' : 'text-slate-500 group-hover:text-emerald-400'}`}>
                            {item.icon}
                        </span>
                        <span className="font-semibold text-sm">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 bg-slate-800/40 m-4 rounded-2xl border border-slate-700/50">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Ponto de Equilíbrio</p>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[75%] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                </div>
                <div className="flex justify-between items-center mt-2">
                    <p className="text-[10px] text-slate-400 font-bold">75% atingido</p>
                    <p className="text-[10px] text-emerald-400 font-bold">R$ 45k / R$ 60k</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
