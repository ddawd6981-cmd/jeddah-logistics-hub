
import React from 'react';
import { 
  Package, 
  Truck as TruckIcon, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  MapPin,
  Zap,
  Timer,
  ChevronRight,
  Info,
  Users,
  LayoutDashboard
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

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">مركز العمليات - جدة</h2>
          <p className="text-slate-500 mt-2 font-medium">مراقبة لحظية وتوزيع آلي للطلبات (AI Dispatch)</p>
        </div>
        <div className="flex gap-3">
           <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
             <div className="bg-emerald-100 p-2 rounded-lg">
                <Timer size={18} className="text-emerald-600" />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase text-right">متوسط وقت التوصيل</p>
                <p className="text-sm font-black text-slate-900">{stats.avgDeliveryTime}</p>
             </div>
           </div>
        </div>
      </div>

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
                <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4 flex-1 min-w-[200px] border border-slate-100">
                   <div className="bg-white p-2 rounded-xl shadow-sm"><Package className="text-emerald-600" size={20} /></div>
                   <span className="text-sm font-black text-slate-700">أنشئ أول شحنة لك</span>
                </div>
             </div>
          </div>
          <div className="bg-slate-900 p-10 rounded-[3rem] relative overflow-hidden border border-slate-800">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full -mr-20 -mt-20"></div>
             <div className="relative z-10 h-full flex flex-col justify-center">
                <h4 className="text-2xl font-black text-white mb-4">التوزيع الذكي متوقف حالياً</h4>
                <p className="text-slate-400 font-medium mb-8">سيعمل محرك الـ AI تلقائياً فور توفر شحنات معلقة ومناديب متصلين في الميدان.</p>
                <div className="grid grid-cols-2 gap-4 opacity-50">
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                      <p className="text-[10px] text-slate-500 font-black uppercase">بانتظار التوزيع</p>
                      <p className="text-2xl font-black text-white">0</p>
                   </div>
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                      <p className="text-[10px] text-slate-500 font-black uppercase">المناديب النشطين</p>
                      <p className="text-2xl font-black text-white">0</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

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
              { label: 'تم التوصيل اليوم', value: stats.deliveredToday, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'بانتظار التوزيع', value: stats.pendingAssignment, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'شاحنات نشطة', value: stats.activeTrucks, icon: TruckIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' }
            ].map((card, i) => (
              <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                 <div className="flex justify-between items-start mb-6">
                    <div className={`${card.bg} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                       <card.icon size={28} className={card.color} />
                    </div>
                    <TrendingUp className="text-emerald-500" size={20} />
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
                 <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{card.value}</h3>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-900">معدل التوصيل الساعي</h3>
              <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-black outline-none">
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
              <Zap size={20} className="text-indigo-600" />
           </div>
           <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-1">إجمالي المبالغ بانتظار التحصيل</p>
                 <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{stats.totalCodToCollect} <small className="text-xs font-bold text-slate-400">ر.س</small></h4>
              </div>
              <div className="space-y-3">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">توزيع المناطق (جدة)</p>
                 {['شمال جدة', 'وسط جدة', 'جنوب جدة'].map(area => (
                   <div key={area} className="flex justify-between items-center p-4 rounded-2xl hover:bg-slate-50 transition-colors">
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
    </div>
  );
};

export default Dashboard;
