
import React, { useState, useMemo } from 'react';
import { Truck as TruckIcon, User, Phone, MapPin, Package, MoreVertical, X, Plus, Edit2, Trash2, Save, AlertTriangle, CheckSquare, Square, ShieldCheck, Search, Activity, Navigation, Settings2 } from 'lucide-react';
import { Truck, Shipment } from '../types';
import { JEDDAH_DISTRICTS, SUPPORT_PHONE } from '../constants';

interface Props {
  trucks: Truck[];
  shipments: Shipment[];
  onUpdateTruck: (truck: Truck) => void;
  onAddTruck: (truck: Truck) => void;
  onDeleteTruck: (id: string) => void;
  searchTerm?: string;
}

const FleetManager: React.FC<Props> = ({ trucks, shipments, onUpdateTruck, onAddTruck, onDeleteTruck, searchTerm = '' }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  const finalSearch = searchTerm || localSearch;

  const filteredTrucks = useMemo(() => trucks.filter(t => 
    t.driverName.toLowerCase().includes(finalSearch.toLowerCase()) || 
    t.plateNumber.toLowerCase().includes(finalSearch.toLowerCase()) ||
    t.assignedDistrict.toLowerCase().includes(finalSearch.toLowerCase())
  ), [trucks, finalSearch]);

  const toggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBatchStatus = (status: 'Active' | 'Suspended') => {
    selectedIds.forEach(id => {
      const t = trucks.find(tr => tr.id === id);
      if (t) onUpdateTruck({ ...t, status });
    });
    setSelectedIds(new Set());
  };

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">إدارة الأسطول الميداني</h2>
          <p className="text-slate-500 mt-2 font-medium">التحكم في {trucks.length} مندوب في أنحاء جدة</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 shadow-2xl shadow-slate-900/20 hover:bg-black transition-all active:scale-95"
          >
            <Plus size={20} />
            إضافة مندوب جديد
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="ابحث باسم المندوب، الحي، أو رقم اللوحة..." 
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pr-14 pl-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
          />
        </div>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 animate-in fade-in zoom-in duration-300">
             <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl">
               {selectedIds.size} مندوب محدد
             </span>
             <button 
                onClick={() => handleBatchStatus('Active')}
                className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-black text-xs hover:bg-emerald-700 transition-all shadow-lg"
             >
               تفعيل
             </button>
             <button 
                onClick={() => handleBatchStatus('Suspended')}
                className="flex items-center gap-2 bg-rose-50 text-rose-600 px-5 py-2.5 rounded-xl font-black text-xs hover:bg-rose-100 transition-all"
             >
               إيقاف مؤقت
             </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTrucks.map((truck) => (
          <div 
            key={truck.id} 
            onClick={() => setSelectedTruck(truck)}
            className={`bg-white rounded-[3rem] border-2 transition-all overflow-hidden group cursor-pointer relative ${
              selectedIds.has(truck.id) ? 'border-indigo-600 bg-indigo-50/10' : 'border-slate-50 hover:border-indigo-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10'
            }`}
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <button 
                  onClick={(e) => toggleSelectOne(truck.id, e)}
                  className={`transition-colors ${selectedIds.has(truck.id) ? 'text-indigo-600' : 'text-slate-200 hover:text-slate-400'}`}
                >
                  {selectedIds.has(truck.id) ? <CheckSquare size={24} /> : <Square size={24} />}
                </button>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${truck.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {truck.status === 'Active' ? 'متصل' : 'موقوف'}
                </div>
              </div>

              <div className="flex flex-col items-center text-center mb-8">
                 <div className="w-20 h-20 rounded-3xl bg-slate-100 overflow-hidden mb-4 border-4 border-white shadow-lg shadow-slate-200">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${truck.driverName}`} className="w-full h-full object-cover" />
                 </div>
                 <h4 className="text-xl font-black text-slate-900 leading-tight mb-1">{truck.driverName}</h4>
                 <p className="text-xs font-bold text-slate-400">@{truck.username}</p>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl">
                    <div className="text-indigo-600"><MapPin size={18} /></div>
                    <span className="text-sm font-black text-slate-700">{truck.assignedDistrict}</span>
                 </div>
                 <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl">
                    <div className="text-indigo-600"><TruckIcon size={18} /></div>
                    <span className="text-sm font-black text-slate-700" dir="ltr">{truck.plateNumber}</span>
                 </div>
              </div>
            </div>

            <div className="px-8 py-5 bg-slate-50 flex justify-between items-center border-t border-slate-50">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase">الكفاءة</span>
                  <span className="text-sm font-black text-emerald-600">{truck.efficiencyScore}%</span>
               </div>
               <div className="flex flex-col text-left">
                  <span className="text-[10px] font-black text-slate-400 uppercase">الطلبات</span>
                  <span className="text-sm font-black text-slate-900">{truck.currentLoad}</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FleetManager;
