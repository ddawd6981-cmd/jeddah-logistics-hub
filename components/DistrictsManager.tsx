
import React, { useState, useMemo } from 'react';
import { MapPin, Truck, Package, ChevronLeft, Map as MapIcon, Search, X, Plus, Trash2, CheckCircle, Settings2 } from 'lucide-react';
import { Truck as TruckType, Shipment, ShipmentStatus } from '../types';
import { JEDDAH_DISTRICTS as ALL_DISTRICTS } from '../constants';

interface Props {
  trucks: TruckType[];
  shipments: Shipment[];
  searchTerm?: string;
}

const DistrictsManager: React.FC<Props> = ({ trucks, shipments, searchTerm = '' }) => {
  const [activeDistricts, setActiveDistricts] = useState<string[]>(ALL_DISTRICTS);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [districtSearch, setDistrictSearch] = useState('');

  const filteredDistricts = useMemo(() => {
    const finalSearch = searchTerm || districtSearch;
    return activeDistricts.filter(d => d.includes(finalSearch));
  }, [activeDistricts, districtSearch, searchTerm]);

  const getDistrictStats = (district: string) => {
    const districtTrucks = trucks.filter(t => t.assignedDistrict === district);
    const districtShipments = shipments.filter(s => s.district === district);
    const pending = districtShipments.filter(s => s.status === ShipmentStatus.PENDING).length;
    
    return {
      truckCount: districtTrucks.length,
      shipmentCount: districtShipments.length,
      pendingCount: pending
    };
  };

  const toggleDistrict = (district: string) => {
    setActiveDistricts(prev => 
      prev.includes(district) ? prev.filter(d => d !== district) : [...prev, district]
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">توزيع الأحياء والمناطق</h2>
          <p className="text-slate-500 mt-1 font-medium">إدارة {activeDistricts.length} حي مغطى في مدينة جدة</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="bg-white border-2 border-slate-200 px-6 py-3 rounded-2xl text-sm font-black text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center gap-2 shadow-sm"
          >
            <Settings2 size={18} />
            تعديل نطاق التغطية
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="ابحث عن حي محدد في جدة..." 
            className="w-full pr-12 pl-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
            value={districtSearch}
            onChange={(e) => setDistrictSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDistricts.map((district) => {
          const stats = getDistrictStats(district);
          return (
            <div key={district} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] -mr-12 -mt-12 group-hover:bg-indigo-50 transition-colors"></div>
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="bg-slate-100 p-3 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                  <MapPin size={24} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">المنطقة</span>
                  <span className="text-xs font-black text-indigo-600">جدة</span>
                </div>
              </div>
              
              <h3 className="text-xl font-black text-slate-900 mb-8 relative z-10">{district}</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 group-hover:bg-white transition-colors">
                  <div className="flex items-center gap-2 text-indigo-600 mb-1">
                    <Truck size={14} />
                    <span className="text-[10px] font-black uppercase">المناديب</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{stats.truckCount}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 group-hover:bg-white transition-colors">
                  <div className="flex items-center gap-2 text-emerald-600 mb-1">
                    <Package size={14} />
                    <span className="text-[10px] font-black uppercase">الشحنات</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{stats.shipmentCount}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm relative z-10 pt-4 border-t border-slate-50">
                <span className="text-slate-500 font-black text-xs">بانتظار الإسناد: <span className="text-rose-500">{stats.pendingCount}</span></span>
                <button className="flex items-center gap-1 text-slate-400 font-black hover:text-indigo-600 transition-colors group/btn">
                  إدارة الحي
                  <ChevronLeft size={16} className="group-hover/btn:-translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Edit Coverage */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
             <div className="flex justify-between items-center mb-8">
               <div>
                 <h3 className="text-2xl font-black text-slate-900">تعديل نطاق التغطية</h3>
                 <p className="text-slate-500 text-sm font-bold">حدد الأحياء التي يعمل بها النظام حالياً في مدينة جدة</p>
               </div>
               <button onClick={() => setIsEditModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors">
                  <X size={28} className="text-slate-400" />
               </button>
             </div>

             <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                   {ALL_DISTRICTS.map(district => (
                     <button 
                       key={district}
                       onClick={() => toggleDistrict(district)}
                       className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                         activeDistricts.includes(district) 
                         ? 'border-indigo-600 bg-indigo-50 text-indigo-900' 
                         : 'border-slate-50 bg-slate-50 text-slate-400 grayscale'
                       }`}
                     >
                        <span className="font-black text-sm">{district}</span>
                        {activeDistricts.includes(district) ? <CheckCircle size={20} className="text-indigo-600" /> : <Plus size={20} />}
                     </button>
                   ))}
                </div>
             </div>

             <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end gap-4">
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-black shadow-xl shadow-slate-200 transition-all"
                >
                  حفظ التغييرات
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistrictsManager;
