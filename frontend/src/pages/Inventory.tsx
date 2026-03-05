import { useState } from 'react';
import {
    Package,
    Search,
    Plus,
    AlertTriangle,
    TrendingDown,
    Filter,
    MoreVertical,
    ChevronRight,
    ArrowUpRight
} from 'lucide-react';

const Inventory = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const displayItems = [
        { id: '1', name: 'Luvas de Procedimento (Caixa)', category: 'Descartáveis', stock: 45, minStock: 20, unit: 'un', price: 65.00 },
        { id: '2', name: 'Máscaras Cirúrgicas', category: 'Descartáveis', stock: 8, minStock: 25, unit: 'un', price: 42.50 },
        { id: '3', name: 'Resina Composta A2', category: 'Materiais', stock: 12, minStock: 5, unit: 'tubo', price: 180.00 },
        { id: '4', name: 'Anestésico 2%', category: 'Medicamentos', stock: 3, minStock: 10, unit: 'cx', price: 110.00 },
    ].filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black tracking-tight text-[#697D58]">Controle de Estoque</h2>
                    <p className="text-slate-500 font-medium mt-1">Gestão de insumos, materiais e medicamentos.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-[#8A9A5B] text-white rounded-2xl font-bold text-sm shadow-xl shadow-[#8A9A5B]/20 hover:scale-[1.02] active:scale-95 transition-all">
                        <Plus size={20} />
                        Novo Item
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InventoryStatCard
                    title="Total em Itens"
                    value="156"
                    icon={<Package size={20} />}
                />
                <InventoryStatCard
                    title="Itens em Alerta"
                    value="12"
                    icon={<AlertTriangle size={20} />}
                    color="dun"
                    alert
                />
                <InventoryStatCard
                    title="Valor em Estoque"
                    value="R$ 8.420,00"
                    icon={<TrendingDown size={20} />}
                />
            </div>

            {/* List Section */}
            <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-[#8A9A5B]/10 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-[#8A9A5B]/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar no almoxarifado..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-[#8A9A5B]/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]/20 transition-all font-medium text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-5 py-3 bg-white border border-[#8A9A5B]/10 rounded-2xl font-bold text-xs text-slate-600 hover:bg-slate-50 transition-all">
                        <Filter size={16} /> Tudo
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Material</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estoque</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#8A9A5B]/5">
                            {displayItems.map((item: any) => (
                                <tr key={item.id} className="hover:bg-[#8A9A5B]/5 transition-colors group cursor-pointer">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#8A9A5B] border border-[#8A9A5B]/10 shadow-sm">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-700 text-sm">{item.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Preço Un: R$ {item.price.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        {item.category}
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className={`font-black text-sm ${item.stock < item.minStock ? 'text-[#DEB587]' : 'text-slate-700'}`}>
                                            {item.stock} {item.unit}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-medium">Mín: {item.minStock}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        {item.stock < item.minStock ? (
                                            <span className="flex items-center gap-1.5 px-3 py-1 bg-[#DEB587]/10 text-[#DEB587] rounded-full text-[10px] font-black uppercase tracking-widest w-fit">
                                                <AlertTriangle size={12} /> Reposição
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 px-3 py-1 bg-[#8A9A5B]/10 text-[#697D58] rounded-full text-[10px] font-black uppercase tracking-widest w-fit">
                                                <ArrowUpRight size={12} /> Normal
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-[#8A9A5B]">
                                                <MoreVertical size={18} />
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
                </div>
            </div>
        </div>
    );
};

const InventoryStatCard = ({ title, value, icon, color, alert }: any) => (
    <div className={`bg-white p-6 rounded-3xl border ${alert ? 'border-[#DEB587]/20 shadow-lg shadow-[#DEB587]/5' : 'border-[#8A9A5B]/10 shadow-sm'} flex items-center gap-5 transition-all group hover:scale-[1.02]`}>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color === 'dun' ? 'bg-[#DEB587]/10 text-[#DEB587]' : 'bg-[#8A9A5B]/10 text-[#8A9A5B]'
            }`}>
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
            <h5 className={`text-2xl font-black ${alert ? 'text-[#DEB587]' : 'text-slate-800'}`}>{value}</h5>
        </div>
    </div>
);

export default Inventory;
