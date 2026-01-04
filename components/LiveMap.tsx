import React, { useState, useEffect } from 'react';
import { Truck as TruckIcon, MapPin, Package, X, Phone, User, Activity, Navigation, Globe } from 'lucide-react';
import { Truck, Shipment } from '../types';

interface LiveMapProps {
  trucks: Truck[];
  shipments: Shipment[];
}

const LiveMap: React.FC<LiveMapProps> = ({ trucks, shipments }) => {
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);

  const getPosition = (loc: { lat: number, lng: number }) => {
    const minLat = 21.3, maxLat = 21.8;
    const minLng = 39.0, maxLng = 39.4;
    
    const x = ((loc.lng - minLng) / (maxLng - minLng)) * 100;
    const y = 100 - (((loc.lat - minLat) / (maxLat - minLat)) * 100);
    
    return { 
      left: `${Math.max(5, Math.min(95, x))}%`, 
      top: `${Math.max(5, Math.min(95, y))}%` 
    };
  };

  const getTruckShipments = (truckId: string) => shipments.filter(s => s.assignedTruckId === truckId);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in duration-500 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">خريطة التتبع المباشرة</h2>
          <p className="text-slate-500 mt-1 font-medium">مراقبة حية لأسطول جدة الميداني وتدفق الشحنات</p>
        </div>
        <div className="flex gap-2">
           <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 flex items-center gap-2 shadow-sm">
             <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.7)]"></div>
             <span className="text-xs font-black text-slate-700">GPS الهاتف المباشر نشط</span>
           </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* High-Contrast Interactive Map Container */}
        <div className="flex-1 bg-[#e0e7ff] rounded-[3rem] relative overflow-hidden shadow-inner border-[12px] border-white group">
          
          <div className="absolute inset-0 opacity-[0.35] pointer-events-none select-none">
             <svg viewBox="0 0 800 1000" className="w-full h-full" fill="none">
               {/* Coastline with darker indigo */}
               <path d="M150 0C150 0 120 200 180 400C240 600 130 800 150 1000" stroke="#3730a3" strokeWidth="200" strokeOpacity="0.15"/>
               {/* High visibility grid */}
               <path d="M250 0V1000M450 0V1000M650 0V1000" stroke="#4338ca" strokeWidth="2" strokeOpacity="0.2" strokeDasharray="10 10"/>
               <path d="M0 250H800M0 500H800M0 750H800" stroke="#4338ca" strokeWidth="2" strokeOpacity="0.2" strokeDasharray="10 10"/>
               
               {/* Districts Names in Map View */}
               <text x="300" y="300" fill="#312e81" fontSize="24" className="opacity-40 font-black">الشاطئ</text>
               <text x="500" y="500" fill="#312e81" fontSize="24" className="opacity-40 font-black">الروضة</text>
               <text x="350" y="700" fill="#312e81" fontSize="24" className="opacity-40 font-black">الفيحاء</text>
             </svg>
          </div>

          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
             <div className="text-indigo-900/5 font-black text-[140px] uppercase rotate-[-25deg] select-none">Live tracking</div>
          </div>

          {/* Truck Markers with clear white ring */}
          {trucks.filter(t => t.status === 'Active').map((truck) => (
            <div
              key={truck.id}
              className="absolute transition-all duration-700 transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={getPosition(truck.location)}
            >
              <button 
                onClick={() => setSelectedTruck(truck)}
                className={`p-2.5 rounded-2xl shadow-2xl border-4 transition-all ${
                  selectedTruck?.id === truck.id ? 'bg-indigo-600 border-white scale-125' : 'bg-slate-900 border-white hover:scale-110'
                }`}
              >
                <TruckIcon size={20} className="text-white" />
              </button>
              {selectedTruck?.id === truck.id && (
                <div className="absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-4 py-2 rounded-xl shadow-xl border border-indigo-50 animate-in zoom-in-90 flex items-center gap-2">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                   <p className="text-xs font-black text-slate-900">{truck.driverName}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sidebar Info Panel */}
        <div className="w-[400px] bg-white rounded-[3rem] shadow-2xl border border-slate-50 flex flex-col min-h-0 overflow-hidden">
          {selectedTruck ? (
            <div className="flex flex-col h-full animate-in slide-in-from-left-4 duration-500">
              <div className="p-10 bg-slate-900 text-white relative">
                <button onClick={() => setSelectedTruck(null)} className="absolute left-6 top-6 text-slate-500 hover:text-white"><X size={24} /></button>
                <div className="flex items-center gap-5 mb-6">
                  <div className="bg-indigo-600 p-4 rounded-3xl shadow-2xl shadow-indigo-600/30">
                    <TruckIcon size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight">{selectedTruck.driverName}</h3>
                    <p className="text-indigo-400 text-xs font-black uppercase tracking-widest mt-1">{selectedTruck.plateNumber}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                   <div className="flex-1 bg-white/10 p-3 rounded-2xl border border-white/5 text-center">
                      <p className="text-[9px] text-slate-400 uppercase font-black mb-1">الحي</p>
                      <p className="text-xs font-black">{selectedTruck.assignedDistrict}</p>
                   </div>
                   <div className="flex-1 bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/10 text-center">
                      <p className="text-[9px] text-emerald-400 uppercase font-black mb-1">الموقع</p>
                      <p className="text-xs font-black text-emerald-400">محدث الآن</p>
                   </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
                 <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <Navigation size={14} className="text-indigo-600" /> إحداثيات GPS
                    </h4>
                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                       <p className="text-xs font-bold text-slate-600 mb-2">الإحداثيات الفعلية:</p>
                       <p className="font-mono text-[11px] text-indigo-600 tracking-wider">{selectedTruck.location.lat.toFixed(6)}, {selectedTruck.location.lng.toFixed(6)}</p>
                       <p className="text-[10px] text-slate-400 mt-2 font-black italic">آخر تحديث من هاتف المندوب</p>
                    </div>
                 </div>

                 <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <Package size={14} className="text-indigo-600" /> الشحنات المحمولة ({getTruckShipments(selectedTruck.id).length})
                    </h4>
                    <div className="space-y-3">
                       {getTruckShipments(selectedTruck.id).map(shp => (
                         <div key={shp.id} className="p-5 bg-white border border-slate-100 rounded-[2rem] hover:shadow-lg transition-all">
                            <div className="flex justify-between items-center mb-2">
                               <span className="text-sm font-black text-slate-900">{shp.orderNumber}</span>
                               <span className="text-[9px] font-black bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full uppercase">{shp.status}</span>
                            </div>
                            <p className="text-xs font-bold text-slate-500 truncate">{shp.customerName}</p>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
              
              <div className="p-10 border-t border-slate-50">
                 <a 
                   href={`https://www.google.com/maps?q=${selectedTruck.location.lat},${selectedTruck.location.lng}`} 
                   target="_blank" 
                   rel="noreferrer"
                   className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-3 hover:bg-black transition-all"
                 >
                    <Globe size={18} /> معاينة في خرائط جوجل
                 </a>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6">
              <div className="bg-slate-50 p-8 rounded-[3rem] text-slate-300">
                <MapPin size={64} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">تتبع الأسطول الميداني</h3>
                <p className="text-slate-500 mt-3 font-medium text-sm leading-relaxed px-4">
                  اختر مندوباً من الخريطة لعرض موقعه المباشر وتفاصيل شحناته الجارية الآن في شوارع جدة.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveMap;
