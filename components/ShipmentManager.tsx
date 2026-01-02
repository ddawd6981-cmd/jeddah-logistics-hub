
import React, { useState, useMemo } from 'react';
import { 
  Package, Search, Filter, MoreHorizontal, Truck,
  MapPin, User, CheckCircle2, 
  AlertCircle, Upload, X, Download, 
  RefreshCw, CheckSquare, Square, FileSpreadsheet,
  Trash2, Plus, Info, Settings2, ChevronDown, Trash,
  Edit2, ExternalLink, Calendar, CreditCard, Layers,
  ChevronUp, Zap, ArrowLeft, ArrowRight, Share2, FilterX
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
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (val: boolean) => void;
  searchTerm?: string;
}

const ShipmentManager: React.FC<Props> = ({ 
  shipments, trucks, onUpdateStatus, onAssign, onImport, onAddShipment, 
  isCreateModalOpen, setIsCreateModalOpen, searchTerm = ''
}) => {
  const [localSearch, setLocalSearch] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBatchAssignOpen, setIsBatchAssignOpen] = useState(false);
  const [isBatchStatusOpen, setIsBatchStatusOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterSource, setFilterSource] = useState<string>('ALL');

  // Manual shipment state
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

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredShipments.length && filteredShipments.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredShipments.map(s => s.id)));
    }
  };

  const toggleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBatchAssign = (truckId: string) => {
    selectedIds.forEach(id => onAssign(id, truckId));
    setSelectedIds(new Set());
    setIsBatchAssignOpen(false);
  };

  const handleBatchStatus = (status: ShipmentStatus) => {
    selectedIds.forEach(id => onUpdateStatus(id, status));
    setSelectedIds(new Set());
    setIsBatchStatusOpen(false);
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
    setManualShipment({
      customerName: '',
      phone: '',
      district: JEDDAH_DISTRICTS[0],
      address: '',
      codAmount: 0,
      paymentMethod: 'COD'
    });
  };

  const handleSallaSync = () => {
    setImporting(true);
    setTimeout(() => {
      const newData: Shipment[] = [
        {
          id: `Salla-${Date.now()}-1`,
          orderNumber: `SA-${Math.floor(Math.random() * 900000 + 100000)}`,
          customerName: 'أحمد الغامدي',
          phone: '0567788990',
          address: 'شارع فلسطين، مقابل مستشفى الجدعاني',
          district: 'الرويس',
          city: 'جدة',
          storeSource: 'Salla',
          status: ShipmentStatus.PENDING,
          createdAt: new Date().toISOString(),
          weight: 1.5,
          codAmount: 250,
          paymentMethod: 'COD',
          priority: 'High'
        },
        {
          id: `Salla-${Date.now()}-2`,
          orderNumber: `SA-${Math.floor(Math.random() * 900000 + 100000)}`,
          customerName: 'مريم الصالح',
          phone: '0544332211',
          address: 'حي البساتين، فيلا 44',
          district: 'البساتين',
          city: 'جدة',
          storeSource: 'Salla',
          status: ShipmentStatus.PENDING,
          createdAt: new Date().toISOString(),
          weight: 3.2,
          codAmount: 0,
          paymentMethod: 'Prepaid',
          priority: 'Medium'
        }
      ];
      onImport(newData);
      setImporting(false);
      setIsImportModalOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-40">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-200">
               <Package size={26} />
             </div>
             <h2 className="text-4xl font-black text-slate-900 tracking-tight">إدارة الشحنات</h2>
          </div>
          <p className="text-slate-500 font-medium">نظام الربط الذكي مع متاجر (سلة وزد) والتوزيع اللحظي بجدة</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="bg-white border-2 border-slate-100 text-slate-700 px-7 py-4 rounded-[1.5rem] flex items-center gap-3 font-black text-sm hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm group active:scale-95"
          >
            <Download size={20} className="group-hover:-translate-y-1 transition-transform" />
            استيراد من المتاجر
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-sm flex items-center gap-3 shadow-2xl shadow-slate-900/20 hover:bg-black transition-all active:scale-95"
          >
            <Plus size={20} />
            إضافة شحنة يدوية
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-wrap gap-5 items-center">
        <div className="relative flex-1 min-w-[350px]">
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="ابحث عن: رقم طلب، اسم عميل، حي، أو رقم جوال..." 
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pr-14 pl-6 py-4.5 bg-slate-50 border-none rounded-[1.5rem] text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3">
           <div className="flex items-center bg-slate-50 p-2 rounded-2xl border border-slate-100">
             <select 
               value={filterStatus}
               onChange={(e) => setFilterStatus(e.target.value)}
               className="bg-transparent border-none px-4 py-2 text-xs font-black text-slate-700 outline-none cursor-pointer"
             >
                <option value="ALL">كل الحالات</option>
                {Object.values(ShipmentStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
             </select>
             <div className="w-px h-6 bg-slate-200 mx-2"></div>
             <select 
               value={filterSource}
               onChange={(e) => setFilterSource(e.target.value)}
               className="bg-transparent border-none px-4 py-2 text-xs font-black text-slate-700 outline-none cursor-pointer"
             >
                <option value="ALL">كل المصادر</option>
                <option value="Salla">سلة</option>
                <option value="Zid">زد</option>
                <option value="Manual">يدوي</option>
             </select>
           </div>
           
           {(filterStatus !== 'ALL' || filterSource !== 'ALL' || localSearch) && (
             <button 
               onClick={() => { setFilterStatus('ALL'); setFilterSource('ALL'); setLocalSearch(''); }}
               className="p-3 text-rose-500 hover:bg-rose-50 rounded-2xl transition-colors"
               title="إلغاء التصفية"
             >
                <FilterX size={20} />
             </button>
           )}
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto relative min-h-[500px]">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100">
              <th className="px-8 py-7 w-16">
                <button onClick={toggleSelectAll} className="text-slate-300 hover:text-indigo-600 transition-colors">
                  {selectedIds.size === filteredShipments.length && filteredShipments.length > 0 ? <CheckSquare size={24} className="text-indigo-600" /> : <Square size={24} />}
                </button>
              </th>
              <th className="px-6 py-7 text-[10px] font-black text-slate-400 uppercase tracking-widest">معلومات الطلب</th>
              <th className="px-6 py-7 text-[10px] font-black text-slate-400 uppercase tracking-widest">العميل والموقع</th>
              <th className="px-6 py-7 text-[10px] font-black text-slate-400 uppercase tracking-widest">حالة التوصيل</th>
              <th className="px-6 py-7 text-[10px] font-black text-slate-400 uppercase tracking-widest">التفاصيل المالية</th>
              <th className="px-6 py-7 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">الإجراء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredShipments.length > 0 ? filteredShipments.map((shp) => {
              const assignedTruck = trucks.find(t => t.id === shp.assignedTruckId);
              const isSelected = selectedIds.has(shp.id);
              
              return (
                <tr key={shp.id} className={`hover:bg-slate-50/80 transition-all group ${isSelected ? 'bg-indigo-50/40' : ''}`}>
                  <td className="px-8 py-7">
                    <button onClick={() => toggleSelectOne(shp.id)} className={`transition-colors ${isSelected ? 'text-indigo-600' : 'text-slate-200 group-hover:text-slate-400'}`}>
                       {isSelected ? <CheckSquare size={24} /> : <Square size={24} />}
                    </button>
                  </td>
                  <td className="px-6 py-7">
                    <div className="flex flex-col">
                       <span className="text-sm font-black text-slate-900 mb-1 flex items-center gap-2">
                         {shp.orderNumber}
                         <span className={`text-[8px] px-2 py-1 rounded-lg uppercase font-black tracking-tighter ${
                           shp.storeSource === 'Salla' ? 'bg-emerald-100 text-emerald-600' : 
                           shp.storeSource === 'Zid' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-500'
                         }`}>
                           {shp.storeSource === 'Salla' ? 'سلة' : shp.storeSource === 'Zid' ? 'زد' : 'يدوي'}
                         </span>
                       </span>
                       <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                          <Calendar size={12} className="opacity-50" />
                          {new Date(shp.createdAt).toLocaleDateString('ar-SA')}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-7">
                    <div className="flex flex-col">
                       <span className="text-sm font-black text-slate-800 flex items-center gap-1.5 mb-1">
                          <User size={14} className="text-indigo-500" />
                          {shp.customerName}
                       </span>
                       <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                          <MapPin size={12} className="text-rose-400" />
                          {shp.district}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-7">
                    <div className="flex flex-col gap-2.5">
                       <span className={`inline-flex px-3.5 py-1.5 rounded-xl text-[10px] font-black w-fit border ${
                         shp.status === ShipmentStatus.DELIVERED ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                         shp.status === ShipmentStatus.PENDING ? 'bg-amber-50 text-amber-600 border-amber-100' :
                         shp.status === ShipmentStatus.ASSIGNED ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                         shp.status === ShipmentStatus.OUT_FOR_DELIVERY ? 'bg-blue-50 text-blue-600 border-blue-100' :
                         'bg-slate-50 text-slate-400 border-slate-100'
                       }`}>
                          {shp.status}
                       </span>
                       {assignedTruck ? (
                         <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl w-fit group-hover:bg-white transition-colors border border-slate-100">
                            <div className="w-5 h-5 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600"><Truck size={12} /></div>
                            <span className="text-xs font-black text-slate-700">{assignedTruck.driverName}</span>
                         </div>
                       ) : (
                         <span className="text-[10px] text-slate-400 font-black italic mr-1">بانتظار التوزيع الميداني</span>
                       )}
                    </div>
                  </td>
                  <td className="px-6 py-7">
                    <div className="flex flex-col">
                       <span className={`text-sm font-black ${shp.paymentMethod === 'COD' ? 'text-emerald-600' : 'text-slate-400 line-through'}`}>
                          {shp.codAmount} ر.س
                       </span>
                       <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${shp.paymentMethod === 'COD' ? 'text-emerald-500' : 'text-indigo-500'}`}>
                          <CreditCard size={10} />
                          {shp.paymentMethod === 'COD' ? 'عند الاستلام' : 'دفع مسبق'}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-7 text-center">
                     <div className="flex items-center justify-center gap-2">
                        <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm group/btn">
                           <Edit2 size={16} />
                        </button>
                        <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm group/btn">
                           <Trash2 size={16} />
                        </button>
                     </div>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={6} className="py-32 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-300">
                    <div className="bg-slate-50 p-10 rounded-[4rem] mb-6 border-2 border-dashed border-slate-100">
                      <Layers size={64} className="opacity-40" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-400 mb-2">لا توجد شحنات متاحة</h3>
                    <p className="text-slate-400 font-bold">ابدأ بإضافة شحناتك من المتاجر أو يدوياً للتحكم بالأسطول.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Floating Batch Actions Bar */}
        {selectedIds.size > 0 && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10 duration-500">
            <div className="bg-slate-900 text-white px-10 py-5 rounded-[2.5rem] shadow-2xl shadow-indigo-500/30 flex items-center gap-10 border border-white/10 backdrop-blur-xl">
               <div className="flex items-center gap-4 border-l border-white/10 pl-10">
                  <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
                    {selectedIds.size}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black">شحنات مختارة</span>
                    <button onClick={() => setSelectedIds(new Set())} className="text-[10px] text-slate-400 hover:text-white font-bold text-right uppercase tracking-widest">إلغاء التحديد</button>
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  <div className="relative">
                    <button 
                      onClick={() => { setIsBatchAssignOpen(!isBatchAssignOpen); setIsBatchStatusOpen(false); }}
                      className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-6 py-3.5 rounded-2xl transition-all border border-white/10 font-black text-sm"
                    >
                      <Truck size={20} className="text-indigo-400" />
                      إسناد لمناديب
                      <ChevronUp size={16} className={`transition-transform ${isBatchAssignOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isBatchAssignOpen && (
                      <div className="absolute bottom-full mb-4 right-0 w-72 bg-white rounded-3xl shadow-2xl p-4 space-y-2 border border-slate-100 animate-in zoom-in-95 duration-200">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-2 border-b border-slate-50">اختر المندوب (متاح {trucks.filter(t => t.status === 'Active').length})</p>
                         <div className="max-h-64 overflow-y-auto custom-scrollbar">
                           {trucks.filter(t => t.status === 'Active').map(truck => (
                             <button 
                               key={truck.id}
                               onClick={() => handleBatchAssign(truck.id)}
                               className="w-full text-right p-4 rounded-2xl hover:bg-indigo-50 transition-all flex items-center justify-between group"
                             >
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-xs">
                                     {truck.driverName.charAt(0)}
                                   </div>
                                   <div className="flex flex-col">
                                      <span className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{truck.driverName}</span>
                                      <span className="text-[10px] text-slate-400 font-bold">{truck.assignedDistrict}</span>
                                   </div>
                                </div>
                                <ArrowLeft size={14} className="text-slate-300 group-hover:text-indigo-600" />
                             </button>
                           ))}
                         </div>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <button 
                      onClick={() => { setIsBatchStatusOpen(!isBatchStatusOpen); setIsBatchAssignOpen(false); }}
                      className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-6 py-3.5 rounded-2xl transition-all border border-white/10 font-black text-sm"
                    >
                      <RefreshCw size={20} className="text-emerald-400" />
                      تغيير الحالة
                      <ChevronUp size={16} className={`transition-transform ${isBatchStatusOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isBatchStatusOpen && (
                      <div className="absolute bottom-full mb-4 right-0 w-64 bg-white rounded-3xl shadow-2xl p-4 space-y-2 border border-slate-100 animate-in zoom-in-95 duration-200">
                         {Object.values(ShipmentStatus).map(status => (
                           <button 
                             key={status}
                             onClick={() => handleBatchStatus(status)}
                             className="w-full text-right p-4 rounded-2xl hover:bg-emerald-50 transition-all text-sm font-black text-slate-800"
                           >
                              {status}
                           </button>
                         ))}
                      </div>
                    )}
                  </div>

                  <button className="p-3.5 bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-2xl transition-all border border-rose-500/20">
                    <Trash2 size={22} />
                  </button>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Salla Import Simulation */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xl" onClick={() => !importing && setIsImportModalOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-12 text-center">
                {!importing ? (
                  <>
                    <div className="bg-emerald-500 w-24 h-24 rounded-[2rem] mx-auto flex items-center justify-center text-white mb-8 shadow-2xl shadow-emerald-200">
                       <img src="https://salla.sa/favicon.ico" className="w-12 h-12 filter brightness-0 invert" alt="Salla" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mb-4">مزامنة طلبات متجر سلة</h3>
                    <p className="text-slate-500 font-medium mb-10 leading-relaxed max-w-md mx-auto">
                      سيقوم النظام بالاتصال بمتجرك وجلب جميع الطلبات التي تحمل حالة "قيد التنفيذ" وتحويلها لشحنات في نظامنا تلقائياً.
                    </p>
                    <div className="flex flex-col gap-4">
                       <button 
                        onClick={handleSallaSync}
                        className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3"
                       >
                          <Zap size={24} />
                          بدء المزامنة اللحظية
                       </button>
                       <button 
                        onClick={() => setIsImportModalOpen(false)}
                        className="w-full text-slate-400 py-3 font-bold hover:text-slate-600 transition-colors"
                       >
                         إلغاء العملية
                       </button>
                    </div>
                  </>
                ) : (
                  <div className="py-20 flex flex-col items-center">
                     <div className="relative w-32 h-32 mb-10">
                        <div className="absolute inset-0 border-8 border-slate-100 rounded-full"></div>
                        <div className="absolute inset-0 border-8 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-emerald-600">
                           <RefreshCw size={40} className="animate-pulse" />
                        </div>
                     </div>
                     <h4 className="text-2xl font-black text-slate-900 mb-2">جاري جلب البيانات...</h4>
                     <p className="text-slate-400 font-bold animate-pulse">يتم الآن فحص 14 طلب جديد في سلة</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      )}

      {/* Modal: Manual Shipment Creation */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsCreateModalOpen(false)} />
          <div className="relative bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl p-12 animate-in slide-in-from-bottom-10 duration-300">
             <div className="flex justify-between items-center mb-10">
               <div className="flex items-center gap-4">
                  <div className="bg-slate-900 p-3 rounded-2xl text-white"><Plus size={24} /></div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">إنشاء شحنة جديدة</h3>
               </div>
               <button onClick={() => setIsCreateModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
                  <X size={28} className="text-slate-400" />
               </button>
             </div>

             <form onSubmit={handleManualSubmit} className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">اسم العميل بالكامل</label>
                      <div className="relative">
                         <User className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                         <input required type="text" placeholder="مثال: أحمد محمد علي" className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pr-12 pl-5 text-sm font-bold focus:bg-white focus:border-indigo-600 outline-none transition-all" 
                           value={manualShipment.customerName} onChange={(e) => setManualShipment({...manualShipment, customerName: e.target.value})} />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">رقم الجوال (السعودية)</label>
                      <input required type="text" placeholder="05xxxxxxxx" className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-indigo-600 outline-none transition-all" 
                        value={manualShipment.phone} onChange={(e) => setManualShipment({...manualShipment, phone: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">الحي (داخل مدينة جدة)</label>
                      <select className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-indigo-600 outline-none transition-all cursor-pointer" 
                        value={manualShipment.district} onChange={(e) => setManualShipment({...manualShipment, district: e.target.value})}>
                        {JEDDAH_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">العنوان التفصيلي</label>
                      <div className="relative">
                         <MapPin className="absolute right-5 top-5 text-slate-300" size={18} />
                         <textarea required placeholder="مثال: شارع صاري، مبنى 4، الدور الثاني" className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pr-12 pl-5 h-32 text-sm font-bold focus:bg-white focus:border-indigo-600 outline-none transition-all resize-none" 
                           value={manualShipment.address} onChange={(e) => setManualShipment({...manualShipment, address: e.target.value})} />
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">طريقة الدفع</label>
                        <select className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-indigo-600 outline-none transition-all cursor-pointer" 
                          value={manualShipment.paymentMethod} onChange={(e) => setManualShipment({...manualShipment, paymentMethod: e.target.value as any})}>
                          <option value="COD">عند الاستلام</option>
                          <option value="Prepaid">مدفوع مسبقاً</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">المبلغ المطلوب</label>
                        <input disabled={manualShipment.paymentMethod === 'Prepaid'} type="number" placeholder="0.00" className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-indigo-600 outline-none transition-all disabled:opacity-50" 
                          value={manualShipment.codAmount} onChange={(e) => setManualShipment({...manualShipment, codAmount: parseFloat(e.target.value)})} />
                      </div>
                   </div>
                </div>

                <div className="col-span-2 pt-6">
                  <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-[1.5rem] font-black text-xl shadow-2xl shadow-slate-200 hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-4">
                    <CheckCircle2 size={26} />
                    حفظ وإدراج الشحنة في النظام
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipmentManager;
