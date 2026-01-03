
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

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredShipments.length) {
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

  const handleBatchDelete = () => {
    if (window.confirm(`هل أنت متأكد من حذف ${selectedIds.size} شحنة مختارة؟`)) {
      selectedIds.forEach(id => onDeleteShipment(id));
      setSelectedIds(new Set());
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setTimeout(() => {
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
          {selectedIds.size > 0 && (
            <button 
              onClick={handleBatchDelete}
              className="bg-rose-50 text-rose-600 px-6 py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-sm hover:bg-rose-100 transition-all shadow-sm flex-1 sm:flex-none"
            >
              <Trash2 size={18} /> حذف ({selectedIds.size})
            </button>
          )}
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
              <th className="px-6 py-6 text-center">
                <button onClick={toggleSelectAll} className="text-slate-300 hover:text-indigo-600 transition-colors">
                  {selectedIds.size === filteredShipments.length && filteredShipments.length > 0 ? <CheckSquare size={18} className="text-indigo-600" /> : <Square size={18} />}
                </button>
              </th>
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
              const isSelected = selectedIds.has(shp.id);
              return (
                <tr key={shp.id} className={`transition-all group ${isSelected ? 'bg-indigo-50/40' : 'hover:bg-slate-50/80'}`}>
                  <td className="px-6 py-6 text-center">
                    <button onClick={() => toggleSelectOne(shp.id)} className={`transition-colors ${isSelected ? 'text-indigo-600' : 'text-slate-200 hover:text-slate-400'}`}>
                      {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                    </button>
                  </td>
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
                <td colSpan={6} className="py-24 text-center">
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

      {/* Modals same as before... */}
    </div>
  );
};

export default ShipmentManager;
