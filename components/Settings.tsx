
import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, Bell, Shield, Map, 
  Globe, Clock, DollarSign, Database, Save,
  RefreshCw, CheckCircle2
} from 'lucide-react';

const Settings: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl space-y-10 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">إعدادات النظام</h2>
          <p className="text-slate-500 mt-2 font-medium">تخصيص قواعد العمل، التنبيهات، وبوابات الربط</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm flex items-center gap-3 shadow-2xl shadow-slate-200 hover:bg-black transition-all active:scale-95 disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="animate-spin" size={20} /> : saveSuccess ? <CheckCircle2 size={20} /> : <Save size={20} />}
          {isSaving ? 'جاري الحفظ...' : saveSuccess ? 'تم الحفظ بنجاح' : 'حفظ التغييرات'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
               <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600"><Clock size={24} /></div>
               <h3 className="text-xl font-black text-slate-900">معايير التشغيل</h3>
            </div>
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">وقت التوصيل المستهدف (دقيقة)</label>
                  <input type="number" defaultValue={120} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-sm font-bold focus:border-indigo-600 transition-all outline-none" />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">الحد الأقصى لمحاولات الاتصال</label>
                  <input type="number" defaultValue={3} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-sm font-bold focus:border-indigo-600 transition-all outline-none" />
               </div>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
               <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600"><DollarSign size={24} /></div>
               <h3 className="text-xl font-black text-slate-900">الأسعار والمالية</h3>
            </div>
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">رسوم التوصيل الافتراضية (ريال)</label>
                  <input type="number" defaultValue={25} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-sm font-bold focus:border-indigo-600 transition-all outline-none" />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">عمولة المندوب لكل طلب</label>
                  <input type="number" defaultValue={5} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-sm font-bold focus:border-indigo-600 transition-all outline-none" />
               </div>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
               <div className="bg-rose-50 p-3 rounded-2xl text-rose-600"><Bell size={24} /></div>
               <h3 className="text-xl font-black text-slate-900">نظام التنبيهات</h3>
            </div>
            <div className="space-y-4">
               <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer">
                  <span className="text-sm font-bold text-slate-700">تنبيهات المتجر عند استلام الطلب</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-600" />
               </label>
               <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer">
                  <span className="text-sm font-bold text-slate-700">إشعار العميل عبر WhatsApp عند الخروج للتوصيل</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-600" />
               </label>
               <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer">
                  <span className="text-sm font-bold text-slate-700">تنبيه المشرف عند تأخر الشحنة عن ساعتين</span>
                  <input type="checkbox" className="w-5 h-5 accent-indigo-600" />
               </label>
            </div>
         </div>

         <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] relative overflow-hidden group border border-slate-800">
            <div className="relative z-10 space-y-6">
               <div className="flex items-center gap-4">
                  <div className="bg-indigo-600 p-3 rounded-2xl text-white"><Database size={24} /></div>
                  <h3 className="text-xl font-black">نسخ احتياطي واستعادة</h3>
               </div>
               <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  يتم حفظ بياناتك تلقائياً في السحابة كل 5 دقائق. يمكنك أيضاً تحميل نسخة يدوية من قاعدة البيانات الحالية.
               </p>
               <div className="flex gap-4">
                  <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-black text-xs hover:bg-indigo-50 transition-all">تحميل النسخة</button>
                  <button className="bg-white/10 text-white px-6 py-3 rounded-xl font-black text-xs border border-white/10 hover:bg-white/20 transition-all">استعادة بيانات</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Settings;
