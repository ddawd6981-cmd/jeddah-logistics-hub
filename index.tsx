import React, { useState, useEffect, ReactNode, useMemo } from 'react';
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
import StoreManager from './components/StoreManager';
import { Shipment, Truck, Stats, ShipmentStatus, UserRole, DeliveryDetails, Store } from './types';
import { ADMIN_NAME, JEDDAH_DISTRICTS } from './constants';
import { Search, Bell, Menu, AlertTriangle, RefreshCcw } from 'lucide-react';

injectSpeedInsights();

// Highly reliable avatar for the System Admin - Simplified URL to avoid broken links
const ADMIN_AVATAR_URL = `https://ui-avatars.com/api/?name=${encodeURIComponent(ADMIN_NAME)}&background=6366f1&color=fff&bold=true&size=128`;

interface ErrorBoundaryProps { children?: ReactNode; }
interface ErrorBoundaryState { hasError: boolean; error: Error | null; }

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
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
            <p className="text-slate-500 mb-8 font-bold">حدث خطأ غير متوقع في معالجة البيانات.</p>
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
  const [stores, setStores] = useState<Store[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [appReady, setAppReady] = useState(false);
  const [isCreateShipmentModalOpen, setIsCreateShipmentModalOpen] = useState(false);

  const STORAGE_KEY_SHIPMENTS = 'jeddah_logistics_shipments_v12';
  const STORAGE_KEY_TRUCKS = 'jeddah_logistics_trucks_v12';
  const STORAGE_KEY_USER = 'jeddah_logistics_user_v12';
  const STORAGE_KEY_STORES = 'jeddah_logistics_stores_v12';

  useEffect(() => {
    const savedTrucks = localStorage.getItem(STORAGE_KEY_TRUCKS);
    const savedShipments = localStorage.getItem(STORAGE_KEY_SHIPMENTS);
    const savedUser = localStorage.getItem(STORAGE_KEY_USER);
    const savedStores = localStorage.getItem(STORAGE_KEY_STORES);

    if (savedTrucks) {
      setTrucks(JSON.parse(savedTrucks));
    } else {
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
    if (savedStores) {
      setStores(JSON.parse(savedStores));
    } else {
      setStores([
        { 
          id: 'S1', name: 'عطور مكة', ownerName: 'أحمد', phone: '05555555', totalCodBalance: 0, shipmentCount: 0, joinedAt: new Date().toISOString(), isActive: true,
          permissions: { canSend: true, canReceive: true, accessShipments: true, receiveNotifications: true }
        }
      ]);
    }
    
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
      localStorage.setItem(STORAGE_KEY_STORES, JSON.stringify(stores));
      if (currentUser) localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
      else localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [trucks, shipments, stores, currentUser, appReady]);

  const stats: Stats = useMemo(() => ({
    totalShipments: shipments.length,
    deliveredToday: shipments.filter(s => s.status === ShipmentStatus.DELIVERED).length,
    pendingAssignment: shipments.filter(s => s.status === ShipmentStatus.PENDING).length,
    activeTrucks: trucks.filter(t => t.status === 'Active').length,
    avgDeliveryTime: "45 دقيقة",
    totalCodToCollect: shipments.reduce((acc, curr) => acc + (curr.status !== ShipmentStatus.DELIVERED ? curr.codAmount : 0), 0)
  }), [shipments, trucks]);

  const handleUpdateShipmentStatus = (id: string, newStatus: ShipmentStatus, details?: DeliveryDetails) => {
    setShipments(prev => prev.map(s => {
      if (s.id === id) {
        if (newStatus === ShipmentStatus.DELIVERED && details?.cashCollected && s.assignedTruckId) {
          setTrucks(tList => tList.map(t => t.id === s.assignedTruckId ? { ...t, totalCodCollected: t.totalCodCollected + (details.cashCollected || 0) } : t));
          if (s.storeId) {
            setStores(sList => sList.map(st => st.id === s.storeId ? { ...st, totalCodBalance: st.totalCodBalance + (details.cashCollected || 0) } : st));
          }
        }
        return { ...s, status: newStatus, deliveryDetails: details || s.deliveryDetails };
      }
      return s;
    }));
  };

  const handleAssignShipment = (shipmentId: string, truckId: string) => {
    setShipments(prev => prev.map(s => s.id === shipmentId ? { ...s, assignedTruckId: truckId, status: ShipmentStatus.ASSIGNED } : s));
    setTrucks(prev => prev.map(t => t.id === truckId ? { ...t, currentLoad: t.currentLoad + 1 } : t));
  };

  const handleImportShipments = (newShipments: Shipment[]) => {
    setShipments(prev => [...newShipments, ...prev]);
  };

  const handleAddShipment = (shipment: Shipment) => {
    setShipments(prev => [shipment, ...prev]);
  };

  const handleDeleteShipment = (id: string) => {
    setShipments(prev => prev.filter(s => s.id !== id));
  };

  const handleDeleteBatch = (ids: string[]) => {
    setShipments(prev => prev.filter(s => !ids.includes(s.id)));
  };

  const handleUpdateTruck = (truck: Truck) => {
    setTrucks(prev => prev.map(t => t.id === truck.id ? truck : t));
  };

  const handleAddTruck = (truck: Truck) => {
    setTrucks(prev => [truck, ...prev]);
  };

  const handleDeleteTruck = (id: string) => {
    setTrucks(prev => prev.filter(t => t.id !== id));
  };

  const handleAddStore = (store: Store) => {
    setStores(prev => [store, ...prev]);
  };

  const handleUpdateStore = (store: Store) => {
    setStores(prev => prev.map(s => s.id === store.id ? store : s));
  };

  const handleDeleteStore = (id: string) => {
    setStores(prev => prev.filter(s => s.id !== id));
  };

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    setRole(user.role);
    setViewState('app');
    setActiveTab(user.role === 'ADMIN' ? 'dashboard' : 'dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setViewState('landing');
    localStorage.removeItem(STORAGE_KEY_USER);
  };

  if (viewState === 'landing') {
    return <LandingPage onGoToLogin={() => setViewState('login')} stats={stats} />;
  }

  if (viewState === 'login') {
    return <Login onLogin={handleLogin} trucks={trucks} />;
  }

  const renderContent = () => {
    if (role === 'DRIVER') {
      return (
        <DriverView 
          shipments={shipments} 
          trucks={trucks} 
          currentUser={currentUser} 
          onUpdateStatus={handleUpdateShipmentStatus} 
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stats={stats} pendingShipments={shipments.filter(s => s.status === ShipmentStatus.PENDING)} trucks={trucks} onAutoAssign={handleAssignShipment} />;
      case 'shipments':
        return (
          <ShipmentManager 
            shipments={shipments} 
            trucks={trucks} 
            stores={stores}
            onUpdateStatus={handleUpdateShipmentStatus} 
            onAssign={handleAssignShipment}
            onImport={handleImportShipments}
            onAddShipment={handleAddShipment}
            onDeleteShipment={handleDeleteShipment}
            onDeleteBatch={handleDeleteBatch}
            isCreateModalOpen={isCreateShipmentModalOpen}
            setIsCreateModalOpen={setIsCreateShipmentModalOpen}
            searchTerm={globalSearch}
          />
        );
      case 'fleet':
        return <FleetManager trucks={trucks} shipments={shipments} onUpdateTruck={handleUpdateTruck} onAddTruck={handleAddTruck} onDeleteTruck={handleDeleteTruck} searchTerm={globalSearch} />;
      case 'stores':
        return <StoreManager stores={stores} shipments={shipments} onAddStore={handleAddStore} onUpdateStore={handleUpdateStore} onDeleteStore={handleDeleteStore} />;
      case 'live-map':
        return <LiveMap trucks={trucks} shipments={shipments} />;
      case 'accounts':
        return <AccountManager trucks={trucks} onUpdateTruck={handleUpdateTruck} onDeleteTruck={handleDeleteTruck} onAddTruck={handleAddTruck} searchTerm={globalSearch} />;
      case 'districts':
        return <DistrictsManager trucks={trucks} shipments={shipments} searchTerm={globalSearch} />;
      case 'integrations':
        return <IntegrationsManager />;
      case 'analytics':
        return <Analytics trucks={trucks} shipments={shipments} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard stats={stats} pendingShipments={shipments.filter(s => s.status === ShipmentStatus.PENDING)} trucks={trucks} onAutoAssign={handleAssignShipment} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#FBFDFF] flex font-['Cairo'] selection:bg-indigo-100 overflow-x-hidden" dir="rtl">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          role={role} 
          onLogout={handleLogout} 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
          adminAvatar={ADMIN_AVATAR_URL}
        />
        
        <main className="flex-1 lg:mr-72 min-h-screen transition-all duration-300">
          <header className="h-24 px-6 lg:px-12 bg-white/80 backdrop-blur-xl border-b border-slate-50 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-6 flex-1">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-slate-900 text-white rounded-2xl shadow-lg">
                <Menu size={20} />
              </button>
              
              <div className="relative hidden md:block w-full max-w-lg group">
                <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="بحث سريع عن شحنة، كابتن، أو حي..." 
                  className="w-full pr-14 pl-6 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 lg:gap-8">
              <div className="hidden sm:flex flex-col text-left items-end">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">المستخدم الحالي</p>
                <p className="text-xs font-black text-slate-900">{role === 'ADMIN' ? ADMIN_NAME : currentUser?.driverName}</p>
              </div>
              
              <button className="relative p-3 bg-slate-50 text-slate-500 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                <Bell size={20} />
                <span className="absolute top-2 left-2 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white"></span>
              </button>
              
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 border-2 border-indigo-100 p-0.5 shadow-lg shadow-indigo-100 overflow-hidden cursor-pointer hover:scale-105 transition-transform">
                <img 
                  src={role === 'ADMIN' ? ADMIN_AVATAR_URL : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.driverName || 'User')}&background=6366f1&color=fff&bold=true`} 
                  alt="Avatar" 
                  className="w-full h-full object-cover rounded-[0.9rem] bg-indigo-50" 
                />
              </div>
            </div>
          </header>

          <div className="p-6 lg:p-12 max-w-[1600px] mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
