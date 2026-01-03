import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck as TruckIcon, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  MapPin,
  Zap,
  Timer,
  Users,
  LayoutDashboard,
  Activity,
  ArrowUpRight,
  DollarSign,
  Radar,
  Navigation,
  Box as BoxIcon,
  ChevronRight,
  Plus
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { Stats, Shipment, Truck } from '../types';
import AutoDispatchEngine from './AutoDispatchEngine';
import { JEDDAH_DISTRICTS } from '../constants';

interface DashboardProps {
  stats: Stats;
  pendingShipments: Shipment[];
  trucks: Truck[];
  onAutoAssign: (shipmentId: string, truckId: string) => void;
}

const emptyChartData = [
  { name: '08:00', value: 0 },
  { name: '10:00', value: 0 },
  { name: '12:00', value: 0 },
  { name: '14:00', value: 0 },
  { name: '16:00', value: 0 },
  { name: '18:00', value: 0 },
  { name: '20:00', value: 0 },
];

const Dashboard: React.FC<DashboardProps> = ({ stats, pendingShipments, trucks, onAutoAssign }) => {
  const hasData = stats.totalShipments > 0 || trucks.length > 0;
  const [districtIndex, setDistrictIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setDistrictIndex((prev) => (prev + 1) % JEDDAH_DISTRICTS.length);
        setFade(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header & Live Mission Control Visual */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-stretch gap-8">
        <div className="flex flex-col justify-center max-w-xl">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-3 h-12 bg-indigo-600 rounded-full"></div>
             <h2 className="text-5xl font-black text-slate-900 tracking-tight">نبض العمليات</h2>
          </div>
          <p className="text-slate-500 font-bold text-lg mr-7 leading-relaxed">
            متابعة حية لتحركات المناديب وتوزيع الطلبات الذكي عبر أحياء مدينة جدة لحظة بلحظة.
          </p>
          
          <div className="mt-8 grid grid-cols-2 gap-4 mr-7">
             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
                   <CheckCircle2 size={24} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase">تم التوصيل</p>
                   <p className="text-2xl font-black text-slate-900">{stats.deliveredToday}</p>
                </div>
             </div>
             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
                   <TruckIcon size={24} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase">المناديب</p>
                   <p className="text-2xl font-black text-slate-900">{stats.activeTrucks}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Live Visual Control (As requested in the image) */}
        <div className="bg-[#F8FAFF] w-full xl:w-[750px] rounded-[4rem] p-12 border border-indigo-50 shadow-2xl shadow-indigo-100/30 relative overflow-hidden group flex flex-col items-center justify-center min-h-[400px]">
           {/* Background Grid Mesh */}
           <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
           
           <div className="relative w-full flex items-center justify-around z-10">
              {/* District Node */}
              <div className="flex flex-col items-center gap-8 group/node">
                 <div className="w-32 h-32 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-600/40 relative transform transition-transform group-hover/node:scale-110">
                    <MapPin size={56} />
                    <div className="absolute -top-4 -right-4 bg-white p-3 rounded-2xl shadow-xl animate-bounce">
                       <Timer size={24} className="text-indigo-600" />
                    </div>
                 </div>
                 <div className={`bg-white px-8 py-4 rounded-3xl shadow-xl border border-slate-50 text-center transition-all duration-500 ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <p className="text-sm font-black text-slate-900">حي {JEDDAH_DISTRICTS[districtIndex]}</p>
                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">توصيل 60 دقيقة</p>
                 </div>
              </div>

              {/* Animated Connection */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35%] h-1 pointer-events-none">
                <svg width="100%" height="20" viewBox="0 0 100 20" fill="none" preserveAspectRatio="none">
                  <path d="M0 10 H100" stroke="#6366f1" strokeWidth="2" strokeDasharray="8 8">
                    <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1s" repeatCount="indefinite" />
                  </path>
                  <circle cx="50" cy="10" r="4" fill="#6366f1">
                    <animate attributeName="cx" from="0" to="100" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
                  </circle>
                </svg>
              </div>

              {/* Captain/Truck Node */}
              <div className="flex flex-col items-center gap-8 group/truck">
                 <div className="w-32 h-32 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-slate-900/40 transform transition-transform group-hover/truck:scale-110">
                    <TruckIcon size={56} className="group-hover/truck:translate-x-1 transition-transform" />
                 </div>
                 <div className="bg-white px-8 py-4 rounded-3xl shadow-xl border border-slate-50 text-center">
                    <p className="text-sm font-black text-slate-900">الكابتن</p>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">متاح للإرسال الذكي</p>
                 </div>
              </div>
           </div>

           {/* Pulse Status Badge */}
           <div className="absolute bottom-8 flex items-center gap-3 bg-white/80 backdrop-blur-md px-6 py-2.5 rounded-full border border-indigo-100 shadow-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">تحديث مباشر لخريطة جدة</span>
           </div>
        </div>
      </div>

      {hasData && (
        <>
          <AutoDispatchEngine 
            pendingShipments={pendingShipments} 
            trucks={trucks} 
            onAutoAssign={onAutoAssign} 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'إجمالي الشحنات', value: stats.totalShipments, icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { label: 'بانتظار التوزيع', value: stats.pendingAssignment, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'وقت التوصيل (م)', value: stats.avgDeliveryTime, icon: Timer, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'إنجاز اليوم', value: stats.totalShipments > 0 ? Math.round((stats.deliveredToday / stats.totalShipments) * 100) + '%' : '0%', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' }
            ].map((card, i) => (
              <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                 <div className="flex justify-between items-start mb-6">
                    <div className={`${card.bg} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                       <card.icon size={28} className={card.color} />
                    </div>
                    <ArrowUpRight className="text-emerald-500" size={20} />
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
                 <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{card.value}</h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-black text-slate-900">معدل التوصيل الساعي</h3>
                  <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-black outline-none cursor-pointer">
                     <option>اليوم</option>
                     <option>أمس</option>
                  </select>
               </div>
               <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={emptyChartData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                      />
                      <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-slate-900">التحصيل النقدي</h3>
                  <DollarSign size={20} className="text-emerald-600" />
               </div>
               <div className="space-y-6">
                  <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-24 h-24 bg-emerald-500/10 blur-3xl rounded-full"></div>
                     <p className="text-[10px] font-black text-slate-400 uppercase mb-2">إجمالي بانتظار التحصيل</p>
                     <h4 className="text-4xl font-black text-white tracking-tighter">{stats.totalCodToCollect.toLocaleString()} <small className="text-xs font-bold text-slate-400">ر.س</small></h4>
                  </div>
                  <div className="space-y-3">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">توزيع المناطق</p>
                     {['شمال جدة', 'وسط جدة', 'جنوب جدة'].map(area => (
                       <div key={area} className="flex justify-between items-center p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                            <span className="text-sm font-black text-slate-700">{area}</span>
                          </div>
                          <span className="text-sm font-black text-slate-400">0 ر.س</span>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        </>
      )}

      {!hasData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-center">
             <div className="bg-indigo-600 w-16 h-16 rounded-3xl flex items-center justify-center text-white mb-8 shadow-lg shadow-indigo-200">
                <LayoutDashboard size={32} />
             </div>
             <h3 className="text-3xl font-black text-slate-900 mb-4">أهلاً بك في نظامك الجديد!</h3>
             <p className="text-slate-500 font-bold text-lg mb-8 leading-relaxed">
                النظام الآن فارغ وجاهز لاستقبال بياناتك. يمكنك البدء بإضافة مناديب التوصيل ثم استقبال الشحنات عبر الويب هوك أو الإضافة اليدوية.
             </p>
             <div className="flex flex-wrap gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4 flex-1 min-w-[200px] border border-slate-100">
                   <div className="bg-white p-2 rounded-xl shadow-sm"><Users className="text-indigo-600" size={20} /></div>
                   <span className="text-sm font-black text-slate-700">ابدأ بإضافة مناديبك</span>
                </div>
                <div className="bg-white p-4 rounded-2xl flex items-center gap-4 flex-1 min-w-[200px] border border-indigo-600 text-indigo-600">
                   <Plus size={20} />
                   <span className="text-sm font-black">أنشئ أول شحنة لك</span>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;