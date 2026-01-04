import React, { useState } from 'react';
import { 
  Link as LinkIcon, Check, Copy, ExternalLink, Zap, 
  Smartphone, Globe, RefreshCcw, Bell, Database,
  PlusCircle, PlayCircle, Loader2, Activity
} from 'lucide-react';

const IntegrationsManager: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  const simulateOrder = () => {
    setIsSimulating(true);
    const orderId = `SA-${Math.floor(Math.random() * 900000 + 100000)}`;
    
    // محاكاة عملية الاستقبال والربط
    setTimeout(() => {
      setLogs(prev => [{
        id: Date.now(),
        type: 'WEBHOOK_RECEIVED',
        source: 'Salla',
        msg: `تم استقبال طلب جديد #${orderId}`,
        time: new Date().toLocaleTimeString()
      }, ...prev]);
    }, 1000);

    setTimeout(() => {
      setLogs(prev => [{
        id: Date.now() + 1,
        type: 'DATA_PARSED',
        source: 'AI Parser',
        msg: `تم تحليل العنوان (حي الصفا) بنجاح لطلب #${orderId}`,
        time: new Date().toLocaleTimeString()
      }, ...prev]);
    }, 2500);

    setTimeout(() => {
      setLogs(prev => [{
        id: Date.now() + 2,
        type: 'AUTO_DISPATCHED',
        source: 'Engine',
        msg: `تم ربط الطلب #${orderId} بالمندوب "فهد العتيبي"`,
        time: new Date().toLocaleTimeString()
      }, ...prev]);
      setIsSimulating(false);
    }, 4000);
  };

  return (
    <div className="max-w-5xl space-y-10 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">الربط البرمجي والأتمتة</h2>
          <p className="text-slate-500 mt-2 font-medium">استقبل شحناتك من المتاجر الإلكترونية تلقائياً عبر نظام Webhooks الذكي.</p>
        </div>
        <button 
          onClick={simulateOrder}
          disabled={isSimulating}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-3 shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {isSimulating ? <Loader2 className="animate-spin" size={20} /> : <PlayCircle size={20} />}
          محاكاة استقبال طلب (سلة)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* منصات الربط */}
        <div className="lg:col-span-2 space-y-6">
          <IntegrationCard 
            name="منصة سلة (Salla)" 
            desc="الربط الرسمي لاستقبال الطلبات فور تغيير حالتها"
            icon={<img src="https://salla.sa/favicon.ico" className="w-6 h-6" alt="Salla" />}
            status="Active"
            webhook="https://api.jeddah-logistics.com/webhook/salla/v1/..."
          />
          <IntegrationCard 
            name="منصة زد (Zid)" 
            desc="ربط متكامل يشمل تحديث حالة الشحنة في لوحة زد"
            icon={<img src="https://zid.sa/favicon.ico" className="w-6 h-6" alt="Zid" />}
            status="Pending"
            webhook="https://api.jeddah-logistics.com/webhook/zid/v1/..."
          />
        </div>

        {/* سجل العمليات المباشر */}
        <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col h-[600px]">
           <div className="flex items-center gap-3 mb-8">
              {/* Fix: Added Activity icon which was previously missing from imports */}
              <div className="bg-white/10 p-2 rounded-lg text-indigo-400"><Activity size={20} /></div>
              <h3 className="text-lg font-black tracking-tight">سجل الاستقبال المباشر</h3>
           </div>
           
           <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
              {logs.length > 0 ? logs.map(log => (
                <div key={log.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl animate-in slide-in-from-right duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{log.type}</span>
                    <span className="text-[9px] text-slate-500">{log.time}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-300">{log.msg}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <span className="text-[9px] font-black text-slate-500">{log.source}</span>
                  </div>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                  <Database size={48} />
                  <p className="text-sm font-bold">في انتظار استقبال بيانات من المتاجر...</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

const IntegrationCard: React.FC<{ name: string, desc: string, icon: React.ReactNode, status: 'Active' | 'Pending', webhook: string }> = ({ name, desc, icon, status, webhook }) => {
  return (
    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-5">
          <div className="bg-slate-50 p-4 rounded-[1.5rem] group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">{name}</h3>
            <p className="text-xs font-medium text-slate-500 mt-1">{desc}</p>
          </div>
        </div>
        <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
          {status === 'Active' ? 'متصل' : 'بانتظار الإعداد'}
        </span>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">رابط استقبال البيانات (Webhook URL)</label>
        <div className="flex gap-2">
          <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-[11px] font-mono text-slate-500 truncate">
            {webhook}
          </div>
          <button className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-black transition-colors">
            <Copy size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsManager;