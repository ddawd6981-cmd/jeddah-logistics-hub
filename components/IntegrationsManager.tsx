
import React from 'react';
import { Link as LinkIcon, Check, Copy, ExternalLink, Zap } from 'lucide-react';

const IntegrationsManager: React.FC = () => {
  return (
    <div className="max-w-4xl space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">الربط البرمجي (Webhooks)</h2>
        <p className="text-slate-500 mt-2">قم بربط متاجر سلة وزد لاستقبال الشحنات تلقائياً.</p>
      </div>

      <div className="grid gap-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-500 p-4 rounded-2xl">
                <img src="https://salla.sa/favicon.ico" className="w-8 h-8 filter brightness-0 invert" alt="Salla" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">منصة سلة (Salla)</h3>
                <p className="text-sm text-slate-500">متصل وجاهز لاستقبال الطلبات</p>
              </div>
            </div>
            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
              <Zap size={12} fill="currentColor" />
              نشط
            </span>
          </div>
          
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700 block">رابط الويب هوك الخاص بك</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                readOnly 
                value="https://api.jeddah-logistics.com/webhook/salla/v1/a78b9c..." 
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-500 font-mono text-sm"
              />
              <button className="bg-slate-100 hover:bg-slate-200 p-3 rounded-xl transition-colors">
                <Copy size={20} className="text-slate-600" />
              </button>
            </div>
            <p className="text-xs text-slate-400">انسخ هذا الرابط وضعه في إعدادات المطور في منصة سلة.</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="bg-purple-600 p-4 rounded-2xl">
                <img src="https://zid.sa/favicon.ico" className="w-8 h-8 filter brightness-0 invert" alt="Zid" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">منصة زد (Zid)</h3>
                <p className="text-sm text-slate-500">يتطلب الإعداد</p>
              </div>
            </div>
            <button className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-indigo-700 transition-colors">
              ربط المتجر
            </button>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden group">
          <div className="relative z-10 space-y-4">
            <h3 className="text-2xl font-bold">تحتاج لمساعدة في الربط؟</h3>
            <p className="text-slate-400 max-w-lg text-lg">
              فريقنا التقني مستعد لمساعدتك في عملية الربط والتشغيل في غضون دقائق قليلة.
            </p>
            <button className="flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
              تحدث مع الدعم الفني
              <ExternalLink size={18} />
            </button>
          </div>
          <div className="absolute -left-10 -bottom-10 opacity-10 transform -rotate-12 transition-transform group-hover:rotate-0">
             <Zap size={200} fill="white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsManager;
