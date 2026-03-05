import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Helper para injetar clinicId nas queries
const withClinic = (url: string, clinicId?: string) => {
    if (!clinicId) return url;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}clinicId=${clinicId}`;
};

export const financialApi = {
    getSummary: (clinicId?: string) => api.get(withClinic('/financial/summary', clinicId)),
    getBreakEven: (clinicId?: string) => api.get(withClinic('/financial/break-even', clinicId)),
    getEvolution: (clinicId?: string) => api.get(withClinic('/financial/evolution', clinicId)),
    createTransaction: (data: any) => api.post('/financial/transactions', data), // clinicId vai no body
};

export const coreApi = {
    getPatients: (clinicId?: string) => api.get(withClinic('/core/patients', clinicId)),
    getDoctors: (clinicId?: string) => api.get(withClinic('/core/doctors', clinicId)),
    getStock: (clinicId?: string) => api.get(withClinic('/core/stock', clinicId)),
    getProductivity: (clinicId?: string) => api.get(withClinic('/core/productivity', clinicId)), // Added to fix build
    createDoctor: (data: any) => api.post('/core/doctors', data), // Added to fix build
};

export const reportingApi = {
    getDashboardKPIs: (clinicId: string) => api.get(withClinic('/reporting/dashboard-kpis', clinicId)),
    getCashFlow: (clinicId: string) => api.get(withClinic('/reporting/cash-flow', clinicId)),
    getDRE: (clinicId: string) => api.get(withClinic('/reporting/dre', clinicId)),
    getBillingAnalytics: (clinicId: string) => api.get(withClinic('/reporting/billing-analytics', clinicId)),
    getGoals: (clinicId: string) => api.get(withClinic('/reporting/goals', clinicId)),
    postSmartGoal: (clinicId: string, targetProfit: number) => api.post('/reporting/smart-goal', { clinicId, targetProfit }),
};

export const historyApi = {
    getSummary: (clinicId?: string) => api.get(withClinic('/history/summary', clinicId)),
    getWeekly: (month: number, clinicId?: string) => api.get(withClinic(`/history/weekly?month=${month}`, clinicId)),
    getProcedures: (clinicId?: string) => api.get(withClinic('/history/procedures', clinicId)),
};

export const analyticsApi = {
    getInsights: (clinicId: string) => api.get(withClinic('/analytics/insights', clinicId)),
};

export default api;
