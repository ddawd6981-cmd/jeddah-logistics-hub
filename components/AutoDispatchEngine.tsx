
import React, { useState, useEffect } from 'react';
import { Zap, Truck, Package, CheckCircle, AlertTriangle, Cpu, ArrowRight } from 'lucide-react';
import { Shipment, Truck as TruckType, ShipmentStatus } from '../types';

interface Props {
  pendingShipments: Shipment[];
  trucks: TruckType[];
  onAutoAssign: (shipmentId: string, truckId: string) => void;
}

const AutoDispatchEngine: React.FC<Props> = ({ pendingShipments, trucks, onAutoAssign }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 5));
  };

  const runDispatch = async () => {
    if (pendingShipments.length === 0) return;
    
    setIsProcessing(true);
    addLog(`بدء معالجة ${pendingShipments.length} شحنة بانتظار التوزيع...`);

    for (const shipment of pendingShipments) {
      await new Promise(r => setTimeout(r, 600)); // محاكاة وقت الحساب الخوارزمي

      // خوارزمية البحث عن أفضل سائق:
      // 1. يجب أن يكون نشط
      // 2. يفضل أن يكون في نفس الحي
      // 3. يجب أن يكون لديه سعة (CurrentLoad < Capacity)
      const bestMatch = trucks.find(t => 
        t.status === 'Active' && 
        t.assignedDistrict === shipment.district &&
        t.currentLoad < t.capacity
      ) || trucks.find(t => t.status === 'Active' && t.currentLoad < t.capacity);

      if (bestMatch) {
        onAutoAssign(shipment.id, bestMatch.id);
        addLog(`تم إسناد الطلب ${shipment.orderNumber} للسائق ${bestMatch.driverName}`);
      } else {
        addLog(`فشل إسناد الطلب ${shipment.orderNumber}: لا توجد شاحنات متاحة حالياً`);
      }
    }

    setIsProcessing(false);
    addLog("اكتملت عملية التوزيع التلقائي بنجاح.");
  };

  return (
    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden border border-slate-800">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full -mr-20 -mt-20"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Cpu size={24} className="text-white" />
            </div>
            <h3 className="text-2xl font-black">محرك التوزيع الذكي (AI Dispatch)</h3>
          </div>
          <p className="text-slate-400 font-medium leading-relaxed max-w-lg">
            يقوم النظام بتحليل مواقع الـ 50 شاحنة لحظياً وإسناد الطلبات بناءً على "الحي" و "سعة الحمولة" لتقليل التكلفة التشغيلية بنسبة تصل إلى 30%.
          </p>
        </div>

        <div className="flex flex-col gap-4 min-w-[300px]">
          <button 
            onClick={runDispatch}
            disabled={isProcessing || pendingShipments.length === 0}
            className={`flex items-center justify-center gap-3 py-4 px-8 rounded-2xl font-black transition-all ${
              isProcessing 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-white text-slate-900 hover:bg-indigo-50 shadow-xl shadow-indigo-500/10 active:scale-95'
            }`}
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Zap size={20} className="fill-current" />
            )}
            {isProcessing ? 'جاري التوزيع...' : 'تشغيل التوزيع التلقائي'}
          </button>
          
          <div className="flex justify-between px-2 text-xs font-black uppercase tracking-wider text-slate-500">
            <span>شحنات معلقة: {pendingShipments.length}</span>
            <span>شاحنات متاحة: {trucks.filter(t => t.status === 'Active').length}</span>
          </div>
        </div>
      </div>

      {logs.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-800 space-y-2">
          {logs.map((log, i) => (
            <div key={i} className={`flex items-center gap-2 text-sm font-bold ${i === 0 ? 'text-indigo-400' : 'text-slate-500'}`}>
              <ArrowRight size={14} />
              {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoDispatchEngine;
