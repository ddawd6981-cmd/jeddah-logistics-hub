
import React, { useState } from 'react';
import { Package, Lock, User, Eye, EyeOff, ShieldCheck, Truck, ChevronRight, MessageCircle } from 'lucide-react';
import { Truck as TruckType } from '../types';

interface Props {
  onLogin: (user: any) => void;
  trucks: TruckType[];
}

const Login: React.FC<Props> = ({ onLogin, trucks }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      // Admin Login
      if (username === 'admin' && password === '123456') {
        onLogin({ id: 'ADMIN', username: 'admin', role: 'ADMIN' });
        return;
      }

      // Driver Login from Trucks List
      const driver = trucks.find(t => t.username === username && t.password === password);
      if (driver) {
        if (driver.status === 'Suspended') {
          setError('هذا الحساب موقوف حالياً، يرجى مراجعة الإدارة.');
          setLoading(false);
          return;
        }
        onLogin(driver);
      } else {
        setError('بيانات الدخول غير صحيحة، تأكد من اسم المستخدم وكلمة المرور.');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-['Cairo'] relative overflow-hidden text-slate-900">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full -mr-64 -mt-64 blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-600/5 rounded-full -ml-48 -mb-48 blur-[80px]"></div>

      <div className="flex-1 flex flex-col justify-center items-center px-10 z-10">
        <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl shadow-indigo-500/10 p-12 border border-slate-100">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="bg-slate-900 p-4 rounded-3xl text-white mb-6 shadow-xl shadow-slate-200">
              <ShieldCheck size={40} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">لوجستيك جدة</h1>
            <p className="text-slate-400 font-bold">نظام الإدارة والتشغيل الميداني</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase mr-1 tracking-widest">اسم المستخدم</label>
              <div className="relative group">
                <User className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                  required
                  type="text"
                  placeholder="اسم المستخدم أو رقم الهوية"
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pr-14 pl-5 text-sm font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center mr-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">كلمة المرور</label>
                <button type="button" className="text-[10px] font-black text-indigo-600 hover:underline">نسيت كلمة المرور؟</button>
              </div>
              <div className="relative group">
                <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pr-14 pl-14 text-sm font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-xs font-black border border-rose-100 animate-shake text-center">
                {error}
              </div>
            )}

            <button 
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-2xl shadow-slate-200 hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>تسجيل الدخول</span>
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 grid grid-cols-2 gap-4">
             <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                <ShieldCheck size={20} className="mx-auto text-indigo-600 mb-2" />
                <p className="text-[10px] font-black text-slate-400 uppercase">دخول رسمي آمن</p>
             </div>
             <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                <Truck size={20} className="mx-auto text-emerald-600 mb-2" />
                <p className="text-[10px] font-black text-slate-400 uppercase">بوابة المناديب الميدانية</p>
             </div>
          </div>
        </div>
        
        <div className="mt-8 text-slate-400 text-sm font-bold flex flex-col items-center gap-3">
          <p>تواجه مشكلة في الدخول؟</p>
          <a 
            href="https://wa.me/966538997567" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-6 py-2.5 rounded-full hover:bg-emerald-100 transition-all border border-emerald-200"
          >
            <MessageCircle size={18} />
            تحدث مع الدعم الفني عبر واتساب
          </a>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-slate-900 relative items-center justify-center p-20">
         <div className="absolute inset-0 bg-indigo-600/10"></div>
         <div className="relative z-10 text-center text-white space-y-6">
            <h2 className="text-6xl font-black leading-tight">الإدارة الرسمية <br/> الميدانية</h2>
            <p className="text-indigo-200 text-xl font-medium max-w-lg mx-auto leading-relaxed">
              نظام متكامل يربط بين المتاجر الإلكترونية (سلة وزد) وبين السائقين في الميدان بذكاء اصطناعي وتتبع لحظي.
            </p>
         </div>
      </div>
    </div>
  );
};

export default Login;
