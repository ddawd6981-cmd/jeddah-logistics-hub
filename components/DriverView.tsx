
import React, { useState, useRef } from 'react';
import { 
  Package, MapPin, CheckCircle2, AlertTriangle, Truck, 
  X, User, RotateCcw, ClipboardCheck, History,
  Camera, Lock, Save, Phone, CheckCircle, Navigation,
  ShieldAlert, DollarSign, Wallet
} from 'lucide-react';
import { Shipment, Truck as TruckType, ShipmentStatus, DeliveryDetails } from '../types';

interface Props {
  shipments: Shipment[];
  trucks: TruckType[];
  currentUser: TruckType | null;
  onUpdateStatus: (id: string, status: ShipmentStatus, details?: DeliveryDetails) => void;
}

const DriverView: React.FC<Props> = ({ shipments, trucks, currentUser, onUpdateStatus }) => {
  // Use the actual logged-in user instead of a mock
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [showPodModal, setShowPodModal] = useState(false);
  const [showFailedModal, setShowFailedModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'tasks' | 'completed'>('tasks');
  
  // POD State
  const [signature, setSignature] = useState<string | null>(null);
  const [podImage, setPodImage] = useState<string | null>(null);
  const [cashCollected, setCashCollected] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  if (!currentUser) return null;

  const driverShipments = shipments.filter(s => s.assignedTruckId === currentUser.id);
  const pendingTasks = driverShipments.filter(s => ![ShipmentStatus.DELIVERED, ShipmentStatus.CANCELLED, ShipmentStatus.RETURNED].includes(s.status));
  const completedTasks = driverShipments.filter(s => s.status === ShipmentStatus.DELIVERED);

  if (currentUser.status === 'Suspended') {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center p-10 bg-white rounded-[3rem] shadow-xl border border-rose-100 animate-in zoom-in duration-300">
        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-6 border-4 border-rose-100">
          <ShieldAlert size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4">حسابك موقوف</h2>
        <p className="text-slate-500 max-w-md font-bold">يرجى مراجعة إدارة العمليات في جدة لتنشيط حسابك أو سداد العهدة المالية.</p>
      </div>
    );
  }

  const startDrawing = (e: any) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: any) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleCompleteDelivery = () => {
    if (!selectedShipment) return;
    onUpdateStatus(selectedShipment.id, ShipmentStatus.DELIVERED, {
      podImage: podImage || 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?q=80&w=400',
      signature: signature || '',
      completedAt: new Date().toISOString(),
      contactAttempts: selectedShipment.deliveryDetails?.contactAttempts || [],
      cashCollected: selectedShipment.paymentMethod === 'COD' ? (parseFloat(cashCollected) || selectedShipment.codAmount) : 0
    });
    setShowPodModal(false);
    setSelectedShipment(null);
    setPodImage(null);
    setSignature(null);
    setCashCollected('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 font-['Cairo'] animate-in fade-in duration-500">
      <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/10 border-2 border-white/20 overflow-hidden shadow-xl">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`} className="w-full h-full object-cover" alt="Driver" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">{currentUser.driverName}</h2>
                <p className="text-indigo-400 text-xs font-black uppercase tracking-widest mt-1">اللوحة: {currentUser.plateNumber}</p>
              </div>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-4 rounded-3xl text-center">
               <p className="text-[10px] text-emerald-500 font-black uppercase mb-1 tracking-widest">التحصيل الكلي</p>
               <p className="text-2xl font-black text-emerald-400">{currentUser.totalCodCollected.toLocaleString()} <small className="text-[10px] font-bold">ر.س</small></p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white/5 p-5 rounded-[2rem] border border-white/5">
                <p className="text-[10px] text-slate-500 font-black uppercase mb-2">قيد التوصيل</p>
                <p className="text-4xl font-black tracking-tighter">{pendingTasks.length}</p>
             </div>
             <div className="bg-white/5 p-5 rounded-[2rem] border border-white/5">
                <p className="text-[10px] text-slate-500 font-black uppercase mb-2">تم تسليمه</p>
                <p className="text-4xl font-black text-emerald-400 tracking-tighter">{completedTasks.length}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="flex bg-white p-2 rounded-3xl border border-slate-100 shadow-sm gap-2">
        <button onClick={() => setActiveTab('tasks')} className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all ${activeTab === 'tasks' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}>
          المهام الجارية ({pendingTasks.length})
        </button>
        <button onClick={() => setActiveTab('completed')} className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all ${activeTab === 'completed' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}>
          سجل التسليم ({completedTasks.length})
        </button>
      </div>

      <div className="space-y-4">
        {(activeTab === 'tasks' ? pendingTasks : completedTasks).map(shp => (
          <div key={shp.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden group hover:border-indigo-100 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-xl font-black text-slate-900 tracking-tight">{shp.orderNumber}</h4>
                <div className="flex items-center gap-2 mt-2">
                   {shp.paymentMethod === 'COD' && (
                     <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-xl text-[10px] font-black border border-emerald-100">
                        <DollarSign size={10} />
                        تحصيل: {shp.codAmount} ر.س
                     </div>
                   )}
                   {shp.paymentMethod === 'Prepaid' && (
                     <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-xl text-[10px] font-black border border-indigo-100">
                        <CheckCircle size={10} />
                        مدفوع مسبقاً
                     </div>
                   )}
                </div>
              </div>
              <span className={`px-4 py-2 rounded-full text-[10px] font-black border uppercase ${
                shp.status === ShipmentStatus.DELIVERED ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
              }`}>
                {shp.status}
              </span>
            </div>

            <div className="space-y-4 mb-8">
               <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 rounded-2xl text-slate-400"><User size={20} /></div>
                  <div>
                    <p className="text-sm font-black text-slate-900">{shp.customerName}</p>
                    <p className="text-indigo-600 text-xs font-bold tracking-widest">{shp.phone}</p>
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 rounded-2xl text-slate-400"><MapPin size={20} /></div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{shp.district}</p>
                    <p className="text-sm font-bold text-slate-700 leading-relaxed">{shp.address}</p>
                  </div>
               </div>
            </div>

            {activeTab === 'tasks' && (
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                <button onClick={() => { setSelectedShipment(shp); setShowPodModal(true); }} className="flex items-center justify-center gap-3 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-sm hover:bg-black transition-all active:scale-[0.98] shadow-lg shadow-slate-200">
                  <CheckCircle2 size={20} />
                  إثبات التوصيل
                </button>
                <button onClick={() => { setSelectedShipment(shp); setShowFailedModal(true); }} className="flex items-center justify-center gap-3 py-5 bg-slate-100 text-slate-600 rounded-[1.5rem] font-black text-sm hover:bg-slate-200 transition-all active:scale-[0.98]">
                  <AlertTriangle size={20} />
                  تعذر التسليم
                </button>
              </div>
            )}
          </div>
        ))}
        
        {(activeTab === 'tasks' ? pendingTasks : completedTasks).length === 0 && (
          <div className="py-20 text-center bg-white rounded-[3rem] border border-slate-100">
             <div className="bg-slate-50 w-20 h-20 rounded-full mx-auto flex items-center justify-center text-slate-300 mb-6">
               <Package size={40} />
             </div>
             <p className="text-slate-400 font-black">لا توجد مهام في هذه القائمة حالياً</p>
          </div>
        )}
      </div>

      {/* MODAL: Proof of Delivery */}
      {showPodModal && selectedShipment && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowPodModal(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl p-10 animate-in slide-in-from-bottom duration-300 overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-4">
               <div className="bg-indigo-600 p-3 rounded-2xl text-white"><ClipboardCheck size={24} /></div>
               إثبات توصيل الشحنة
            </h3>

            <div className="space-y-8">
              {selectedShipment.paymentMethod === 'COD' && (
                <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100">
                   <div className="flex items-center gap-2 mb-4">
                      <Wallet size={16} className="text-emerald-600" />
                      <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">تأكيد المبلغ المحصل</p>
                   </div>
                   <div className="relative">
                      <input 
                        type="number" 
                        placeholder="أدخل المبلغ" 
                        className="w-full bg-white border-2 border-emerald-200 rounded-2xl py-5 px-6 font-black text-2xl text-emerald-900 outline-none focus:border-emerald-500 transition-all"
                        value={cashCollected || selectedShipment.codAmount}
                        onChange={(e) => setCashCollected(e.target.value)}
                      />
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-emerald-400">ر.س</span>
                   </div>
                   <p className="text-[10px] text-emerald-500 font-bold mt-4 text-center">المبلغ المسجل في الفاتورة: {selectedShipment.codAmount} ر.س</p>
                </div>
              )}

              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block px-2">توثيق صورة الطرد</label>
                <button 
                  onClick={() => setPodImage('captured')}
                  className={`w-full aspect-video rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center transition-all group ${podImage ? 'bg-emerald-50 border-emerald-500' : 'bg-slate-50 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30'}`}
                >
                   {podImage ? <div className="bg-emerald-500 p-4 rounded-full text-white shadow-xl shadow-emerald-200"><CheckCircle size={40} /></div> : <Camera size={40} className="text-slate-300 group-hover:scale-110 transition-transform" />}
                   <p className={`text-xs font-black mt-4 ${podImage ? 'text-emerald-600' : 'text-slate-400'}`}>
                     {podImage ? 'تم التقاط الصورة بنجاح' : 'اضغط لفتح الكاميرا والتقاط الصورة'}
                   </p>
                </button>
              </div>

              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block px-2">توقيع المستلم</label>
                <div className="bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] overflow-hidden relative">
                  <canvas 
                    ref={canvasRef} width={500} height={200}
                    className="w-full h-[180px] cursor-crosshair touch-none"
                    onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={() => { isDrawing.current = false; setSignature(canvasRef.current?.toDataURL() || null); }}
                    onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={() => { isDrawing.current = false; setSignature(canvasRef.current?.toDataURL() || null); }}
                  />
                  {!signature && <p className="absolute inset-0 flex items-center justify-center text-slate-300 font-bold pointer-events-none italic opacity-50">وقع هنا لإتمام العملية</p>}
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleCompleteDelivery}
                  className="w-full bg-slate-900 text-white py-6 rounded-[1.5rem] font-black text-xl shadow-2xl shadow-slate-200 hover:bg-black transition-all flex items-center justify-center gap-4 active:scale-[0.98]"
                >
                  <Save size={26} />
                  تأكيد وإغلاق الطلب
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverView;
