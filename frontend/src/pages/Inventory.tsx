import React, { useState } from 'react';
import {
    Search,
    Plus,
    AlertTriangle,
    Loader2,
    X
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coreApi } from '../services/api';

const Inventory = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({
        name: '',
        category: 'Injetáveis',
        quantity: 0,
        minQuantity: 5,
        price: 0
    });

    const { data: items, isLoading } = useQuery({
        queryKey: ['stock-items'],
        queryFn: async () => {
            const response = await coreApi.getStock();
            return response.data;
        }
    });

    const createMutation = useMutation({
        mutationFn: (item: any) => coreApi.createStockItem(item),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stock-items'] });
            setIsAddModalOpen(false);
            setNewItem({
                name: '',
                category: 'Injetáveis',
                quantity: 0,
                minQuantity: 5,
                price: 0
            });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(newItem);
    };

    const filteredItems = items?.filter((item: any) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
            </div>
        );
    }

    return (
        <div className="flex-1 p-8 bg-slate-50 h-screen overflow-y-auto">
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Estoque e Insumos</h2>
                    <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-xs">Gestão de Materiais & Curva ABC</p>
                </div>

                <div className="flex gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-slate-900" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar insumo..."
                            className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl w-80 text-sm font-bold focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                    >
                        <Plus size={20} />
                        ADICIONAR INSUMO
                    </button>
                </div>
            </header>

            {/* Insumos List */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Insumo</th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Categoria</th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Quantidade</th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Preço Un.</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Valor Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredItems?.map((item: any) => (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-6">
                                    <span className="font-black text-slate-900 text-sm block">{item.name}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 block">Cód: {item.id.slice(0, 8)}</span>
                                </td>
                                <td className="px-6 py-6">
                                    <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                        {item.category}
                                    </span>
                                </td>
                                <td className="px-6 py-6 font-bold text-slate-600">
                                    {item.quantity} un
                                </td>
                                <td className="px-6 py-6 font-bold">
                                    {item.quantity <= item.minQuantity ? (
                                        <span className="flex items-center gap-1.5 text-red-500 text-xs font-black">
                                            <AlertTriangle size={14} /> REPOSIÇÃO
                                        </span>
                                    ) : (
                                        <span className="text-emerald-500 text-xs font-black">OK</span>
                                    )}
                                </td>
                                <td className="px-6 py-6 font-bold text-slate-900">
                                    R$ {item.price.toLocaleString()}
                                </td>
                                <td className="px-8 py-6 text-right font-black text-slate-900 text-lg">
                                    R$ {(item.quantity * item.price).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] w-full max-w-xl p-10 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900">Novo Insumo</h3>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Cadastro de material em estoque</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="bg-slate-100 p-3 rounded-2xl hover:bg-slate-200 transition-colors">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Nome do Item</label>
                                <input
                                    required
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-slate-900 outline-none transition-all"
                                    placeholder="Ex: Ácido Hialurônico 1ml"
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Categoria</label>
                                    <select
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 outline-none focus:border-slate-900 transition-all"
                                        value={newItem.category}
                                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                    >
                                        <option>Injetáveis</option>
                                        <option>Consumíveis</option>
                                        <option>Equipamentos</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Preço Unitário</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-slate-900 outline-none transition-all"
                                        placeholder="0.00"
                                        value={newItem.price}
                                        onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Qtd Atual</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-slate-900 outline-none transition-all"
                                        placeholder="0"
                                        value={newItem.quantity}
                                        onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Estoque Mínimo</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-slate-900 outline-none transition-all"
                                        placeholder="5"
                                        value={newItem.minQuantity}
                                        onChange={(e) => setNewItem({ ...newItem, minQuantity: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={createMutation.isPending}
                                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm tracking-widest hover:bg-emerald-600 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                            >
                                {createMutation.isPending ? 'CADASTRANDOR...' : 'SALVAR NO ESTOQUE'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
