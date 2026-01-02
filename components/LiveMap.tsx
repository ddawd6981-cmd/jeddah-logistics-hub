
import React, { useState, useEffect } from 'react';
import { Truck as TruckIcon, MapPin, Package, X, Phone, User, Activity } from 'lucide-react';
import { Truck, Shipment } from '../types';

interface LiveMapProps {
  trucks: Truck[];
  shipments: Shipment[];
}

const LiveMap: React.FC<LiveMapProps> = ({ trucks, shipments }) => {
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [simulationCoords, setSimulationCoords] = useState(trucks);

  // Simulate slight movement of trucks for "real-time" feel
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulationCoords(prev => prev.map(t => ({
        ...t,
        location: {
          lat: t.location.lat + (Math.random() - 0.5) * 0.001,
          lng: t.location.lng + (Math.random() - 0.5) * 0.001,
        }
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getTruckShipments = (truckId: string) => {
    return shipments.filter(s => s.assignedTruckId === truckId);
  };

  // Simplified Coordinate-to-Pixels transformation for Jeddah area
  // Lat: 21.4 - 21.7 -> Y: 0% - 100%
  // Lng: 39.1 - 39.25 -> X: 0% - 100%
  const getPosition = (loc: { lat: number, lng: number }) => {
    const minLat = 21.4, maxLat = 21.7;
    const minLng = 39.1, maxLng = 39.25;
    
    const x = ((loc.lng - minLng) / (maxLng - minLng)) * 100;
    const y = 100 - (((loc.lat - minLat) / (maxLat - minLat)) * 100);
    
    return { 
      left: `${Math.max(0, Math.min(100, x))}%`, 
      top: `${Math.max(0, Math.min(100, y))}%` 
    };
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">التتبع المباشر</h2>
          <p className="text-slate-500 mt-1">تتبع 50 شاحنة تجوب أحياء جدة حالياً</p>
        </div>
        <div className="flex gap-2">
           <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-2 shadow-sm">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-sm font-bold text-slate-600">تحديث مباشر كل 3 ثواني</span>
           </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Map Container */}
        <div className="flex-1 bg-slate-200 rounded-3xl relative overflow-hidden shadow-inner border-4 border-white">
          {/* Mock Map Background - Simplified Grid for visualization */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <h3 className="text-4xl font-black text-slate-400/20 tracking-widest uppercase">خريطة جدة الكبرى</h3>
          </div>

          {/* District Labels */}
          <div className="absolute top-10 right-20 text-slate-400 font-bold opacity-30 select-none">أبحر الشمالية</div>
          <div className="absolute top-1/2 left-1/3 text-slate-400 font-bold opacity-30 select-none">الصفا / الروضة</div>
          <div className="absolute bottom-20 right-1/4 text-slate-400 font-bold opacity-30 select-none">البلد</div>

          {/* Truck Markers */}
          {simulationCoords.map((truck) => (
            <button
              key={truck.id}
              onClick={() => setSelectedTruck(truck)}
              className={`absolute transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full shadow-lg border-2 ${
                selectedTruck?.id === truck.id ? 'bg-indigo-600 border-white scale-125 z-20' : 'bg-white border-indigo-600 hover:scale-110'
              }`}
              style={getPosition(truck.location)}
            >
              <TruckIcon size={14} className={selectedTruck?.id === truck.id ? 'text-white' : 'text-indigo-600'} />
            </button>
          ))}
        </div>

        {/* Sidebar Panel for Selection */}
        <div className="w-96 bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col min-h-0 overflow-hidden">
          {selectedTruck ? (
            <div className="flex flex-col h-full animate-in slide-in-from-left-4 duration-300">
              <div className="p-6 bg-slate-900 text-white relative">
                <button 
                  onClick={() => setSelectedTruck(null)}
                  className="absolute left-4 top-4 text-slate-400 hover:text-white"
                >
                  <X size={20} />
                </button>
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-indigo-600 p-3 rounded-2xl">
                    <TruckIcon size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedTruck.id}</h3>
                    <p className="text-indigo-300 font-mono text-sm">{selectedTruck.plateNumber}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold border border-white/10 flex items-center gap-2">
                    <MapPin size={12} />
                    {selectedTruck.assignedDistrict}
                  </span>
                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20 flex items-center gap-1">
                    <Activity size={12} />
                    متحرك حالياً
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">السائق</p>
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <User size={14} className="text-indigo-600" />
                      {selectedTruck.driverName}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">الجوال</p>
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <Phone size={14} className="text-indigo-600" />
                      {selectedTruck.driverPhone}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Package size={18} className="text-indigo-600" />
                    الشحنات المعينة ({getTruckShipments(selectedTruck.id).length})
                  </h4>
                  <div className="space-y-3">
                    {getTruckShipments(selectedTruck.id).length > 0 ? (
                      getTruckShipments(selectedTruck.id).map(shp => (
                        <div key={shp.id} className="p-4 border rounded-2xl hover:bg-slate-50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-slate-900">{shp.orderNumber}</span>
                            <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">
                              {shp.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700 mb-1 font-medium">{shp.customerName}</p>
                          <p className="text-xs text-slate-500 truncate">{shp.address}</p>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-slate-400 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <p>لا توجد شحنات معينة لهذه الشاحنة</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t">
                <button className="w-full bg-indigo-600 text-white py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                  فتح سجل التتبع التفصيلي
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-10 text-center space-y-4">
              <div className="bg-slate-50 p-6 rounded-full text-slate-300">
                <MapPin size={48} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">تتبع مباشر</h3>
                <p className="text-slate-500 mt-2">اختر أي شاحنة من الخريطة لمعرفة تفاصيل الرحلة والشحنات المحملة حالياً.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveMap;
