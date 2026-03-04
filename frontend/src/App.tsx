import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Productivity from './pages/Productivity';
import Inventory from './pages/Inventory';
import CashFlow from './pages/CashFlow';
import Goals from './pages/Goals';
import Insights from './pages/Insights';
import HistoryPage from './pages/History';

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 bg-slate-50 min-h-screen">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/productivity" element={<Productivity />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/cash-flow" element={<CashFlow />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
