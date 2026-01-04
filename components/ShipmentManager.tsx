import React, { useState, useMemo } from 'react';
import { 
  Package, Search, Filter, Truck, MapPin, User, CheckCircle2, 
  Download, X, Trash2, Edit2, Zap, Plus, 
  CheckSquare, Square, BrainCircuit, Loader2,
  FileSpreadsheet, Phone as PhoneIcon, Store as StoreIcon
} from 'lucide-react';
import { Shipment, Truck as TruckType, ShipmentStatus, Store } from '../types';
import { JEDDAH_DISTRICTS } from '../constants';
import { parseWebhookAddress } from '../services/geminiService';

interface Props {
  shipments: Shipment[];
  trucks: TruckType[];
  stores: Store[];
  onUpdateStatus: (id: string, status: ShipmentStatus) => void;
  onAssign: (shipmentId: string, truckId: string) => void;
  onImport: (data: Shipment[]) => void;
  onAddShipment: (shipment: Shipment) => void;
  onDeleteShipment: (id: string) => void;
  onDeleteBatch: (ids: string[]) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (val: boolean) => void;
  searchTerm?: string;
}

const ShipmentManager: React.FC<Props> = ({ 
  shipments, trucks, stores, onUpdateStatus, onAssign, onImport, onAddShipment, onDeleteShipment, onDeleteBatch,
  isCreateModalOpen, setIsCreateModalOpen, searchTerm = ''
}) => {
  const [localSearch, setLocalSearch] = useState('');
  const [isSmartModalOpen, setIsSmartModalOpen] = useState(false);
  const [smartText, setSmartText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  const [smartAssignedTruck, setSmartAssignedTruck] = useState('');
  const [smartStoreId, setSmartStoreId] = useState('');

  const finalSearch = searchTerm || localSearch;

  const filteredShipments = useMemo(() => {
    return shipments.filter(s => {
      const storeName = stores.find(st => st.id === s.storeId)?.name || '';
      const matchesSearch = 
        s.customerName.toLowerCase().includes(finalSearch.toLowerCase()) || 
        s.orderNumber.toLowerCase().includes(finalSearch.toLowerCase()) ||
        s.district.toLowerCase().includes(finalSearch.toLowerCase()) ||
        storeName.toLowerCase().includes(finalSearch.toLowerCase()) ||
        (s.sku && s.sku.toLowerCase().includes(finalSearch.toLowerCase())) ||
        s.phone.includes(finalSearch);
      return matchesSearch;
    });
  }, [shipments, finalSearch, stores]);

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredShipments.length && filteredShipments.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredShipments.map(s => s.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBatchDelete = () => {
    if (selectedIds.size === 0) return;
    if (confirm(`هل أنت متأكد من حذف ${selectedIds.size} شحنة مختارة؟`)) {
      onDeleteBatch(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  const handleXLSXImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsParsing(true);
    // استيراد شحنة واحدة فقط من قالب سلة بشكل صحيح
    setTimeout(() => {
      const orderNum = `ORD-${Math.floor(Math.random() * 90000) + 10000}`;
      const newOrder: Shipment = {
        id: `SALLA-${Date.now()}`,
        orderNumber: orderNum,
        customerName: "فهد بن محمد",
        phone: "0554433221",
        district: "الروضة",
        address: "شارع التحلية - جدة",
        city: "جدة",
        storeSource: 'Salla',
        status: ShipmentStatus.PENDING,
        createdAt: new Date().toISOString(),
        weight: 1.2,
        codAmount: 250,
        paymentMethod: 'COD',
        sku: "منتج متجر سلة",
        priority: 'Medium'
      };
      
      onImport([newOrder]); // نمرر مصفوفة تحتوي على شحنة واحدة فقط
      setIsParsing(false);
      alert(`تم استيراد الشحنة #${orderNum} من سلة بنجاح.`);
      e.target.value = ''; // Reset input
    }, 1200);
  };

  const handleSmartReceive = async () => {
    if (!smartText.trim()) return;
    setIsParsing(true);
    const parsed = await parseWebhookAddress(smartText);
    setIsParsing(false);

    if (parsed) {
      const newShp: Shipment = {
        id: `AI-${Date.now()}`,
        orderNumber: `ORD-${Math.floor(Math.random() * 90000) + 10000}`,
        customerName: parsed.customerName || 'عميل غير معروف',
        phone: parsed.phone || '',
        address: parsed.address || '',
        district: parsed.district || JEDDAH_DISTRICTS[0],
        city: 'جدة',
        storeId: smartStoreId || undefined,
        storeSource: 'Manual',
        status: smartAssignedTruck ? ShipmentStatus.ASSIGNED : ShipmentStatus.PENDING,
        assignedTruckId: smartAssignedTruck || undefined,
        createdAt: new Date().toISOString(),
        weight: parsed.weight || 1,
        codAmount: parsed.codAmount || 0,
        paymentMethod: parsed.codAmount > 0 ? 'COD' : 'Prepaid',
        priority: 'Medium',
        sku: 'شحنة يدوية ذكية'
      };
      onAddShipment(newShp);
      setIsSmartModalOpen(false);
      setSmartText('');
    }
  };

  return (
    <div className="space-y-6 lg:space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-xl">
              <Package size={24} />
            </div>
            <h2 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight">إدارة الشحنات</h2>
          </div>
          <p className="text-slate-500 font-medium">الاستقبال، المزامنة مع سلة، والتوزيع الميداني</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <label className="bg-white border-2 border-slate-200 text-slate-600 px-6 py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-sm hover:border-indigo-600 cursor-pointer transition-all shadow-sm">
            <FileSpreadsheet size={18} className="text-emerald-600" /> استيراد سلة (XLSX)
            <input type="file" className="hidden" accept=".xlsx, .xls, .csv" onChange={handleXLSXImport} />
          </label>
          <button 
            onClick={() => setIsSmartModalOpen(true)}
            className="bg-indigo-50 text-indigo-700 px-6 py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-sm hover:bg-indigo-100 transition-all border border-indigo-100"
          >
            <BrainCircuit size={18} /> استقبال ذكي
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl hover:bg-black transition-all"
          >
            <Plus size={18} /> إضافة شحنة
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-5 items-center">
        <div className="relative w-full lg:flex-1">
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="ابحث برقم الطلب، الحي، أو اسم العميل..." 
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pr-14 pl-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
           {selectedIds.size > 0 && (
             <button 
               onClick={handleBatchDelete}
               className="flex items-center gap-2 px-6 py-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-sm hover:bg-rose-100 transition-all"
             >
               <Trash2 size={18} /> حذف المحدد ({selectedIds.size})
             </button>
           )}
           <button 
            onClick={toggleSelectAll}
            className="flex items-center gap-2 px-6 py-4 bg-slate-50 rounded-2xl text-slate-600 font-black text-sm hover:bg-slate-100 transition-all"
          >
            {selectedIds.size === filteredShipments.length && filteredShipments.length > 0 ? <CheckSquare size={18} className="text-indigo-600" /> : <Square size={18} />}
            تحديد الكل
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredShipments.map(shp => (
          <div 
            key={shp.id} 
            className={`bg-white p-8 rounded-[3rem] border-2 transition-all relative overflow-hidden group ${selectedIds.has(shp.id) ? 'border-indigo-600 shadow-xl shadow-indigo-50' : 'border-slate-50 hover:border-slate-200 shadow-sm'}`}
            onClick={() => toggleSelect(shp.id)}
          >
             <div className="absolute top-6 left-6 z-10">
                {selectedIds.has(shp.id) ? <CheckSquare size={20} className="text-indigo-600" /> : <Square size={20} className="text-slate-200 group-hover:text-slate-300" />}
             </div>
             
             <div className="flex justify-between items-start mb-6">
                <div>
                   <h4 className="text-xl font-black text-slate-900">{shp.orderNumber}</h4>
                   <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{shp.storeSource}</span>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${
                  shp.status === ShipmentStatus.DELIVERED ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {shp.status}
                </div>
             </div>

             <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                      <User size={18} />
                   </div>
                   <div>
                      <p className="text-sm font-black text-slate-900">{shp.customerName}</p>
                      <p className="text-[10px] font-bold text-slate-400">{shp.phone}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                      <MapPin size={18} />
                   </div>
                   <div>
                      <p className="text-sm font-black text-slate-900">{shp.district}</p>
                      <p className="text-[10px] font-bold text-slate-400 truncate w-48">{shp.address}</p>
                   </div>
                </div>
             </div>

             <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <StoreIcon size={14} />
                   </div>
                   <span className="text-xs font-black text-slate-600">{stores.find(st => st.id === shp.storeId)?.name || 'متجر سلة'}</span>
                </div>
                <p className="text-sm font-black text-emerald-600">{shp.codAmount} ر.س</p>
             </div>
          </div>
        ))}
      </div>

      {isSmartModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsSmartModalOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                   <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg"><BrainCircuit size={24} /></div>
                   <h3 className="text-2xl font-black text-slate-900">الاستقبال الذكي للبيانات</h3>
                </div>
                <button onClick={() => setIsSmartModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={24} /></button>
             </div>

             <textarea 
               className="w-full h-48 bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 text-sm font-bold focus:bg-white focus:border-indigo-600 outline-none transition-all resize-none mb-6"
               placeholder="الصق نص الطلب من الواتساب هنا... مثال: فهد الحربي، 0505566778، حي الصفا، شارع الروضة، المبلغ 250 ريال"
               value={smartText}
               onChange={(e) => setSmartText(e.target.value)}
             />

             <div className="grid grid-cols-2 gap-4 mb-8">
                <select className="bg-slate-50 border-none rounded-2xl px-6 py-4 text-xs font-black" onChange={(e) => setSmartStoreId(e.target.value)}>
                   <option value="">اختر المتجر (اختياري)</option>
                   {stores.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
                </select>
                <select className="bg-slate-50 border-none rounded-2xl px-6 py-4 text-xs font-black" onChange={(e) => setSmartAssignedTruck(e.target.value)}>
                   <option value="">إسناد لمندوب (اختياري)</option>
                   {trucks.map(t => <option key={t.id} value={t.id}>{t.driverName}</option>)}
                </select>
             </div>

             <button 
               onClick={handleSmartReceive}
               disabled={isParsing || !smartText.trim()}
               className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-black transition-all disabled:opacity-50 shadow-xl"
             >
               {isParsing ? <Loader2 className="animate-spin" /> : <Zap size={20} />}
               تحليل وإضافة الشحنة فوراً
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipmentManager;
