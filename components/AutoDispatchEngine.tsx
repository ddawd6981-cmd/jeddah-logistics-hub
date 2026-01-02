
import React, { useState } from 'react';
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

  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 5));

  const runDispatch = async () => {
    // Audit Check: Ensure there are active drivers and pending shipments
    const activeDrivers = trucks.filter(t => t.status === 'Active' && t.role === 'DRIVER');
    
    if (pendingShipments.length === 0) {
      addLog("لا توجد شحنات بانتظار التوزيع.");
      return;
    }

    if (activeDrivers.length === 0) {
      addLog("خطأ: لا يوجد مناديب نشطين حالياً في النظام.");
      alert("يرجى إضافة أو تفعيل مندوب واحد على الأقل قبل البدء بالتوزيع الذكي.");
      return;
    }
    
    setIsProcessing(true);
    addLog(`تحليل ${pendingShipments.length} شحنة مقابل ${activeDrivers.length} مندوب...`);

    for (const shipment of pendingShipments) {
      await new Promise(r => setTimeout(r, 800)); // محاكاة الحساب اللوجستي

      // Intelligent Filtering: 
      // Priority 1: District match + capacity
      // Priority 2: Any active driver with capacity
      let bestMatch = activeDrivers.find(t => 
        t.assignedDistrict === shipment.district && t.currentLoad < t.capacity
      );

      if (!bestMatch) {
        bestMatch = activeDrivers.find(t => t.currentLoad < t.capacity);
      }

      if (bestMatch) {
        // Critical: Strict verification using state ID
        onAutoAssign(shipment.id, bestMatch.id);
        addLog(`تم إسناد الطلب ${shipment.orderNumber} لـ ${bestMatch.driverName}`);
      } else {
        addLog(`تنبيه: لا توجد سعة كافية لدى المناديب لطلب ${shipment.orderNumber}`);
      }
    }

    setIsProcessing(false);
    addLog("اكتملت دورة التوزيع الذكي.");
  };

  return (
    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden border border-slate-800">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full -mr-20 -mt-20"></div>
      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-600 p-2 rounded-lg text-white"><Cpu size={24} /></div>
            <h3 className="text-2xl font-black">محرك التوزيع الذكي (AI Dispatch)</h3>
          </div>
          <p className="text-slate-400 font-medium leading-relaxed max-w-lg">يقوم النظام بربط الشحنات المعلقة بأقرب مندوب متاح حسب الحي والسعة الحالية لضمان أسرع وقت توصيل.</p>
        </div>
        <div className="flex flex-col gap-4 min-w-[300px]">
          <button 
            onClick={runDispatch}
            disabled={isProcessing || pendingShipments.length === 0}
            className={`flex items-center justify-center gap-3 py-4 px-8 rounded-2xl font-black transition-all ${
              isProcessing ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-white text-slate-900 hover:bg-indigo-50 shadow-xl'
            }`}
          >
            {isProcessing ? <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div> : <Zap size={20} className="fill-current" />}
            {isProcessing ? 'جاري التوزيع...' : 'تشغيل التوزيع التلقائي'}
          </button>
          <div className="flex justify-between px-2 text-[10px] font-black text-slate-500 uppercase">
            <span>شحنات معلقة: {pendingShipments.length}</span>
            <span>مناديب متاحين: {trucks.filter(t => t.status === 'Active').length}</span>
          </div>
        </div>
      </div>
      {logs.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-800 space-y-2">
          {logs.map((log, i) => (
            <div key={i} className={`flex items-center gap-2 text-sm font-bold ${i === 0 ? 'text-indigo-400' : 'text-slate-500'}`}>
              <ArrowRight size={14} /> {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoDispatchEngine;
