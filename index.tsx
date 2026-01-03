
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
import { ADMIN_NAME, JEDDAH_DISTRICTS } from './constants';
import { Search, Bell, Menu, X, AlertTriangle, RefreshCcw, Box } from 'lucide-react';

injectSpeedInsights();

// Fixed Admin Avatar URL (Strictly Male Seed - Emad)
const ADMIN_AVATAR_URL = `https://api.dicebear.com/7.x/avataaars/svg?seed=EmadManagerJeddah&top=shortHair&hairColor=black&facialHair=none&skinColor=pale&eyebrows=flatNatural&clothes=shirthemp`;

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
            <h1 className="text-2xl font-black text-slate-900 mb-4">خطأ في تحميل الواجهة</h1>
            <p className="text-slate-500 font-bold mb-8">حدث خلل أثناء معالجة البيانات. يرجى إعادة المحاولة.</p>
            <button onClick={() => window.location.reload()} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 w-full">
              <RefreshCcw size={20} /> تحديث الصفحة
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [role, setRole] = useState<UserRole>('ADMIN');
  const [currentUser, setCurrentUser] = useState<Truck | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isManualShipmentOpen, setIsManualShipmentOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [appReady, setAppReady] = useState(false);

  const STORAGE_KEY_SHIPMENTS = 'jeddah_logistics_shipments_v5';
  const STORAGE_KEY_TRUCKS = 'jeddah_logistics_trucks_v5';
  const STORAGE_KEY_USER = 'jeddah_logistics_user_v5';

  useEffect(() => {
    const savedTrucks = localStorage.getItem(STORAGE_KEY_TRUCKS);
    const savedShipments = localStorage.getItem(STORAGE_KEY_SHIPMENTS);
    const savedUser = localStorage.getItem(STORAGE_KEY_USER);

    if (savedTrucks) {
      setTrucks(JSON.parse(savedTrucks));
    } else {
      // Initialize with 50 drivers as requested, assigned to Jeddah districts
      const initialTrucks: Truck[] = Array.from({ length: 50 }, (_, i) => ({
        id: `TRK-${Date.now()}-${i}`,
        plateNumber: `${1000 + i} JED`,
        driverName: `مندوب ${i + 1}`,
        driverPhone: `050${1000000 + i}`,
        username: `driver${i + 1}`,
        password: '123',
        assignedDistrict: JEDDAH_DISTRICTS[i % JEDDAH_DISTRICTS.length],
        capacity: 50,
        currentLoad: 0,
        totalCodCollected: 0,
        status: 'Active',
        role: 'DRIVER',
        permissions: { canManageFleet: false, canManageShipments: true, canViewFinancials: false, canEditSettings: false, canManageUsers: false, canDeleteData: false, canExportReports: false },
        location: { lat: 21.5 + (Math.random() - 0.5) * 0.1, lng: 39.2 + (Math.random() - 0.5) * 0.1 },
        efficiencyScore: 85 + Math.floor(Math.random() * 15)
      }));
      setTrucks(initialTrucks);
    }

    if (savedShipments) setShipments(JSON.parse(savedShipments));
    
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setRole(user.role);
      setViewState('app');
    }
    setAppReady(true);
  }, []);

  useEffect(() => {
    if (appReady) {
      localStorage.setItem(STORAGE_KEY_TRUCKS, JSON.stringify(trucks));
      localStorage.setItem(STORAGE_KEY_SHIPMENTS, JSON.stringify(shipments));
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
      }
    }
  }, [trucks, shipments, currentUser, appReady]);

  const handleLogin = (user: any) => {
    const finalUser = user.id === 'ADMIN' ? {
      id: 'ADMIN', driverName: ADMIN_NAME, username: 'admin', role: 'ADMIN' as UserRole,
      permissions: { canManageFleet: true, canManageShipments: true, canViewFinancials: true, canEditSettings: true, canManageUsers: true, canDeleteData: true, canExportReports: true }
    } : user;
    setCurrentUser(finalUser);
    setRole(finalUser.role);
    setViewState('app');
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY_USER);
    setCurrentUser(null);
    setViewState('landing');
  };

  const handleDeleteShipment = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الشحنة؟')) {
      setShipments(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleAssignToTruck = (shipmentId: string, truckId: string) => {
    setShipments(prev => prev.map(s => s.id === shipmentId ? { ...s, assignedTruckId: truckId, status: ShipmentStatus.ASSIGNED } : s));
    setTrucks(prev => prev.map(t => t.id === truckId ? { ...t, currentLoad: t.currentLoad + 1 } : t));
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

  const stats: Stats = {
    totalShipments: shipments.length,
    deliveredToday: shipments.filter(s => s.status === ShipmentStatus.DELIVERED).length,
    pendingAssignment: shipments.filter(s => s.status === ShipmentStatus.PENDING).length,
    activeTrucks: trucks.filter(t => t.status === 'Active' && t.role === 'DRIVER').length,
    avgDeliveryTime: '88 دقيقة',
    totalCodToCollect: shipments.reduce((acc, s) => acc + (s.paymentMethod === 'COD' && s.status !== ShipmentStatus.DELIVERED ? s.codAmount : 0), 0)
  };

  if (viewState === 'landing') return <LandingPage onGoToLogin={() => setViewState('login')} />;
  if (viewState === 'login') return <Login onLogin={handleLogin} trucks={trucks} />;

  return (
    <ErrorBoundary>
      <div className="flex bg-[#F8FAFC] min-h-screen font-['Cairo'] text-slate-900 overflow-hidden relative">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          activeTab={activeTab} 
          setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} 
          role={role} 
          onLogout={handleLogout} 
          adminAvatar={ADMIN_AVATAR_URL}
        />
        
        <div className="flex-1 lg:mr-72 flex flex-col h-screen overflow-hidden transition-all duration-300">
          <header className="h-20 lg:h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 lg:px-12 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2.5 bg-slate-50 rounded-xl text-slate-600">
                <Menu size={24} />
              </button>
              <div className="relative group w-full max-w-[400px] hidden md:block">
                <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={globalSearch} 
                  onChange={(e) => setGlobalSearch(e.target.value)} 
                  placeholder="ابحث عن شحنة أو رقم طلب..." 
                  className="w-full pr-14 pl-6 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" 
                />
              </div>
            </div>

            <div className="flex items-center gap-4 lg:gap-6">
              <button className="relative p-2.5 lg:p-3.5 bg-slate-50 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all">
                <Bell size={20} />
              </button>
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-slate-900 leading-none">{currentUser?.driverName || ADMIN_NAME}</p>
                  <p className="text-[10px] text-indigo-600 font-black uppercase mt-1">{role === 'ADMIN' ? 'المدير التنفيذي' : 'مندوب التوصيل'}</p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl border-2 border-indigo-600/10 overflow-hidden elite-shadow bg-slate-100">
                  <img src={role === 'ADMIN' ? ADMIN_AVATAR_URL : `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.username}`} className="w-full h-full object-cover" alt="User" />
                </div>
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar">
            {role === 'DRIVER' ? (
              <DriverView shipments={shipments} onUpdateStatus={handleUpdateShipmentStatus} trucks={trucks} currentUser={currentUser} />
            ) : (
              <>
                {activeTab === 'dashboard' && <Dashboard stats={stats} pendingShipments={shipments.filter(s => s.status === ShipmentStatus.PENDING)} trucks={trucks.filter(t => t.role === 'DRIVER')} onAutoAssign={handleAssignToTruck} />}
                {activeTab === 'shipments' && <ShipmentManager shipments={shipments} trucks={trucks.filter(t => t.role === 'DRIVER')} onUpdateStatus={handleUpdateShipmentStatus} onAssign={handleAssignToTruck} onAddShipment={(s) => setShipments(prev => [s, ...prev])} onDeleteShipment={handleDeleteShipment} isCreateModalOpen={isManualShipmentOpen} setIsCreateModalOpen={setIsManualShipmentOpen} onImport={(data) => setShipments(prev => [...data, ...prev])} searchTerm={globalSearch} />}
                {activeTab === 'fleet' && <FleetManager trucks={trucks.filter(t => t.role === 'DRIVER')} shipments={shipments} onUpdateTruck={(t) => setTrucks(prev => prev.map(item => item.id === t.id ? t : item))} onAddTruck={(t) => setTrucks(prev => [t, ...prev])} onDeleteTruck={(id) => setTrucks(prev => prev.filter(t => t.id !== id))} searchTerm={globalSearch} />}
                {activeTab === 'live-map' && <LiveMap trucks={trucks.filter(t => t.role === 'DRIVER')} shipments={shipments} />}
                {activeTab === 'analytics' && <Analytics trucks={trucks.filter(t => t.role === 'DRIVER')} shipments={shipments} />}
                {activeTab === 'districts' && <DistrictsManager trucks={trucks.filter(t => t.role === 'DRIVER')} shipments={shipments} />}
                {activeTab === 'accounts' && <AccountManager trucks={trucks} onUpdateTruck={(t) => setTrucks(prev => prev.map(item => item.id === t.id ? t : item))} onDeleteTruck={(id) => setTrucks(prev => prev.filter(t => t.id !== id))} onAddTruck={(t) => setTrucks(prev => [t, ...prev])} searchTerm={globalSearch} />}
                {activeTab === 'integrations' && <IntegrationsManager />}
                {activeTab === 'settings' && <Settings />}
              </>
            )}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
