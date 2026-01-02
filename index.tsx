
import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { injectSpeedInsights } from '@vercel/speed-insights';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ShipmentManager from './components/ShipmentManager';
import FleetManager from './components/FleetManager';
import IntegrationsManager from './components/IntegrationsManager';
import LiveMap from './components/LiveMap';
import DistrictsManager from './components/DistrictsManager';
import DriverView from './components/DriverView';
import AccountManager from './components/AccountManager';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import { Shipment, Truck, Stats, ShipmentStatus, UserRole, DeliveryDetails } from './types';
import { ADMIN_NAME } from './constants';
import { Search, Bell, Lock, ArrowRight, AlertTriangle, RefreshCcw, Box } from 'lucide-react';

// Initialize Vercel Speed Insights
injectSpeedInsights();

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Critical Render Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-['Cairo']">
          <div className="bg-white p-12 rounded-[3rem] elite-shadow max-w-lg text-center border border-slate-100">
            <div className="bg-rose-50 w-20 h-20 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-8 border-4 border-rose-100">
              <AlertTriangle size={40} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-4">خطأ في تحميل المنصة</h1>
            <p className="text-slate-500 font-bold mb-8">نعتذر، حدث خلل تقني. يرجى إعادة تحميل الصفحة.</p>
            <button onClick={() => window.location.reload()} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 w-full">
              <RefreshCcw size={20} /> تحديث
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  const [viewState, setViewState] = useState<'landing' | 'login' | 'app'>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [role, setRole] = useState<UserRole>('ADMIN');
  const [currentUser, setCurrentUser] = useState<Truck | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [isManualShipmentOpen, setIsManualShipmentOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [appReady, setAppReady] = useState(false);

  const STORAGE_KEY_SHIPMENTS = 'jeddah_shipments_v12';
  const STORAGE_KEY_TRUCKS = 'jeddah_trucks_v12';
  const STORAGE_KEY_AUTH = 'jeddah_auth_v12';
  const STORAGE_KEY_USER = 'jeddah_user_v12';

  const getSafeStorage = (key: string) => {
    try {
      const data = localStorage.getItem(key);
      if (!data || data === 'undefined' || data === 'null') return null;
      return JSON.parse(data);
    } catch (e) { return null; }
  };

  useEffect(() => {
    const loadedTrucks = getSafeStorage(STORAGE_KEY_TRUCKS);
    if (!loadedTrucks || loadedTrucks.length === 0) {
      const initialTrucks: Truck[] = Array.from({ length: 50 }, (_, i) => ({
        id: `TRK-${i + 1}`,
        plateNumber: `${Math.floor(Math.random() * 9000) + 1000} JED`,
        driverName: `مندوب ${i + 1}`,
        driverPhone: `05${Math.floor(Math.random() * 90000000) + 10000000}`,
        username: `driver${i + 1}`,
        password: '123',
        assignedDistrict: 'الشاطئ',
        capacity: 500,
        currentLoad: 0,
        totalCodCollected: 0,
        status: 'Active',
        role: 'DRIVER',
        permissions: { canManageFleet: false, canManageShipments: true, canViewFinancials: false, canEditSettings: false, canManageUsers: false, canDeleteData: false, canExportReports: false },
        location: { lat: 21.5, lng: 39.2 },
        efficiencyScore: 90 + Math.floor(Math.random() * 10)
      }));
      setTrucks(initialTrucks);
      localStorage.setItem(STORAGE_KEY_TRUCKS, JSON.stringify(initialTrucks));
    } else { setTrucks(loadedTrucks); }

    const loadedShipments = getSafeStorage(STORAGE_KEY_SHIPMENTS);
    if (loadedShipments) setShipments(loadedShipments);

    const authStatus = localStorage.getItem(STORAGE_KEY_AUTH);
    const savedUser = getSafeStorage(STORAGE_KEY_USER);
    if (authStatus === 'true' && savedUser) {
      setIsAuthenticated(true);
      setCurrentUser(savedUser);
      setRole(savedUser.role || 'ADMIN');
      setViewState('app');
    }

    setAppReady(true);
    const loader = document.getElementById('initial-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 500);
    }
  }, []);

  useEffect(() => {
    if (appReady) {
      localStorage.setItem(STORAGE_KEY_SHIPMENTS, JSON.stringify(shipments));
      localStorage.setItem(STORAGE_KEY_TRUCKS, JSON.stringify(trucks));
    }
  }, [shipments, trucks, appReady]);

  const handleLogin = (user: any) => {
    setIsAuthenticated(true);
    const finalUser = user.id === 'ADMIN' ? {
      id: 'ADMIN', driverName: ADMIN_NAME, username: 'admin', role: 'ADMIN',
      permissions: { canManageFleet: true, canManageShipments: true, canViewFinancials: true, canEditSettings: true, canManageUsers: true, canDeleteData: true, canExportReports: true }
    } : user;
    setCurrentUser(finalUser);
    setRole(finalUser.role);
    localStorage.setItem(STORAGE_KEY_AUTH, 'true');
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(finalUser));
    setViewState('app');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEY_AUTH);
    localStorage.removeItem(STORAGE_KEY_USER);
    setViewState('landing');
  };

  const handleUpdateShipmentStatus = (id: string, newStatus: ShipmentStatus, details?: DeliveryDetails) => {
    setShipments(prev => prev.map(s => {
      if (s.id === id) {
        if (newStatus === ShipmentStatus.DELIVERED && details?.cashCollected && s.assignedTruckId) {
          setTrucks(tList => tList.map(t => t.id === s.assignedTruckId ? { ...t, totalCodCollected: t.totalCodCollected + (details.cashCollected || 0) } : t));
        }
        return { ...s, status: newStatus, deliveryDetails: details || s.deliveryDetails };
      }
      return s;
    }));
  };

  const handleAssignToTruck = (shipmentId: string, truckId: string) => {
    setShipments(prev => prev.map(s => s.id === shipmentId ? { ...s, assignedTruckId: truckId, status: ShipmentStatus.ASSIGNED } : s));
    setTrucks(prev => prev.map(t => t.id === truckId ? { ...t, currentLoad: t.currentLoad + 1 } : t));
  };

  const stats: Stats = {
    totalShipments: shipments.length,
    deliveredToday: shipments.filter(s => s.status === ShipmentStatus.DELIVERED).length,
    pendingAssignment: shipments.filter(s => s.status === ShipmentStatus.PENDING).length,
    activeTrucks: trucks.filter(t => t.status === 'Active' && t.role === 'DRIVER').length,
    avgDeliveryTime: shipments.length > 0 ? '88 دقيقة' : '0 دقيقة',
    totalCodToCollect: shipments.reduce((acc, s) => acc + (s.paymentMethod === 'COD' ? s.codAmount : 0), 0)
  };

  const renderContent = () => {
    if (!appReady) return null;
    if (role === 'DRIVER') return <DriverView shipments={shipments} onUpdateStatus={handleUpdateShipmentStatus} trucks={trucks} currentUser={currentUser} />;
    
    const perms = currentUser?.permissions || { canManageFleet: true, canManageShipments: true, canViewFinancials: true, canEditSettings: true, canManageUsers: true, canDeleteData: true, canExportReports: true };

    switch (activeTab) {
      case 'dashboard': return <Dashboard stats={stats} pendingShipments={shipments.filter(s => s.status === ShipmentStatus.PENDING)} trucks={trucks.filter(t => t.role === 'DRIVER')} onAutoAssign={handleAssignToTruck} />;
      case 'shipments': return <ShipmentManager shipments={shipments} trucks={trucks.filter(t => t.role === 'DRIVER')} onUpdateStatus={handleUpdateShipmentStatus} onAssign={handleAssignToTruck} onAddShipment={(s) => setShipments(prev => [s, ...prev])} isCreateModalOpen={isManualShipmentOpen} setIsCreateModalOpen={setIsManualShipmentOpen} onImport={(data) => setShipments(prev => [...data, ...prev])} searchTerm={globalSearch} />;
      case 'analytics': return <Analytics trucks={trucks.filter(t => t.role === 'DRIVER')} shipments={shipments} />;
      case 'fleet': return <FleetManager trucks={trucks.filter(t => t.role === 'DRIVER')} shipments={shipments} onUpdateTruck={(t) => setTrucks(prev => prev.map(item => item.id === t.id ? t : item))} onAddTruck={(t) => setTrucks(prev => [t, ...prev])} onDeleteTruck={(id) => setTrucks(prev => prev.filter(t => t.id !== id))} searchTerm={globalSearch} />;
      case 'accounts': return <AccountManager trucks={trucks} onUpdateTruck={(t) => setTrucks(prev => prev.map(item => item.id === t.id ? t : item))} onDeleteTruck={(id) => setTrucks(prev => prev.filter(t => t.id !== id))} onAddTruck={(t) => setTrucks(prev => [t, ...prev])} searchTerm={globalSearch} />;
      case 'live-map': return <LiveMap trucks={trucks.filter(t => t.role === 'DRIVER')} shipments={shipments} />;
      case 'districts': return <DistrictsManager trucks={trucks.filter(t => t.role === 'DRIVER')} shipments={shipments} searchTerm={globalSearch} />;
      case 'integrations': return <IntegrationsManager />;
      case 'settings': return <Settings />;
      default: return <Dashboard stats={stats} pendingShipments={[]} trucks={[]} onAutoAssign={() => {}} />;
    }
  };

  if (viewState === 'landing') return <LandingPage onGoToLogin={() => setViewState('login')} />;
  if (viewState === 'login') return <Login onLogin={handleLogin} trucks={trucks} />;

  return (
    <ErrorBoundary>
      <div className="flex bg-[#F8FAFC] min-h-screen font-['Cairo'] text-slate-900 overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role={role} onLogout={handleLogout} />
        <div className="flex-1 mr-72 flex flex-col h-screen overflow-hidden">
          <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 px-12 flex items-center justify-between sticky top-0 z-40">
            <div className="relative group w-[450px]">
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input type="text" value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)} placeholder="ابحث في النظام..." className="w-full pr-14 pl-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" />
            </div>
            <div className="flex items-center gap-6">
              <button className="relative p-3.5 bg-slate-50 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all"><Bell size={22} /></button>
              <div className="flex items-center gap-4 cursor-pointer">
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900 leading-none">{currentUser?.driverName || ADMIN_NAME}</p>
                  <p className="text-[10px] text-indigo-600 font-black uppercase mt-1">{role === 'ADMIN' ? 'مدير عام' : 'كابتن'}</p>
                </div>
                <div className="w-12 h-12 rounded-xl border-2 border-slate-50 overflow-hidden elite-shadow">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.username || 'Felix'}`} className="w-full h-full object-cover" alt="User" />
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-12 custom-scrollbar">
            {renderContent()}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
