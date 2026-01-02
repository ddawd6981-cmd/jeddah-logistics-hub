
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, Legend
} from 'recharts';
import { 
  Award, ArrowUpRight, ArrowDownRight, Download, 
  Timer, Zap, Package, Wallet, Target, TrendingUp, BarChart3
} from 'lucide-react';
import { Truck, Shipment, ShipmentStatus } from '../types';

interface Props {
  trucks: Truck[];
  shipments: Shipment[];
}

const Analytics: React.FC<Props> = ({ trucks, shipments }) => {
  const driverPerformance = useMemo(() => {
    return trucks.map(truck => {
      const truckShipments = shipments.filter(s => s.assignedTruckId === truck.id);
      const delivered = truckShipments.filter(s => s.status === ShipmentStatus.DELIVERED).length;
      const total = truckShipments.length;
      const successRate = total > 0 ? (delivered / total) * 100 : 0;
      
      return {
        name: truck.driverName,
        productivity: delivered,
        speed: truck.efficiencyScore,
        successRate: parseFloat(successRate.toFixed(1)),
        district: truck.assignedDistrict,
        cod: truck.totalCodCollected
      };
    }).sort((a, b) => b.productivity - a.productivity);
  }, [trucks, shipments]);

  const exportPerformance = () => {
    const headers = ['المندوب', 'الحي', 'التسليمات', 'نسبة النجاح', 'المبالغ المحصلة'];
    const rows = driverPerformance.map(d => [d.name, d.district, d.productivity, `${d.successRate}%`, d.cod]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `أداء_المناديب_${new Date().toLocaleDateString()}.csv`;
    link.click();
  };

  const statusDistribution = [
    { name: 'تم التسليم', value: shipments.filter(s => s.status === ShipmentStatus.DELIVERED).length, color: '#10b981' },
    { name: 'قيد التوصيل', value: shipments.filter(s => s.status === ShipmentStatus.OUT_FOR_DELIVERY).length, color: '#6366f1' },
    { name: 'معلق', value: shipments.filter(s => s.status === ShipmentStatus.PENDING).length, color: '#f59e0b' },
    { name: 'مرتجع/ملغي', value: shipments.filter(s => [ShipmentStatus.FAILED, ShipmentStatus.CANCELLED].includes(s.status)).length, color: '#ef4444' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">تحليلات الأداء والنمو</h2>
          <p className="text-slate-500 mt-2 font-medium">رؤية كاملة لسير العمل والتدفقات المالية في جدة</p>
        </div>
        <button 
          onClick={exportPerformance}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-3 shadow-2xl shadow-slate-900/10 hover:bg-black transition-all active:scale-95"
        >
          <Download size={20} />
          تصدير تقارير الأداء
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'إجمالي التحصيل المالي', value: trucks.reduce((a, t) => a + t.totalCodCollected, 0).toLocaleString(), unit: 'ر.س', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'كفاءة الأسطول العام', value: '94.8', unit: '%', icon: Zap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'دقة التوصيل المخطط', value: '98.2', unit: '%', icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'نمو الطلبات الشهرية', value: '22', unit: '%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((card, i) => (
          <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
             <div className="flex justify-between items-start mb-6">
                <div className={`${card.bg} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                   <card.icon size={28} className={card.color} />
                </div>
                <ArrowUpRight className="text-emerald-500" />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
             <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
               {card.value} <small className="text-sm text-slate-400 font-bold">{card.unit}</small>
             </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                 <div className="bg-indigo-600 p-2 rounded-xl text-white"><BarChart3 size={20}/></div>
                 أكثر 10 مناديب إنتاجية
              </h3>
           </div>
           <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={driverPerformance.slice(0, 10)} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12, fontWeight: 800}}
                    width={100}
                  />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="productivity" name="إجمالي التسليمات" radius={[0, 8, 8, 0]} barSize={25}>
                    {driverPerformance.slice(0, 10).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index < 3 ? '#6366f1' : '#cbd5e1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
           <h3 className="text-2xl font-black text-slate-900 mb-8">حالات الشحنات</h3>
           <div className="h-[250px] w-full relative mb-10">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-4xl font-black text-slate-900">{shipments.length}</span>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">إجمالي الطلبات</span>
              </div>
           </div>
           <div className="space-y-4">
              {statusDistribution.map((item, i) => (
                <div key={i} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                    <span className="text-sm font-black text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-black text-slate-900">{item.value}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
      
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
         <div className="p-10 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
               <Award className="text-amber-500" size={32} />
               ترتيب المناديب المتميزين
            </h3>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-right">
               <thead>
                  <tr className="bg-slate-50/50">
                     <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">المندوب</th>
                     <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">المنطقة</th>
                     <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">التسليمات</th>
                     <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">المبالغ</th>
                     <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">الكفاءة</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {driverPerformance.map((driver, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                       <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${i === 0 ? 'bg-amber-400 text-white shadow-lg shadow-amber-400/30' : i === 1 ? 'bg-slate-300 text-white' : i === 2 ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                {i + 1}
                             </div>
                             <span className="font-black text-slate-900">{driver.name}</span>
                          </div>
                       </td>
                       <td className="px-10 py-6 text-sm font-bold text-slate-500">{driver.district}</td>
                       <td className="px-10 py-6 font-black text-slate-900">{driver.productivity}</td>
                       <td className="px-10 py-6 font-black text-emerald-600">{driver.cod.toLocaleString()} ر.س</td>
                       <td className="px-10 py-6">
                          <div className="flex items-center gap-3">
                             <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500" style={{width: `${driver.speed}%`}}></div>
                             </div>
                             <span className="text-xs font-black text-slate-900">{driver.speed}%</span>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default Analytics;
