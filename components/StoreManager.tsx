
import React, { useState } from 'react';
import { Store, Shipment, ShipmentStatus, StorePermissions } from '../types';
// Added Settings2 to the imports
import { 
  Building2, Phone, Package, Wallet, Search, 
  Plus, MoreVertical, ExternalLink, ArrowUpRight,
  TrendingUp, CreditCard, X, Shield, Bell, Power, 
  Ban, CheckCircle2, AlertCircle, Trash2, Send, Save,
  Settings2
} from 'lucide-react';

interface Props {
  stores: Store[];
  shipments: Shipment[];
  onAddStore: (store: Store) => void;
  onUpdateStore: (store: Store) => void;
  onDeleteStore: (id: string) => void;
}

const StoreManager: React.FC<Props> = ({ stores, shipments, onAddStore, onUpdateStore, onDeleteStore }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  
  const [newStoreData, setNewStoreData] = useState({
    name: '',
    ownerName: '',
    phone: '',
  });

  const filteredStores = stores.filter(s => 
    s.name.includes(searchTerm) || s.ownerName.includes(searchTerm)
  );

  const handleCreateStore = (e: React.FormEvent) => {
    e.preventDefault();
    const newStore: Store = {
      id: `STR-${Date.now()}`,
      name: newStoreData.name,
      ownerName: newStoreData.ownerName,
      phone: newStoreData.phone,
      totalCodBalance: 0,
      shipmentCount: 0,
      joinedAt: new Date().toISOString(),
      isActive: true,
      permissions: {
        canSend: true,
        canReceive: true,
        accessShipments: true,
        receiveNotifications: true
      }
    };
    onAddStore(newStore);
    setIsAddModalOpen(false);
    setNewStoreData({ name: '', ownerName: '', phone: '' });
  };

  const toggleStatus = (store: Store) => {
    onUpdateStore({ ...store, isActive: !store.isActive });
  };

  const togglePermission = (store: Store, perm: keyof StorePermissions) => {
    onUpdateStore({
      ...store,
      permissions: {
        ...store.permissions,
        [perm]: !store.permissions[perm]
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-xl">
              <Building2 size={24} />
            </div>
            <h2 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight">إدارة المتاجر والعملاء</h2>
          </div>
          <p className="text-slate-500 font-medium">متابعة المتاجر المرتبطة، أرصدة الـ COD، وحجم الشحنات</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl hover:bg-black transition-all"
        >
          <Plus size={18} /> إضافة متجر جديد
        </button>
      </div>

      <div className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="relative w-full">
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="ابحث عن متجر بالاسم أو رقم الجوال..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-14 pl-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStores.map(store => (
          <div key={store.id} className={`bg-white p-8 rounded-[3rem] border transition-all group overflow-hidden relative ${store.isActive ? 'border-slate-100' : 'border-rose-100 bg-rose-50/20'}`}>
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-[5rem] -mr-16 -mt-16 transition-all ${store.isActive ? 'bg-indigo-50 group-hover:bg-indigo-100' : 'bg-rose-100'}`}></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className={`p-4 rounded-2xl shadow-sm border ${store.isActive ? 'bg-white border-slate-50 text-indigo-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                  <Building2 size={24} />
                </div>
                <div className="flex gap-2">
                   <button onClick={() => toggleStatus(store)} className={`p-2 rounded-xl shadow-sm transition-all ${store.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                      <Power size={18} />
                   </button>
                   <button onClick={() => setEditingStore(store)} className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all">
                      <Settings2 size={18} />
                   </button>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-black text-slate-900">{store.name}</h3>
                {!store.isActive && <span className="bg-rose-500 text-white text-[8px] px-2 py-0.5 rounded-full font-black uppercase">معطل</span>}
              </div>
              <div className="flex items-center gap-2 text-slate-400 font-bold text-xs mb-8">
                <Phone size={14} />
                <span>{store.phone}</span>
                <span className="mx-1">•</span>
                <span>{store.ownerName}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
                  <div className="flex items-center gap-2 text-indigo-600 mb-2">
                    <Package size={14} />
                    <span className="text-[10px] font-black uppercase">الشحنات</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{store.shipmentCount}</p>
                </div>
                <div className="bg-emerald-50 p-5 rounded-[2rem] border border-emerald-100">
                  <div className="flex items-center gap-2 text-emerald-600 mb-2">
                    <Wallet size={14} />
                    <span className="text-[10px] font-black uppercase">التحصيل</span>
                  </div>
                  <p className="text-2xl font-black text-emerald-600">{store.totalCodBalance.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-black transition-all">
                  الكشوفات <ArrowUpRight size={14} />
                </button>
                <button onClick={() => onDeleteStore(store.id)} className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-100 transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: Add New Store */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-900">إضافة متجر جديد</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <X size={24} className="text-slate-400" />
                </button>
             </div>
             <form onSubmit={handleCreateStore} className="space-y-6">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">اسم المتجر</label>
                  <input required type="text" className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-black focus:ring-4 focus:ring-indigo-500/10 outline-none" value={newStoreData.name} onChange={e => setNewStoreData({...newStoreData, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">اسم المالك</label>
                  <input required type="text" className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-black focus:ring-4 focus:ring-indigo-500/10 outline-none" value={newStoreData.ownerName} onChange={e => setNewStoreData({...newStoreData, ownerName: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">رقم الجوال</label>
                  <input required type="tel" className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-black focus:ring-4 focus:ring-indigo-500/10 outline-none" value={newStoreData.phone} onChange={e => setNewStoreData({...newStoreData, phone: e.target.value})} />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-indigo-700 transition-all">تفعيل حساب المتجر</button>
             </form>
          </div>
        </div>
      )}

      {/* MODAL: Permissions & Notifications */}
      {editingStore && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setEditingStore(null)} />
          <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <Shield className="text-indigo-600" />
                  <h3 className="text-2xl font-black text-slate-900">صلاحيات {editingStore.name}</h3>
                </div>
                <button onClick={() => setEditingStore(null)} className="p-2 hover:bg-slate-100 rounded-xl">
                  <X size={24} className="text-slate-400" />
                </button>
             </div>

             <div className="space-y-4">
                <PermissionToggle 
                  label="تفعيل حساب المتجر" 
                  desc="تمكين أو تعطيل دخول المتجر للنظام بشكل كامل"
                  active={editingStore.isActive} 
                  onToggle={() => toggleStatus(editingStore)}
                  icon={<Power size={18} />}
                />
                <PermissionToggle 
                  label="إرسال شحنات جديدة" 
                  desc="تمكين المتجر من إنشاء أو إرسال طلبات جديدة"
                  active={editingStore.permissions.canSend} 
                  onToggle={() => togglePermission(editingStore, 'canSend')}
                  icon={<Send size={18} />}
                />
                <PermissionToggle 
                  label="استقبال مرتجعات" 
                  desc="السماح للمتجر باستقبال الشحنات المرجعة"
                  active={editingStore.permissions.canReceive} 
                  onToggle={() => togglePermission(editingStore, 'canReceive')}
                  icon={<Package size={18} />}
                />
                <PermissionToggle 
                  label="الوصول لقائمة الشحنات" 
                  desc="عرض وتتبع الشحنات الحالية في لوحة المتجر"
                  active={editingStore.permissions.accessShipments} 
                  onToggle={() => togglePermission(editingStore, 'accessShipments')}
                  icon={<ExternalLink size={18} />}
                />
                <PermissionToggle 
                  label="تلقي التنبيهات" 
                  desc="إرسال إشعارات للمتجر عند تحديث حالة الشحنات"
                  active={editingStore.permissions.receiveNotifications} 
                  onToggle={() => togglePermission(editingStore, 'receiveNotifications')}
                  icon={<Bell size={18} />}
                />
             </div>

             <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end gap-3">
               <button onClick={() => setEditingStore(null)} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2">
                 <CheckCircle2 size={18} /> حفظ الإعدادات
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PermissionToggle: React.FC<{ label: string, desc: string, active: boolean, onToggle: () => void, icon: React.ReactNode }> = ({ label, desc, active, onToggle, icon }) => (
  <div className={`p-6 rounded-[2rem] border transition-all flex items-center justify-between ${active ? 'bg-indigo-50/30 border-indigo-100' : 'bg-slate-50 border-slate-100'}`}>
    <div className="flex items-center gap-4">
       <div className={`p-3 rounded-xl ${active ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
         {icon}
       </div>
       <div>
         <p className="text-sm font-black text-slate-900">{label}</p>
         <p className="text-[10px] text-slate-400 font-bold">{desc}</p>
       </div>
    </div>
    <button 
      onClick={onToggle}
      className={`relative w-14 h-8 rounded-full transition-all duration-300 ${active ? 'bg-emerald-500' : 'bg-slate-300'}`}
    >
      <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  </div>
);

export default StoreManager;
