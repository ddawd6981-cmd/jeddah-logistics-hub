
import React from 'react';
import { 
  LayoutDashboard, Package, Truck, MapPin, Settings, Link as LinkIcon, 
  BarChart3, LogOut, Map as MapIcon, Users, Box, X 
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: UserRole;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
  adminAvatar: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, role, onLogout, isOpen, onClose, adminAvatar }) => {
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

  const menuItems = role === 'ADMIN' ? adminItems : [{ id: 'dashboard', label: 'مهامي الميدانية', icon: Package }];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div className={`w-72 bg-slate-900 h-screen fixed right-0 top-0 text-white flex flex-col z-[70] shadow-2xl transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : 'translate-x-full'} border-l border-white/5`}>
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="bg-indigo-600 w-11 h-11 rounded-xl flex items-center justify-center shadow-xl shadow-indigo-600/40 group-hover:rotate-12 transition-all">
               <Box size={22} className="text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-black tracking-tighter text-white">لوجستيك جدة</h1>
              <span className="text-[9px] text-slate-500 font-black uppercase mt-1">إصدار 3.5 النهائي</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); if (window.innerWidth < 1024) onClose(); }}
              className={`w-full flex items-center gap-3.5 px-6 py-4 rounded-xl transition-all duration-300 group relative ${
                activeTab === item.id ? 'bg-white/10 text-white shadow-xl' : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-indigo-400' : 'text-slate-500'} />
              <span className="font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
           <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-slate-800 overflow-hidden border border-white/10">
               <img src={role === 'ADMIN' ? adminAvatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=driver`} alt="" />
             </div>
             <div className="flex flex-col">
               <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">متصل كـ</span>
               <span className="text-xs font-black text-white">{role === 'ADMIN' ? 'المدير العام' : 'مندوب الميدان'}</span>
             </div>
           </div>
           <button onClick={onLogout} className="flex items-center gap-3 text-slate-500 hover:text-rose-400 transition-all w-full px-6 py-4 rounded-xl hover:bg-rose-500/5 group">
            <LogOut size={20} className="group-hover:rotate-180 transition-transform duration-500" />
            <span className="font-black text-sm">تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
