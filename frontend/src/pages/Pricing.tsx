import { useMemo } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { Calculator, Plus, Trash2, Save, AlertCircle, Percent, DollarSign, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pricingApi } from '../services/api';
import toast from 'react-hot-toast';

interface Supply {
    name: string;
    quantity: number;
    cost: number;
}

interface PricingFormData {
    name: string;
    sellingPrice: number;
    cardFeePercentage: number;
    taxPercentage: number;
    fixedCost: number;
    commission: number;
    supplies: Supply[];
}

const Pricing = () => {
    const queryClient = useQueryClient();

    const { register, control, handleSubmit, reset } = useForm<PricingFormData>({
        defaultValues: {
            name: '',
            sellingPrice: 0,
            cardFeePercentage: 0,
            taxPercentage: 0,
            fixedCost: 0,
            commission: 0,
            supplies: [{ name: '', quantity: 1, cost: 0 }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'supplies'
    });

    const formValues = useWatch({ control });

    // Anti-Crash & Valores Seguros
    const safeSellingPrice = Number(formValues.sellingPrice) || 0;
    const safeCardFee = Number(formValues.cardFeePercentage) || 0;
    const safeTax = Number(formValues.taxPercentage) || 0;
    const safeFixedCost = Number(formValues.fixedCost) || 0;
    const safeCommission = Number(formValues.commission) || 0;
    const safeSupplies = formValues.supplies || [];

    // Cálculos em Tempo Real
    const { totalCost, netProfit, profitMargin, cardFeeValue, taxValue } = useMemo(() => {
        const suppliesTotal = safeSupplies.reduce((acc, curr) => acc + (Number(curr?.cost) || 0), 0);
        
        const cardFeeValueCalc = safeSellingPrice * (safeCardFee / 100);
        const taxValueCalc = safeSellingPrice * (safeTax / 100);
        
        const calculatedTotalCost = suppliesTotal + safeFixedCost + safeCommission + cardFeeValueCalc + taxValueCalc;
        const calculatedNetProfit = safeSellingPrice - calculatedTotalCost;
        
        // Proteção contra divisão por zero
        const calculatedProfitMargin = safeSellingPrice > 0 ? (calculatedNetProfit / safeSellingPrice) * 100 : 0;

        return {
            totalCost: calculatedTotalCost,
            netProfit: calculatedNetProfit,
            profitMargin: calculatedProfitMargin,
            cardFeeValue: cardFeeValueCalc,
            taxValue: taxValueCalc
        };
    }, [safeSellingPrice, safeCardFee, safeTax, safeFixedCost, safeCommission, safeSupplies]);

    // Mutation para Salvar
    const createMutation = useMutation({
        mutationFn: (data: PricingFormData) => {
            const payload = {
                ...data,
                sellingPrice: Number(data.sellingPrice) || 0,
                cardFeePercentage: Number(data.cardFeePercentage) || 0,
                taxPercentage: Number(data.taxPercentage) || 0,
                fixedCost: Number(data.fixedCost) || 0,
                commission: Number(data.commission) || 0,
                totalCost,
                netProfit,
                profitMargin,
                supplies: data.supplies.map((s: any) => ({
                    ...s,
                    quantity: Number(s.quantity) || 0,
                    cost: Number(s.cost) || 0
                }))
            };
            return pricingApi.createSimulation(payload);
        },
        onSuccess: () => {
            toast.success('Simulação salva com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['pricing-simulations'] });
            reset();
        },
        onError: () => {
            toast.error('Erro ao salvar simulação.');
        }
    });

    const onSubmit = (data: PricingFormData) => {
        if (!data.name) {
            toast.error('O nome do procedimento é obrigatório.');
            return;
        }
        createMutation.mutate(data);
    };

    // Helper de cor para margem
    const getMarginColor = (margin: number) => {
        if (margin > 40) return 'text-emerald-500';
        if (margin > 20) return 'text-amber-500';
        return 'text-red-500';
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500">
            {/* Header & Ações */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex-1 max-w-xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
                        <Calculator size={24} />
                    </div>
                    <div className="flex-1">
                        <input
                            {...register('name')}
                            placeholder="Nome do Procedimento / Simulação"
                            className="w-full text-2xl font-black text-slate-900 border-none focus:ring-0 p-0 placeholder-slate-300 bg-transparent outline-none"
                        />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Simulador de Precificação</p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={createMutation.isPending}
                    className="px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {createMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Salvar Simulação
                </button>
            </div>

            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest flex items-center gap-2 mb-2">
                        <DollarSign size={14} /> Preço de Venda
                    </p>
                    <div className="relative">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
                        <input
                            {...register('sellingPrice', { valueAsNumber: true })}
                            type="number"
                            step="0.01"
                            className="w-full pl-8 text-3xl font-black text-indigo-600 bg-transparent border-none focus:outline-none p-0"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Custo Total</p>
                    <h4 className="text-3xl font-black text-slate-900">
                        R$ {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h4>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 transition-all ${getMarginColor(profitMargin).replace('text-', 'bg-')}`} />
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Margem de Lucro</p>
                    <h4 className={`text-4xl font-black ${getMarginColor(profitMargin)}`}>
                        {profitMargin.toFixed(1)}%
                    </h4>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Lucro Líquido</p>
                    <h4 className="text-3xl font-black text-emerald-400">
                        R$ {netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h4>
                </div>
            </div>

            {/* Grid Principal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Coluna Esquerda: Insumos Utilizados */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                            <Plus size={20} />
                        </div>
                        <h3 className="font-bold text-xl text-slate-800">Insumos Utilizados</h3>
                    </div>

                    <div className="space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-4 items-end bg-slate-50 p-4 rounded-2xl border border-slate-100 relative group animate-in fade-in duration-300">
                                <div className="flex-1 space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Insumo</label>
                                    <input 
                                        {...register(`supplies.${index}.name`)} 
                                        placeholder="Ex: Ácido Hialurônico 1ml" 
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:border-indigo-500 focus:outline-none font-semibold text-sm transition-all" 
                                    />
                                </div>
                                <div className="w-24 space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Qtd</label>
                                    <input 
                                        {...register(`supplies.${index}.quantity`, { valueAsNumber: true })} 
                                        type="number" step="0.01" 
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:border-indigo-500 focus:outline-none font-semibold text-sm transition-all" 
                                    />
                                </div>
                                <div className="w-32 space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Custo Total (R$)</label>
                                    <input 
                                        {...register(`supplies.${index}.cost`, { valueAsNumber: true })} 
                                        type="number" step="0.01" 
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:border-indigo-500 focus:outline-none font-semibold text-sm transition-all" 
                                    />
                                </div>
                                <button 
                                    type="button" 
                                    onClick={() => remove(index)} 
                                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button 
                        type="button"
                        onClick={() => append({ name: '', quantity: 1, cost: 0 })}
                        className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={18} /> Adicionar Insumo
                    </button>
                    
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-500">Subtotal Insumos</span>
                        <span className="font-black text-lg text-slate-900">
                            R$ {(safeSupplies.reduce((acc, curr) => acc + (Number(curr?.cost) || 0), 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>

                {/* Coluna Direita: Custos Operacionais e Impostos */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 text-amber-500 rounded-lg">
                            <Percent size={20} />
                        </div>
                        <h3 className="font-bold text-xl text-slate-800">Custos e Taxas Ocultas</h3>
                    </div>

                    <div className="space-y-6">
                        {/* Taxas Percentuais */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Taxa Máquininha (%)</label>
                                <div className="flex items-center gap-2">
                                    <input 
                                        {...register('cardFeePercentage', { valueAsNumber: true })} 
                                        type="number" step="0.01" 
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:border-indigo-500 focus:outline-none font-semibold text-sm transition-all" 
                                    />
                                    <span className="text-xs font-bold text-slate-400 whitespace-nowrap min-w-[60px]">= R$ {cardFeeValue.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="space-y-1.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Impostos (%)</label>
                                <div className="flex items-center gap-2">
                                    <input 
                                        {...register('taxPercentage', { valueAsNumber: true })} 
                                        type="number" step="0.01" 
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:border-indigo-500 focus:outline-none font-semibold text-sm transition-all" 
                                    />
                                    <span className="text-xs font-bold text-slate-400 whitespace-nowrap min-w-[60px]">= R$ {taxValue.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Valores Fixos */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                                    Custo Fixo Rateado <AlertCircle size={12} className="text-slate-300" />
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">R$</span>
                                    <input 
                                        {...register('fixedCost', { valueAsNumber: true })} 
                                        type="number" step="0.01" 
                                        className="w-full pl-9 bg-white border border-slate-200 rounded-xl px-4 py-2 focus:border-indigo-500 focus:outline-none font-semibold text-sm transition-all" 
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Comissão Média</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">R$</span>
                                    <input 
                                        {...register('commission', { valueAsNumber: true })} 
                                        type="number" step="0.01" 
                                        className="w-full pl-9 bg-white border border-slate-200 rounded-xl px-4 py-2 focus:border-indigo-500 focus:outline-none font-semibold text-sm transition-all" 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                            <h4 className="font-bold text-sm text-indigo-900 mb-2">Explicando o Custo Fixo Rateado</h4>
                            <p className="text-xs text-indigo-700 leading-relaxed">
                                Este é o valor da hora clínica que você deve embutir em cada procedimento para cobrir aluguel, luz e salários estruturais. O simulador soma Insumos + Custo Fixo + Taxas Dinâmicas para chegar ao lucro final real.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
