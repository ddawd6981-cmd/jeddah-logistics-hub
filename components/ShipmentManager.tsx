
import React, { useState, useMemo, useRef } from 'react';
import { 
  Package, Search, Filter, Truck,
  MapPin, User, CheckCircle2, 
  Download, X, Trash2, Edit2, 
  Calendar, CreditCard, Layers,
  ChevronUp, Zap, ArrowLeft, FilterX,
  FileSpreadsheet, Upload, CheckSquare, Square, MoreHorizontal,
  Plus, Smartphone, FileText
} from 'lucide-react';
import { Shipment, Truck as TruckType, ShipmentStatus } from '../types';
import { JEDDAH_DISTRICTS } from '../constants';

interface Props {
  shipments: Shipment[];
  trucks: TruckType[];
  onUpdateStatus: (id: string, status: ShipmentStatus) => void;
  onAssign: (shipmentId: string, truckId: string) => void;
  onImport: (data: Shipment[]) => void;
  onAddShipment: (shipment: Shipment) => void;
  onDeleteShipment: (id: string) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (val: boolean) => void;
  searchTerm?: string;
}

const ShipmentManager: React.FC<Props> = ({ 
  shipments, trucks, onUpdateStatus, onAssign, onImport, onAddShipment, onDeleteShipment,
  isCreateModalOpen, setIsCreateModalOpen, searchTerm = ''
}) => {
  const [localSearch, setLocalSearch] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterSource, setFilterSource] = useState<string>('ALL');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [manualShipment, setManualShipment] = useState({
    customerName: '',
    phone: '',
    district: JEDDAH_DISTRICTS[0],
    address: '',
    codAmount: 0,
    paymentMethod: 'COD' as 'COD' | 'Prepaid'
  });

  const finalSearch = searchTerm || localSearch;

  const filteredShipments = useMemo(() => {
    return shipments.filter(s => {
      const matchesSearch = 
        s.customerName.toLowerCase().includes(finalSearch.toLowerCase()) || 
        s.orderNumber.toLowerCase().includes(finalSearch.toLowerCase()) ||
        s.district.toLowerCase().includes(finalSearch.toLowerCase()) ||
        s.phone.includes(finalSearch);
      
      const matchesStatus = filterStatus === 'ALL' || s.status === filterStatus;
      const matchesSource = filterSource === 'ALL' || s.storeSource === filterSource;
      
      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [shipments, finalSearch, filterStatus, filterSource]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setTimeout(() => {
      // Mock logic to simulate Salla Excel data parsing
      const fileName = file.name.toLowerCase();
      const source = fileName.includes('salla') ? 'Salla' : fileName.includes('zid') ? 'Zid' : 'Manual';
      
      const importedData: Shipment[] = Array.from({ length: 8 }, (_, i) => ({
        id: `IMP-${Date.now()}-${i}`,
        orderNumber: `${source === 'Salla' ? 'SA' : 'ZID'}-${100000 + Math.floor(Math.random() * 90000)}`,
        customerName: `عميل مستورد ${i + 1}`,
        phone: '05' + Math.floor(Math.random() * 90000000),
        address: 'عنوان مفصل مستخرج من الملف',
        district: JEDDAH_DISTRICTS[Math.floor(Math.random() * JEDDAH_DISTRICTS.length)],
        city: 'جدة',
        storeSource: source as any,
        status: ShipmentStatus.PENDING,
        createdAt: new Date().toISOString(),
        weight: 1,
        codAmount: 100 + (i * 20),
        paymentMethod: 'COD',
        priority: 'Medium'
      }));

      onImport(importedData);
      setImporting(false);
      setIsImportModalOpen(false);
      alert(`تم بنجاح استيراد ${importedData.length} شحنات من الملف.`);
    }, 1500);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newShp: Shipment = {
      id: `MAN-${Date.now()}`,
      orderNumber: `ORD-${Math.floor(Math.random() * 90000) + 10000}`,
      customerName: manualShipment.customerName,
      phone: manualShipment.phone,
      address: manualShipment.address,
      district: manualShipment.district,
      city: 'جدة',
      storeSource: 'Manual',
      status: ShipmentStatus.PENDING,
      createdAt: new Date().toISOString(),
      weight: 1,
      codAmount: manualShipment.paymentMethod === 'COD' ? manualShipment.codAmount : 0,
      paymentMethod: manualShipment.paymentMethod,
      priority: 'Medium'
    };
    onAddShipment(newShp);
    setIsCreateModalOpen(false);
    setManualShipment({ customerName: '', phone: '', district: JEDDAH_DISTRICTS[0], address: '', codAmount: 0, paymentMethod: 'COD' });
  };

  return (
    <div className="space-y-6 lg:space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-xl shadow-indigo-100">
              <Package size={24} />
            </div>
            <h2 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight">إدارة الشحنات</h2>
          </div>
          <p className="text-slate-500 font-medium">إدارة شاملة لاستقبال وتوزيع الطلبات في جدة</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="bg-white border-2 border-slate-100 text-slate-700 px-6 py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-sm hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm flex-1 sm:flex-none"
          >
            <Download size={18} /> استيراد (Excel)
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl hover:bg-black transition-all flex-1 sm:flex-none"
          >
            <Plus size={18} /> إضافة يدوية
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 lg:p-7 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-5 items-center">
        <div className="relative w-full lg:flex-1">
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="ابحث برقم الطلب، اسم العميل، الحي..." 
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pr-14 pl-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
           <div className="flex items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shrink-0">
             <select 
               value={filterStatus}
               onChange={(e) => setFilterStatus(e.target.value)}
               className="bg-transparent border-none px-3 py-2 text-[11px] font-black text-slate-700 outline-none cursor-pointer"
             >
                <option value="ALL">كل الحالات</option>
                {Object.values(ShipmentStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
             </select>
             <div className="w-px h-4 bg-slate-200 mx-1"></div>
             <select 
               value={filterSource}
               onChange={(e) => setFilterSource(e.target.value)}
               className="bg-transparent border-none px-3 py-2 text-[11px] font-black text-slate-700 outline-none cursor-pointer"
             >
                <option value="ALL">المصدر</option>
                <option value="Salla">سلة</option>
                <option value="Zid">زد</option>
                <option value="Manual">يدوي</option>
             </select>
           </div>
        </div>
      </div>

      {/* Table - Responsive */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto relative">
        <table className="w-full text-right border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-8 py-6">رقم الطلب</th>
              <th className="px-6 py-6">العميل والموقع</th>
              <th className="px-6 py-6">حالة التوصيل</th>
              <th className="px-6 py-6 text-center">المبلغ</th>
              <th className="px-6 py-6 text-center">التحكم</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredShipments.length > 0 ? filteredShipments.map((shp) => {
              const assignedTruck = trucks.find(t => t.id === shp.assignedTruckId);
              return (
                <tr key={shp.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                       <span className="text-sm font-black text-slate-900 flex items-center gap-2">
                         {shp.orderNumber}
                         <span className={`text-[8px] px-1.5 py-0.5 rounded-lg font-black ${
                           shp.storeSource === 'Salla' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100'
                         }`}>{shp.storeSource}</span>
                       </span>
                       <span className="text-[10px] font-bold text-slate-400">{new Date(shp.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                       <span className="text-sm font-black text-slate-800">{shp.customerName}</span>
                       <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                          <MapPin size={10} className="text-rose-400" /> {shp.district}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-2">
                       <span className={`inline-flex px-3 py-1 rounded-xl text-[10px] font-black w-fit border ${
                         shp.status === ShipmentStatus.DELIVERED ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                       }`}>
                          {shp.status}
                       </span>
                       {assignedTruck && <span className="text-[10px] font-black text-indigo-600">👤 {assignedTruck.driverName}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className="text-sm font-black text-slate-900">{shp.codAmount} ر.س</span>
                  </td>
                  <td className="px-6 py-6">
                     <div className="flex items-center justify-center gap-2">
                        <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                           <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => onDeleteShipment(shp.id)} 
                          className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                        >
                           <Trash2 size={14} />
                        </button>
                     </div>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={5} className="py-24 text-center">
                   <div className="flex flex-col items-center justify-center text-slate-300">
                      <Layers size={48} className="opacity-40 mb-4" />
                      <p className="text-base font-black text-slate-400">لا توجد نتائج مطابقة لبحثك</p>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => !importing && setIsImportModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95 duration-300">
             {!importing ? (
               <div className="space-y-8">
                  <div className="text-center">
                    <div className="bg-indigo-50 w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-indigo-600 mb-6">
                       <FileSpreadsheet size={36} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">استيراد من ملف</h3>
                    <p className="text-slate-500 text-sm mt-2">اختر ملف الإكسل المصدر من منصة سلة أو زد</p>
                  </div>
                  <div className="space-y-3">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center justify-between p-5 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white"><Upload size={20} /></div>
                        <span className="text-sm font-black text-slate-800">اختر الملف</span>
                      </div>
                      <ArrowLeft size={16} />
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept=".csv, .xlsx" onChange={handleFileUpload} />
                  </div>
                  <button onClick={() => setIsImportModalOpen(false)} className="w-full text-slate-400 py-2 text-xs font-black">إلغاء</button>
               </div>
             ) : (
               <div className="py-12 flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                  <h4 className="text-lg font-black text-slate-900">جاري معالجة البيانات...</h4>
               </div>
             )}
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-end lg:items-center justify-center p-0 lg:p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsCreateModalOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-t-[3rem] lg:rounded-[3rem] shadow-2xl p-8 lg:p-12 animate-in slide-in-from-bottom duration-300 overflow-y-auto max-h-[90vh]">
             <div className="flex justify-between items-center mb-10">
               <h3 className="text-2xl font-black text-slate-900">إنشاء شحنة يدوية</h3>
               <button onClick={() => setIsCreateModalOpen(false)} className="p-2 bg-slate-50 rounded-xl text-slate-400"><X size={24} /></button>
             </div>
             <form onSubmit={handleManualSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">اسم العميل</label>
                    <input required type="text" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" 
                      value={manualShipment.customerName} onChange={(e) => setManualShipment({...manualShipment, customerName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">رقم الجوال</label>
                    <input required type="text" placeholder="05xxxxxxxx" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" 
                      value={manualShipment.phone} onChange={(e) => setManualShipment({...manualShipment, phone: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">الحي في جدة</label>
                  <select className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all cursor-pointer" 
                    value={manualShipment.district} onChange={(e) => setManualShipment({...manualShipment, district: e.target.value})}>
                    {JEDDAH_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">العنوان الكامل</label>
                  <textarea required className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 h-24 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none" 
                    value={manualShipment.address} onChange={(e) => setManualShipment({...manualShipment, address: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">المبلغ (COD)</label>
                      <input type="number" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" 
                        value={manualShipment.codAmount} onChange={(e) => setManualShipment({...manualShipment, codAmount: parseFloat(e.target.value)})} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">طريقة الدفع</label>
                      <select className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all cursor-pointer" 
                        value={manualShipment.paymentMethod} onChange={(e) => setManualShipment({...manualShipment, paymentMethod: e.target.value as any})}>
                        <option value="COD">عند الاستلام</option>
                        <option value="Prepaid">مدفوع مسبقاً</option>
                      </select>
                   </div>
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-black transition-all mt-4">حفظ الشحنة</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipmentManager;
