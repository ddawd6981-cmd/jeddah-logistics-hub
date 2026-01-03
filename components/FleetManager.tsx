
import React, { useState, useMemo } from 'react';
import { Truck as TruckIcon, User, Phone, MapPin, Package, MoreVertical, X, Plus, Edit2, Trash2, Save, AlertTriangle, CheckSquare, Square, ShieldCheck, Search, Activity, Navigation, Settings2, Power, Filter } from 'lucide-react';
import { Truck, Shipment } from '../types';
import { JEDDAH_DISTRICTS } from '../constants';

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
  const [filterDistrict, setFilterDistrict] = useState('ALL');

  const finalSearch = searchTerm || localSearch;

  const filteredTrucks = useMemo(() => trucks.filter(t => {
    const matchesSearch = 
      t.driverName.toLowerCase().includes(finalSearch.toLowerCase()) || 
      t.plateNumber.toLowerCase().includes(finalSearch.toLowerCase());
    
    const matchesDistrict = filterDistrict === 'ALL' || t.assignedDistrict === filterDistrict;
    
    return matchesSearch && matchesDistrict;
  }), [trucks, finalSearch, filterDistrict]);

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredTrucks.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredTrucks.map(t => t.id)));
    }
  };

  const toggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBatchStatus = (status: any) => {
    selectedIds.forEach(id => {
      const t = trucks.find(tr => tr.id === id);
      if (t) onUpdateTruck({ ...t, status });
    });
    setSelectedIds(new Set());
  };

  return (
    <div className="space-y-6 lg:space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-slate-900 p-2.5 rounded-2xl text-white shadow-xl">
              <TruckIcon size={24} />
            </div>
            <h2 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight">إدارة الأسطول الميداني</h2>
          </div>
          <p className="text-slate-500 font-medium">مراقبة {trucks.length} مندوب توصيل نشط في نطاق مدينة جدة</p>
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          {selectedIds.size > 0 && (
            <div className="flex gap-2 flex-1 sm:flex-none">
              <button 
                onClick={() => handleBatchStatus('Active')}
                className="bg-emerald-50 text-emerald-600 px-6 py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-xs hover:bg-emerald-100 transition-all"
              >
                تنشيط ({selectedIds.size})
              </button>
              <button 
                onClick={() => handleBatchStatus('Suspended')}
                className="bg-rose-50 text-rose-600 px-6 py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-xs hover:bg-rose-100 transition-all"
              >
                إيقاف ({selectedIds.size})
              </button>
            </div>
          )}
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl hover:bg-indigo-700 transition-all flex-1 sm:flex-none"
          >
            <Plus size={18} /> إضافة مندوب
          </button>
        </div>
      </div>

      {/* Grid Controls */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
         <div className="relative flex-1 w-full">
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="ابحث بالاسم أو رقم اللوحة..." 
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pr-14 pl-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
            />
         </div>
         <div className="flex items-center gap-3">
            <select 
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="bg-slate-50 border-none rounded-2xl px-6 py-4 text-xs font-black outline-none cursor-pointer"
            >
              <option value="ALL">كل الأحياء</option>
              {JEDDAH_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <button 
              onClick={toggleSelectAll}
              className="flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-2xl text-slate-600 font-black text-sm hover:bg-slate-100 transition-all"
            >
              {selectedIds.size === filteredTrucks.length && filteredTrucks.length > 0 ? <CheckSquare size={18} className="text-indigo-600" /> : <Square size={18} />}
              تحديد الكل
            </button>
         </div>
      </div>

      {/* Drivers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTrucks.map((truck) => (
          <div 
            key={truck.id}
            onClick={() => setSelectedTruck(truck)}
            className={`bg-white p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer group relative overflow-hidden ${
              selectedIds.has(truck.id) ? 'border-indigo-600 shadow-xl shadow-indigo-100' : 'border-slate-100 hover:border-slate-200 shadow-sm'
            }`}
          >
             {/* Selection Overlay */}
             <button 
               onClick={(e) => toggleSelectOne(truck.id, e)}
               className={`absolute top-6 left-6 z-10 p-2 rounded-lg transition-all ${
                 selectedIds.has(truck.id) ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-300 group-hover:text-slate-400'
               }`}
             >
               {selectedIds.has(truck.id) ? <CheckSquare size={18} /> : <Square size={18} />}
             </button>

             <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-[2rem] bg-slate-100 mb-6 overflow-hidden border-4 border-white shadow-lg group-hover:scale-110 transition-transform">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${truck.username}`} className="w-full h-full object-cover" alt="" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1">{truck.driverName}</h3>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">{truck.plateNumber}</p>
                
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                     truck.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                   }`}>
                     {truck.status === 'Active' ? 'نشط' : 'متوقف'}
                   </span>
                   <span className="bg-slate-50 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black">
                     {truck.assignedDistrict}
                   </span>
                </div>

                <div className="w-full grid grid-cols-2 gap-3 pt-6 border-t border-slate-50">
                   <div className="text-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">حمولة</p>
                      <p className="text-lg font-black text-slate-900">{truck.currentLoad}</p>
                   </div>
                   <div className="text-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">التحصيل</p>
                      <p className="text-lg font-black text-emerald-600">{truck.totalCodCollected.toLocaleString()}</p>
                   </div>
                </div>
             </div>
          </div>
        ))}
      </div>

      {filteredTrucks.length === 0 && (
        <div className="py-24 text-center bg-white rounded-[3rem] border border-slate-100">
           <Activity size={48} className="mx-auto text-slate-200 mb-4" />
           <p className="text-slate-400 font-black">لا يوجد نتائج تطابق بحثك</p>
        </div>
      )}
    </div>
  );
};

export default FleetManager;
