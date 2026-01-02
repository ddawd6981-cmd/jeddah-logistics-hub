
import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  MapPin, 
  Settings, 
  Link as LinkIcon, 
  BarChart3,
  LogOut,
  Map as MapIcon,
  Users,
  Phone,
  ShieldCheck,
  MessageCircle,
  Box,
  Layout,
  User
} from 'lucide-react';
import { UserRole } from '../types';
import { SUPPORT_PHONE } from '../constants';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: UserRole;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, role, onLogout }) => {
  const adminItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'shipments', label: 'إدارة الشحنات', icon: Package },
    { id: 'live-map', label: 'التتبع المباشر', icon: MapIcon },
    { id: 'fleet', label: 'الأسطول والمناديب', icon: Truck },
    { id: 'accounts', label: 'مركز الحسابات', icon: Users },
    { id: 'districts', label: 'المناطق والأحياء', icon: MapPin },
    { id: 'integrations', label: 'الربط البرمجي', icon: LinkIcon },
    { id: 'analytics', label: 'الإحصائيات', icon: BarChart3 },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  const driverItems = [
    { id: 'dashboard', label: 'مهام التوصيل', icon: Package },
    { id: 'analytics', label: 'أدائي اليوم', icon: BarChart3 },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  const menuItems = role === 'ADMIN' ? adminItems : driverItems;

  return (
    <div className="w-72 bg-slate-900 h-screen fixed right-0 top-0 text-white flex flex-col z-50 shadow-2xl overflow-hidden border-l border-white/5">
      {/* Brand Logo Section */}
      <div className="p-10 border-b border-white/5">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="relative">
            <div className="bg-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/40 group-hover:rotate-12 transition-transform duration-500">
               <Box size={30} className="text-white" />
            </div>
            <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-slate-900 animate-pulse"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter leading-none text-white">لوجستيك جدة</h1>
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-2">Enterprise v3.5</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-5 py-10 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4.5 rounded-2xl transition-all duration-300 group relative ${
              activeTab === item.id 
                ? 'bg-white/10 text-white shadow-xl shadow-black/20 translate-x-1' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {activeTab === item.id && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-indigo-500 rounded-l-full shadow-[0_0_15px_rgba(99,102,241,0.6)]"></div>
            )}
            <item.icon size={22} className={activeTab === item.id ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300 transition-colors'} />
            <span className="font-bold text-[15px]">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Profile Section with Male Admin Icon */}
      <div className="p-8 mt-auto space-y-6">
        {role === 'ADMIN' && (
          <div className="bg-white/5 border border-white/5 rounded-[2rem] p-5 mb-2 group hover:bg-white/10 transition-colors">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-indigo-600/20 shadow-xl group-hover:scale-110 transition-transform">
                 {/* Explicit Male Admin Icon */}
                 <img 
                   src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&top=shortHair&clothing=shirtAndTie&baseColor=f5c1a1" 
                   className="w-full h-full object-cover" 
                   alt="Admin" 
                 />
               </div>
               <div>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 leading-none">المدير العام</p>
                  <p className="text-base font-black text-white leading-none">عماد</p>
               </div>
             </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2.2rem] p-6 border border-white/5 shadow-2xl">
          <div className="flex items-center gap-3 mb-5">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الدعم الميداني المباشر</p>
          </div>
          <div className="space-y-4">
            <a 
              href={`https://wa.me/${SUPPORT_PHONE.replace('+', '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs hover:bg-emerald-700 shadow-xl shadow-emerald-900/20 transition-all active:scale-95"
            >
              <MessageCircle size={16} />
              واتساب العمليات
            </a>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="flex items-center gap-4 text-slate-500 hover:text-rose-400 transition-all w-full px-6 py-4.5 rounded-2xl hover:bg-rose-500/5 group"
        >
          <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-black text-base">تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
