
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
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
import { Shipment, Truck, Stats, ShipmentStatus, UserRole, DeliveryDetails, AppPermissions } from './types';
import { ADMIN_NAME } from './constants';
import { Search, Bell, ShieldAlert, Lock, ArrowRight } from 'lucide-react';

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

  const STORAGE_KEY_SHIPMENTS = 'jeddah_shipments_v12';
  const STORAGE_KEY_TRUCKS = 'jeddah_trucks_v12';
  const STORAGE_KEY_AUTH = 'jeddah_auth_v12';
  const STORAGE_KEY_USER = 'jeddah_user_v12';

  // Initialize with 50 trucks if empty
  useEffect(() => {
    const savedTrucks = localStorage.getItem(STORAGE_KEY_TRUCKS);
    if (!savedTrucks || JSON.parse(savedTrucks).length === 0) {
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
    }
  }, []);

  useEffect(() => {
    const savedShipments = localStorage.getItem(STORAGE_KEY_SHIPMENTS);
    const savedTrucks = localStorage.getItem(STORAGE_KEY_TRUCKS);
    const authStatus = localStorage.getItem(STORAGE_KEY_AUTH);
    const savedUser = localStorage.getItem(STORAGE_KEY_USER);
    
    const loadedTrucks = savedTrucks ? JSON.parse(savedTrucks) : [];
    if (savedShipments) setShipments(JSON.parse(savedShipments));
    if (loadedTrucks.length > 0) setTrucks(loadedTrucks);

    if (authStatus === 'true' && savedUser) {
      setIsAuthenticated(true);
      const user = JSON.parse(savedUser);
      const latestUser = loadedTrucks.find((t: Truck) => t.id === user.id) || user;
      setCurrentUser(latestUser);
      setRole(latestUser.role || 'ADMIN');
      setViewState('app');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SHIPMENTS, JSON.stringify(shipments));
    localStorage.setItem(STORAGE_KEY_TRUCKS, JSON.stringify(trucks));
  }, [shipments, trucks]);

  const handleLogin = (user: Truck | any) => {
    setIsAuthenticated(true);
    const finalUser = user.id === 'ADMIN' ? {
      id: 'ADMIN',
      driverName: ADMIN_NAME,
      username: 'admin',
      role: 'ADMIN',
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
          setTrucks(tList => tList.map(t => 
            t.id === s.assignedTruckId ? { ...t, totalCodCollected: t.totalCodCollected + (details.cashCollected || 0) } : t
          ));
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

  const AccessDenied = ({ feature }: { feature: string }) => (
    <div className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-[4rem] border border-slate-100 shadow-xl p-12 text-center animate-in zoom-in-95 duration-300">
      <div className="bg-rose-50 w-24 h-24 rounded-full flex items-center justify-center text-rose-500 mb-8 border-4 border-rose-100">
        <Lock size={40} />
      </div>
      <h3 className="text-3xl font-black text-slate-900 mb-4">الدخول مقيد</h3>
      <p className="text-slate-500 max-w-md font-bold text-lg mb-8 leading-relaxed">
        عذراً، حسابك لا يمتلك صلاحية الوصول إلى قسم <span className="text-indigo-600">({feature})</span>. يرجى التواصل مع مدير النظام لتعديل مصفوفة الصلاحيات الخاصة بك.
      </p>
      <button 
        onClick={() => setActiveTab('dashboard')}
        className="flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:bg-black transition-all"
      >
        <ArrowRight size={20} />
        العودة للوحة التحكم
      </button>
    </div>
  );

  const stats: Stats = {
    totalShipments: shipments.length,
    deliveredToday: shipments.filter(s => s.status === ShipmentStatus.DELIVERED).length,
    pendingAssignment: shipments.filter(s => s.status === ShipmentStatus.PENDING).length,
    activeTrucks: trucks.filter(t => t.status === 'Active' && t.role === 'DRIVER').length,
    avgDeliveryTime: shipments.length > 0 ? '88 دقيقة' : '0 دقيقة',
    totalCodToCollect: shipments.reduce((acc, s) => acc + (s.paymentMethod === 'COD' ? s.codAmount : 0), 0)
  };

  const renderContent = () => {
    if (role === 'DRIVER') return <DriverView shipments={shipments} onUpdateStatus={handleUpdateShipmentStatus} trucks={trucks} currentUser={currentUser} />;
    
    const perms = currentUser?.permissions || { canManageFleet: true, canManageShipments: true, canViewFinancials: true, canEditSettings: true, canManageUsers: true, canDeleteData: true, canExportReports: true };

    switch (activeTab) {
      case 'dashboard': return <Dashboard stats={stats} pendingShipments={shipments.filter(s => s.status === ShipmentStatus.PENDING)} trucks={trucks.filter(t => t.role === 'DRIVER')} onAutoAssign={handleAssignToTruck} />;
      case 'shipments': return perms.canManageShipments ? <ShipmentManager shipments={shipments} trucks={trucks.filter(t => t.role === 'DRIVER')} onUpdateStatus={handleUpdateShipmentStatus} onAssign={handleAssignToTruck} onAddShipment={(s) => setShipments(prev => [s, ...prev])} isCreateModalOpen={isManualShipmentOpen} setIsCreateModalOpen={setIsManualShipmentOpen} onImport={(data) => setShipments(prev => [...data, ...prev])} searchTerm={globalSearch} /> : <AccessDenied feature="إدارة الشحنات" />;
      case 'analytics': return perms.canExportReports ? <Analytics trucks={trucks.filter(t => t.role === 'DRIVER')} shipments={shipments} /> : <AccessDenied feature="الإحصائيات" />;
      case 'fleet': return perms.canManageFleet ? <FleetManager trucks={trucks.filter(t => t.role === 'DRIVER')} shipments={shipments} onUpdateTruck={(t) => setTrucks(prev => prev.map(item => item.id === t.id ? t : item))} onAddTruck={(t) => setTrucks(prev => [t, ...prev])} onDeleteTruck={(id) => setTrucks(prev => prev.filter(t => t.id !== id))} searchTerm={globalSearch} /> : <AccessDenied feature="إدارة الأسطول" />;
      case 'accounts': return perms.canManageUsers ? <AccountManager trucks={trucks} onUpdateTruck={(t) => setTrucks(prev => prev.map(item => item.id === t.id ? t : item))} onDeleteTruck={(id) => setTrucks(prev => prev.filter(t => t.id !== id))} onAddTruck={(t) => setTrucks(prev => [t, ...prev])} searchTerm={globalSearch} /> : <AccessDenied feature="إدارة المستخدمين" />;
      case 'live-map': return perms.canManageFleet ? <LiveMap trucks={trucks.filter(t => t.role === 'DRIVER')} shipments={shipments} /> : <AccessDenied feature="التتبع المباشر" />;
      case 'districts': return <DistrictsManager trucks={trucks.filter(t => t.role === 'DRIVER')} shipments={shipments} searchTerm={globalSearch} />;
      case 'integrations': return perms.canEditSettings ? <IntegrationsManager /> : <AccessDenied feature="الربط البرمجي" />;
      case 'settings': return perms.canEditSettings ? <Settings /> : <AccessDenied feature="الإعدادات العامة" />;
      default: return <Dashboard stats={stats} pendingShipments={[]} trucks={[]} onAutoAssign={() => {}} />;
    }
  };

  if (viewState === 'landing') return <LandingPage onGoToLogin={() => setViewState('login')} />;
  if (viewState === 'login') return <Login onLogin={handleLogin} trucks={trucks} />;

  // Admin and driver icons seeds (male)
  const userSeed = currentUser?.id === 'ADMIN' ? 'Felix' : currentUser?.username;

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-['Cairo'] text-slate-900 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role={role} onLogout={handleLogout} />
      <div className="flex-1 mr-72 flex flex-col h-screen overflow-hidden">
        <header className="h-28 bg-white/80 backdrop-blur-md border-b border-slate-100 px-12 flex items-center justify-between sticky top-0 z-40">
          <div className="relative group w-[500px]">
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="ابحث عن رقم شحنة، اسم عميل، أو مندوب..." 
              className="w-full pr-14 pl-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600/10 focus:bg-white rounded-[2rem] text-sm font-bold outline-none transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-8">
            <button className="relative p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
              <Bell size={24} />
              <span className="absolute top-3 left-3 w-3 h-3 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-12 w-px bg-slate-100"></div>
            <div className="flex items-center gap-5 group cursor-pointer">
              <div className="flex flex-col text-left">
                <span className="text-base font-black text-slate-900">{currentUser?.driverName || ADMIN_NAME}</span>
                <span className="text-[11px] text-indigo-600 font-black uppercase tracking-widest leading-none mt-1.5">{role === 'ADMIN' ? 'مدير عام' : role === 'DRIVER' ? 'كابتن توصيل' : 'مشرف'}</span>
              </div>
              <div className="w-16 h-16 rounded-[1.5rem] border-4 border-slate-50 overflow-hidden shadow-2xl group-hover:scale-105 transition-transform">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userSeed}&top=shortHair&clothing=shirtAndTie&baseColor=f5c1a1`} 
                  className="w-full h-full object-cover" 
                  alt="User" 
                />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
