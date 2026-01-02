import React, { useState, useMemo } from 'react';
import { 
  Users, UserPlus, Shield, Lock, Unlock, Eye, EyeOff, 
  Trash2, Edit3, ShieldCheck, Key, Power, AlertOctagon,
  Search, Filter, ChevronLeft, X, Save, Download,
  CheckCircle2, Settings2, BarChart3, Truck, Package, CreditCard
} from 'lucide-react';
import { Truck as Account, UserRole, AppPermissions } from '../types';
// Fix: Corrected the misspelled import of JEDDAH_DISTRICTS
import { JEDDAH_DISTRICTS } from '../constants';

interface Props {
  trucks: Account[];
  onUpdateTruck: (account: Account) => void;
  onDeleteTruck: (id: string) => void;
  onAddTruck: (account: Account) => void;
  searchTerm?: string;
}

const AccountManager: React.FC<Props> = ({ trucks, onUpdateTruck, onDeleteTruck, onAddTruck, searchTerm = '' }) => {
  const [localSearch, setLocalSearch] = useState('');
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const [newAccountData, setNewAccountData] = useState({
    driverName: '',
    username: '',
    password: '',
    driverPhone: '',
    role: 'DRIVER' as UserRole,
    assignedDistrict: 'الشاطئ'
  });

  const finalSearch = (searchTerm || localSearch).toLowerCase();

  const filteredAccounts = useMemo(() => trucks.filter(t => 
    t.driverName.toLowerCase().includes(finalSearch) || 
    t.username.toLowerCase().includes(finalSearch)
  ), [trucks, finalSearch]);

  const defaultPermissions = (role: UserRole): AppPermissions => {
    switch (role) {
      case 'ADMIN':
        return { canManageFleet: true, canManageShipments: true, canViewFinancials: true, canEditSettings: true, canManageUsers: true, canDeleteData: true, canExportReports: true };
      case 'SUPERVISOR':
        return { canManageFleet: true, canManageShipments: true, canViewFinancials: true, canEditSettings: false, canManageUsers: false, canDeleteData: false, canExportReports: true };
      case 'ACCOUNTANT':
        return { canManageFleet: false, canManageShipments: true, canViewFinancials: true, canEditSettings: false, canManageUsers: false, canDeleteData: false, canExportReports: true };
      default:
        return { canManageFleet: false, canManageShipments: true, canViewFinancials: false, canEditSettings: false, canManageUsers: false, canDeleteData: false, canExportReports: false };
    }
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const newAcc: Account = {
      id: `USR-${Date.now()}`,
      plateNumber: 'N/A',
      driverName: newAccountData.driverName,
      driverPhone: newAccountData.driverPhone,
      username: newAccountData.username,
      password: newAccountData.password,
      assignedDistrict: newAccountData.assignedDistrict,
      capacity: 500,
      currentLoad: 0,
      totalCodCollected: 0,
      status: 'Active',
      role: newAccountData.role,
      permissions: defaultPermissions(newAccountData.role),
      location: { lat: 21.5, lng: 39.2 },
      efficiencyScore: 100
    };
    onAddTruck(newAcc);
    setIsCreateModalOpen(false);
  };

  const togglePermission = (account: Account, perm: keyof AppPermissions) => {
    const updated = {
      ...account,
      permissions: {
        ...account.permissions,
        [perm]: !account.permissions[perm]
      }
    };
    onUpdateTruck(updated);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
             <div className="bg-slate-900 p-3 rounded-2xl text-white shadow-xl shadow-slate-200">
               <ShieldCheck size={28} />
             </div>
             <h2 className="text-4xl font-black text-slate-900 tracking-tight">إدارة الصلاحيات والمستخدمين</h2>
          </div>
          <p className="text-slate-500 font-medium">تحكم كامل في مصفوفة الصلاحيات (Role-Based Access Control) لكل فرد في فريقك</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-indigo-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-sm flex items-center gap-3 shadow-2xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <UserPlus size={20} />
          إضافة عضو جديد للفريق
        </button>
      </div>

      {/* Role Cards - Quick Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { role: 'ADMIN', label: 'مديرين النظام', color: 'bg-rose-500', icon: Shield },
           { role: 'SUPERVISOR', label: 'مشرفي العمليات', color: 'bg-indigo-600', icon: Settings2 },
           { role: 'ACCOUNTANT', label: 'محاسبين', color: 'bg-emerald-500', icon: CreditCard },
           { role: 'DRIVER', label: 'مناديب ميدانيين', color: 'bg-slate-800', icon: Truck },
         ].map(item => (
           <div key={item.role} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className={`${item.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-slate-200`}>
                <item.icon size={24} />
              </div>
              <h4 className="text-sm font-black text-slate-400 uppercase mb-1">{item.label}</h4>
              <p className="text-3xl font-black text-slate-900">{trucks.filter(t => t.role === item.role).length}</p>
           </div>
         ))}
      </div>

      {/* Accounts List & Permissions Matrix */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row gap-4 justify-between items-center">
           <div className="relative w-full max-w-md">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="ابحث عن عضو فريق بالاسم أو المستخدم..."
                className="w-full pr-12 pl-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
           </div>
           <div className="flex gap-2">
              <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-colors"><Filter size={20} /></button>
              <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-colors"><Download size={20} /></button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50/50">
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">المستخدم</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">الدور الوظيفي</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">نطاق الصلاحيات</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">الحالة</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">التحكم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAccounts.map(acc => (
                <tr key={acc.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-7">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 border-2 border-white shadow-sm overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${acc.username}`} alt="" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{acc.driverName}</p>
                        <p className="text-[10px] text-slate-400 font-bold">@{acc.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-7">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black border ${
                      acc.role === 'ADMIN' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                      acc.role === 'SUPERVISOR' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                      acc.role === 'ACCOUNTANT' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                      {acc.role === 'ADMIN' ? 'مدير نظام' : 
                       acc.role === 'SUPERVISOR' ? 'مشرف عمليات' :
                       acc.role === 'ACCOUNTANT' ? 'محاسب مالي' : 'مندوب توصيل'}
                    </span>
                  </td>
                  <td className="px-8 py-7">
                    <div className="flex gap-1.5">
                       {Object.entries(acc.permissions).map(([key, value]) => (
                         <div 
                           key={key}
                           onClick={() => togglePermission(acc, key as keyof AppPermissions)}
                           className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all hover:scale-150 ${value ? 'bg-emerald-500 shadow-lg shadow-emerald-200' : 'bg-slate-200'}`}
                           title={`${key}: ${value ? 'مفعل' : 'معطل'}`}
                         />
                       ))}
                    </div>
                    <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase tracking-tight">إجمالي الصلاحيات: {Object.values(acc.permissions).filter(Boolean).length}</p>
                  </td>
                  <td className="px-8 py-7">
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${acc.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                       <span className="text-xs font-black text-slate-700">{acc.status === 'Active' ? 'نشط' : 'معطل'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-7">
                    <div className="flex items-center justify-center gap-2">
                       <button 
                        onClick={() => setEditingAccount(acc)}
                        className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                       >
                         <Settings2 size={16} />
                       </button>
                       <button 
                        onClick={() => onDeleteTruck(acc.id)}
                        className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account Settings / Permission Matrix Modal */}
      {editingAccount && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setEditingAccount(null)} />
          <div className="relative bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                   <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg"><Shield size={24} /></div>
                   <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">تعديل مصفوفة الصلاحيات</h3>
                      <p className="text-slate-500 font-bold text-sm">المستخدم: {editingAccount.driverName} (@{editingAccount.username})</p>
                   </div>
                </div>
                <button onClick={() => setEditingAccount(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
                   <X size={28} className="text-slate-400" />
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Visual Permissions List */}
                <div className="space-y-4">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">الوصول للوحدات الرئيسية</p>
                   {[
                     { key: 'canManageFleet', label: 'إدارة أسطول الشاحنات', icon: Truck },
                     { key: 'canManageShipments', label: 'إدارة الشحنات والعمليات', icon: Package },
                     { key: 'canViewFinancials', label: 'الاطلاع على التحصيل المالي', icon: CreditCard },
                     { key: 'canExportReports', label: 'تصدير التقارير والإحصائيات', icon: BarChart3 },
                   ].map(item => (
                     <label key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-indigo-50/50 transition-colors group">
                        <div className="flex items-center gap-3">
                           <item.icon size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                           <span className="text-sm font-bold text-slate-700">{item.label}</span>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={editingAccount.permissions[item.key as keyof AppPermissions]} 
                          onChange={() => togglePermission(editingAccount, item.key as keyof AppPermissions)}
                          className="w-5 h-5 rounded-lg accent-indigo-600"
                        />
                     </label>
                   ))}
                </div>

                <div className="space-y-4">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">صلاحيات إدارية متقدمة</p>
                   {[
                     { key: 'canManageUsers', label: 'إدارة المستخدمين والأدوار', icon: Users },
                     { key: 'canEditSettings', label: 'تعديل إعدادات النظام العامة', icon: Settings2 },
                     { key: 'canDeleteData', label: 'حذف البيانات (شحنات/سائقين)', icon: Trash2 },
                   ].map(item => (
                     <label key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-rose-50/50 transition-colors group">
                        <div className="flex items-center gap-3">
                           <item.icon size={18} className="text-slate-400 group-hover:text-rose-600 transition-colors" />
                           <span className="text-sm font-bold text-slate-700">{item.label}</span>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={editingAccount.permissions[item.key as keyof AppPermissions]} 
                          onChange={() => togglePermission(editingAccount, item.key as keyof AppPermissions)}
                          className="w-5 h-5 rounded-lg accent-rose-600"
                        />
                     </label>
                   ))}
                   
                   <div className="mt-8 p-6 bg-slate-900 rounded-[2rem] text-white">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">تأمين الحساب</p>
                      <button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2">
                        <Key size={14} />
                        تصفير كلمة المرور
                      </button>
                   </div>
                </div>
             </div>

             <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end gap-4">
                <button 
                  onClick={() => setEditingAccount(null)}
                  className="bg-slate-900 text-white px-12 py-4 rounded-[1.5rem] font-black text-lg shadow-xl shadow-slate-200 hover:bg-black transition-all"
                >
                  حفظ الصلاحيات المحدثة
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Create Account Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsCreateModalOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-12 animate-in slide-in-from-bottom duration-300">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">إضافة فرد جديد للفريق</h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
                   <X size={28} className="text-slate-400" />
                </button>
             </div>
             
             <form onSubmit={handleCreateAccount} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">الاسم الكامل</label>
                  <input required type="text" className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-sm font-black focus:bg-white focus:border-indigo-600 outline-none transition-all" 
                    onChange={(e) => setNewAccountData({...newAccountData, driverName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">الدور الوظيفي</label>
                  <select className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-sm font-black focus:bg-white focus:border-indigo-600 outline-none transition-all cursor-pointer" 
                    onChange={(e) => setNewAccountData({...newAccountData, role: e.target.value as UserRole})}>
                    <option value="DRIVER">مندوب توصيل</option>
                    <option value="ACCOUNTANT">محاسب مالي</option>
                    <option value="SUPERVISOR">مشرف عمليات</option>
                    <option value="ADMIN">مدير نظام</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">اسم المستخدم</label>
                  <input required type="text" className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-sm font-black focus:bg-white focus:border-indigo-600 outline-none transition-all" 
                    onChange={(e) => setNewAccountData({...newAccountData, username: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">كلمة المرور</label>
                  <input required type="password" placeholder="••••••••" className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-sm font-black focus:bg-white focus:border-indigo-600 outline-none transition-all" 
                    onChange={(e) => setNewAccountData({...newAccountData, password: e.target.value})} />
                </div>
                
                <div className="col-span-2 pt-6">
                  <button type="submit" className="w-full bg-indigo-600 text-white py-6 rounded-[1.5rem] font-black text-xl shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                    <CheckCircle2 size={24} />
                    تأكيد الإنشاء وتفعيل الصلاحيات الافتراضية
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManager;