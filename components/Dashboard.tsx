import React, { useState, useEffect, useMemo } from 'react';
import { 
  Package, Truck as TruckIcon, CheckCircle2, Timer, TrendingUp, 
  Wallet, LocateFixed, Zap, ChevronRight, BarChart3, Activity,
  MapPin, ArrowUpRight, ShieldCheck, Box, Navigation, UserCheck, Clock,
  Users, Percent
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Stats, Shipment, Truck, ShipmentStatus } from '../types';
import AutoDispatchEngine from './AutoDispatchEngine';
import { JEDDAH_DISTRICTS } from '../constants';

interface DashboardProps {
  stats: Stats;
  pendingShipments: Shipment[];
  trucks: Truck[];
  onAutoAssign: (shipmentId: string, truckId: string) => void;
}

const StatCard: React.FC<{ label: string, value: string | number, trend: string, icon: React.ReactNode, color: 'indigo' | 'emerald' | 'amber' | 'slate' | 'rose', secondaryValue?: string }> = ({ label, value, trend, icon, color, secondaryValue }) => {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100'
  };

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-[4rem] -mr-12 -mt-12 opacity-50 ${colors[color].split(' ')[0]}`}></div>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${colors[color]}`}>
          {icon}
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg">
          <span className="text-[9px] font-black">{trend}</span>
          <ArrowUpRight size={10} />
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-baseline gap-1.5">
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{value}</h3>
          {secondaryValue && <span className="text-sm font-black text-indigo-600">{secondaryValue}</span>}
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ stats, pendingShipments, trucks, onAutoAssign }) => {
  const [liveLocation, setLiveLocation] = useState<Truck[]>(trucks);
  const [activeDistrictIndex, setActiveDistrictIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveLocation(prev => prev.map(t => ({
        ...t,
        location: {
          lat: t.location.lat + (Math.random() - 0.5) * 0.001,
          lng: t.location.lng + (Math.random() - 0.5) * 0.001,
        }
      })));
      setActiveDistrictIndex(prev => (prev + 1) % JEDDAH_DISTRICTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [trucks]);

  const activeTrucksCount = trucks.filter(t => t.status === 'Active').length;
  const totalTrucksCount = trucks.length;
  const activePercentage = totalTrucksCount > 0 
    ? Math.round((activeTrucksCount / totalTrucksCount) * 100) 
    : 0;

  const getMapPos = (loc: { lat: number, lng: number }) => {
    const minLat = 21.3, maxLat = 21.8;
    const minLng = 39.0, maxLng = 39.4;
    const x = ((loc.lng - minLng) / (maxLng - minLng)) * 100;
    const y = 100 - (((loc.lat - minLat) / (maxLat - minLat)) * 100);
    return { left: `${Math.max(5, Math.min(95, x))}%`, top: `${Math.max(5, Math.min(95, y))}%` };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard 
          label="إجمالي الشحنات" 
          value={stats.totalShipments} 
          trend="+12%" 
          icon={<Package size={20} />} 
          color="indigo" 
        />
        <StatCard 
          label="Delivery Agents Percentage" 
          value={`${activePercentage}%`} 
          secondaryValue={`(${activeTrucksCount})`}
          trend="Live" 
          icon={<Users size={20} />} 
          color="rose" 
        />
        <StatCard 
          label="تغطية الميدان" 
          value={activeTrucksCount} 
          trend="Active" 
          icon={<UserCheck size={20} />} 
          color="slate" 
        />
        <StatCard 
          label="تم التوصيل بنجاح" 
          value={stats.deliveredToday} 
          trend="+15%" 
          icon={<CheckCircle2 size={20} />} 
          color="emerald" 
        />
        <StatCard 
          label="إجمالي التحصيل" 
          value={`${stats.totalCodToCollect.toLocaleString()} ر.س`} 
          trend="COD" 
          icon={<Wallet size={20} />} 
          color="amber" 
        />
      </div>

      <AutoDispatchEngine pendingShipments={pendingShipments} trucks={trucks} onAutoAssign={onAutoAssign} />

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden min-h-[500px] flex flex-col lg:flex-row relative">
        <div className="flex-1 bg-slate-50 relative overflow-hidden min-h-[400px]">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#6366f1 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
          <div className="absolute top-8 right-8 z-20">
             <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-100 shadow-lg">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">تتبع الأسطول</p>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                   <Users size={14} className="text-slate-500" />
                   <span className="text-xs font-black text-slate-800">{activeTrucksCount} كابتن في الميدان ({activePercentage}%)</span>
                </div>
             </div>
          </div>

          {liveLocation.filter(t => t.status === 'Active').slice(0, 15).map((truck) => (
            <div key={truck.id} className="absolute transition-all duration-4000ms ease-linear" style={getMapPos(truck.location)}>
               <div className="relative group">
                  <div className="bg-slate-900 p-1.5 rounded-lg shadow-xl text-white">
                    <Users size={12} />
                  </div>
               </div>
            </div>
          ))}

          <div className="absolute top-1/4 left-1/4 text-slate-300 font-black text-xl opacity-20 pointer-events-none">حي الروضة</div>
          <div className="absolute bottom-1/3 right-1/4 text-slate-300 font-black text-xl opacity-20 pointer-events-none">حي الصفا</div>
          <div className="absolute top-2/3 left-1/2 text-slate-300 font-black text-xl opacity-20 pointer-events-none">أبحر</div>
        </div>

        <div className="w-full lg:w-[450px] bg-white border-r border-slate-50 flex flex-col items-center justify-center p-8 lg:p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          
          <div className="relative z-10 w-full">
            <div className="flex items-center justify-between w-full relative mb-16 px-4">
              <div className="flex flex-col items-center gap-4 group w-32">
                <div className="relative">
                  <div className="absolute -top-3 -right-3 bg-white shadow-xl rounded-xl p-1.5 z-20 animate-bounce">
                    <Clock size={16} className="text-indigo-600" />
                  </div>
                  <div className="w-20 h-20 lg:w-28 lg:h-28 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-100 transition-all group-hover:scale-105">
                    <MapPin size={40} />
                  </div>
                </div>
                <div className="bg-white px-4 py-2 rounded-2xl shadow-lg border border-slate-50 text-center w-full min-h-[50px] flex flex-col justify-center">
                  <p className="text-[11px] font-black text-slate-900 leading-tight">حي {JEDDAH_DISTRICTS[activeDistrictIndex]}</p>
                  <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-tighter">60 دقيقة</p>
                </div>
              </div>

              <div className="flex-1 px-2 relative h-1 mx-2">
                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-100 -translate-y-1/2 overflow-hidden">
                   <div className="h-full w-full bg-indigo-500/10 flex justify-around">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-1.5 h-full bg-indigo-400/20" />
                      ))}
                   </div>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.8)] z-10"
                     style={{ animation: 'moveRightDash 3s linear infinite' }} />
              </div>

              <div className="flex flex-col items-center gap-4 group w-32">
                <div className="w-20 h-20 lg:w-28 lg:h-28 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-slate-100 transition-all group-hover:scale-105">
                   <Users size={40} />
                </div>
                <div className="bg-white px-4 py-2 rounded-2xl shadow-lg border border-slate-50 text-center w-full">
                  <p className="text-[11px] font-black text-slate-900 leading-none mb-1">الكابتن الميداني</p>
                  <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">توصيل جاري</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl">
               <div className="flex items-center gap-4 mb-6">
                 <div className="bg-indigo-600 p-3 rounded-xl"><Activity size={20} /></div>
                 <h4 className="text-lg font-black tracking-tight">النشاط اللحظي</h4>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                     <span className="text-xs font-bold text-slate-400">الشحنات النشطة</span>
                     <span className="text-sm font-black text-indigo-400">{pendingShipments.length}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                     <span className="text-xs font-bold text-slate-400">أداء الأسطول</span>
                     <span className="text-sm font-black text-emerald-400">98.2%</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;