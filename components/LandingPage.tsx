
import React, { useEffect, useState } from 'react';
import { 
  Box, Zap, ShieldCheck, Truck, BarChart3, Globe, CheckCircle, 
  MessageCircle, ArrowLeft, Package, MapPin, Smartphone, 
  ChevronLeft, Star, ArrowUpRight, Play, Users, Layers, Lock,
  Shield, CreditCard, Activity, Target
} from 'lucide-react';
import { SUPPORT_PHONE } from '../constants';

interface LandingPageProps {
  onGoToLogin: () => void;
}

const SallaLogo = () => (
  <div className="flex items-center gap-3 group cursor-pointer">
    <div className="w-12 h-12 rounded-2xl bg-[#00df82] flex items-center justify-center shadow-lg shadow-[#00df82]/20 group-hover:scale-110 transition-transform">
      <svg viewBox="0 0 100 100" className="w-7 h-7 fill-white"><path d="M70 40H30C27.79 40 26 41.79 26 44V64C26 66.21 27.79 68 30 68H70C72.21 68 74 66.21 74 64V44C74 41.79 72.21 40 70 40ZM50 60C44.48 60 40 55.52 40 50C40 44.48 44.48 40 50 40C55.52 40 60 44.48 60 50C60 55.52 55.52 60 50 60Z"/></svg>
    </div>
    <span className="text-2xl font-black text-[#00df82] tracking-tighter group-hover:translate-x-1 transition-transform">سلة</span>
  </div>
);

const ZidLogo = () => (
  <div className="flex items-center gap-3 group cursor-pointer">
    <div className="w-12 h-12 rounded-2xl bg-[#7e3af2] flex items-center justify-center shadow-lg shadow-[#7e3af2]/20 text-white font-black text-xs group-hover:scale-110 transition-transform">ZID</div>
    <span className="text-2xl font-black text-[#7e3af2] tracking-tighter group-hover:translate-x-1 transition-transform">زد</span>
  </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onGoToLogin }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-['Cairo'] text-slate-900 overflow-x-hidden selection:bg-indigo-100">
      {/* Dynamic Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 lg:px-12 ${
        scrolled ? 'bg-white/80 backdrop-blur-2xl shadow-xl py-4' : 'bg-transparent py-10'
      }`}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-2xl shadow-indigo-600/30 group-hover:rotate-6 transition-all">
                <Box size={28} />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900">لوجستيك جدة</span>
            </div>
            <div className="hidden lg:flex items-center gap-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <a href="#features" className="hover:text-indigo-600 transition-colors">المميزات</a>
              <a href="#integrations" className="hover:text-indigo-600 transition-colors">الربط التقني</a>
              <a href="#support" className="hover:text-indigo-600 transition-colors">الدعم</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onGoToLogin} className="text-sm font-black text-slate-600 hover:text-indigo-600 px-6 py-3">دخول</button>
            <button onClick={onGoToLogin} className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-sm font-black hover:bg-black elite-shadow transition-all flex items-center gap-2">
              ابدأ الآن <ChevronLeft size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-64 pb-32 relative bg-[#fafbff]">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-[120px] -mr-[30%] -mt-[10%] opacity-40"></div>
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10 relative z-10">
            <div className="inline-flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl elite-shadow border border-slate-50 animate-pulse">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">تغطية ذكية لمدينة جدة 🚢</span>
            </div>
            <h1 className="text-6xl lg:text-[5.5rem] font-black leading-[1.1] tracking-tighter">
              شحن المتاجر <br/> <span className="text-gradient">بذكاء الأتمتة.</span>
            </h1>
            <p className="text-xl lg:text-2xl text-slate-500 font-medium leading-relaxed max-w-xl">نظام لوجستي متقدم يربط متجرك بـ 50 شاحنة احترافية في جدة لتوصيل طلباتك في لمح البصر.</p>
            <div className="flex flex-col sm:flex-row gap-5">
              <button onClick={onGoToLogin} className="bg-indigo-600 text-white px-12 py-6 rounded-[1.8rem] font-black text-xl shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all hover:-translate-y-1 flex items-center justify-center gap-4 group">
                اربط متجرك الآن <ArrowLeft size={24} className="group-hover:-translate-x-2 transition-transform" />
              </button>
              <button className="bg-white border border-slate-100 text-slate-700 px-10 py-6 rounded-[1.8rem] font-black text-xl hover:border-indigo-600 transition-all shadow-sm flex items-center justify-center gap-3">
                شاهد الفيديو <Play size={20} className="fill-current" />
              </button>
            </div>

            {/* Elite Trust Section */}
            <div className="flex items-center gap-10 pt-10">
               <div className="flex -space-x-4">
                  {['Aidan', 'Jordan', 'Alex', 'Avery'].map((seed, i) => (
                    <div key={i} className="w-14 h-14 rounded-2xl border-4 border-white bg-slate-50 overflow-hidden elite-shadow transform hover:-translate-y-2 transition-transform">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=c0aede`} alt="User" />
                    </div>
                  ))}
                  <div className="w-14 h-14 rounded-2xl border-4 border-white bg-slate-900 text-white flex items-center justify-center text-[10px] font-black shadow-xl">+300</div>
               </div>
               <div className="space-y-1">
                  <div className="flex text-amber-400 gap-0.5"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">تجار يثقون بلوجستيك جدة</p>
               </div>
            </div>
          </div>
          
          <div className="relative">
             <div className="relative z-10 w-full aspect-[9/11] bg-white p-4 rounded-[4rem] elite-shadow border border-slate-50 overflow-hidden floating-anim">
                <img src="https://images.unsplash.com/photo-1580674684081-7617fbf3d745?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover rounded-[3.5rem]" alt="Logistics" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
             </div>
             <div className="absolute -right-8 top-1/4 z-20 glass-card p-6 rounded-[2.5rem] elite-shadow flex items-center gap-4 animate-bounce">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white"><CheckCircle size={24} /></div>
                <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">توصيل ناجح</p><p className="text-sm font-black text-slate-800">حي المحمدية، جدة</p></div>
             </div>
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="py-24 bg-white border-y border-slate-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center items-center gap-16 md:gap-32">
           <SallaLogo />
           <ZidLogo />
           <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100 cursor-pointer">
              <Globe size={32} className="text-indigo-600" />
              <span className="text-2xl font-black text-slate-800 tracking-tighter">Shopify</span>
           </div>
           <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100 cursor-pointer">
              <Layers size={32} className="text-slate-400" />
              <span className="text-2xl font-black text-slate-800 tracking-tighter">Magento</span>
           </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-32 space-y-6">
             <h2 className="text-5xl lg:text-7xl font-black tracking-tighter">حلول <span className="text-indigo-600">نخبوية</span> <br/> لنمو تجارتك.</h2>
             <p className="text-xl text-slate-500 font-medium">كل ما تحتاجه لإدارة أسطولك وشحناتك في شاشة واحدة متطورة.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'الربط الآلي', desc: 'مزامنة فورية مع سلة وزد عبر الويب هوك لاستقبال الطلبات لحظة حدوثها.', icon: Zap, bg: 'bg-indigo-50', color: 'text-indigo-600' },
              { title: 'أسطول احترافي', desc: 'إدارة 50 شاحنة مجهزة بنظام تتبع GPS وتوزيع ذكي للمهام حسب الحي.', icon: Truck, bg: 'bg-emerald-50', color: 'text-emerald-600' },
              { title: 'تقارير ذكية', desc: 'تحليلات أداء يومية للمناديب ونسب التحصيل المالي المباشر بدقة 100%.', icon: BarChart3, bg: 'bg-rose-50', color: 'text-rose-600' }
            ].map((f, i) => (
              <div key={i} className="p-12 rounded-[3.5rem] bg-slate-50 border border-transparent hover:bg-white hover:border-slate-100 hover:shadow-2xl transition-all duration-500 group">
                 <div className={`${f.bg} ${f.color} w-20 h-20 rounded-[1.8rem] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform`}><f.icon size={36} /></div>
                 <h3 className="text-3xl font-black text-slate-900 mb-6">{f.title}</h3>
                 <p className="text-lg text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="support" className="bg-slate-900 text-white pt-32 pb-16">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-20 mb-32">
           <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center gap-4">
                 <div className="bg-indigo-600 p-3 rounded-2xl"><Box size={32} /></div>
                 <span className="text-3xl font-black tracking-tighter">لوجستيك جدة</span>
              </div>
              <p className="text-slate-400 text-xl max-w-md leading-relaxed">نظام شحن متكامل مصمم لنخبة التجار في مدينة جدة، بربط مباشر وتتبع لحظي ذكي.</p>
           </div>
           <div className="space-y-8">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">التواصل</h4>
              <p className="text-2xl font-black">{SUPPORT_PHONE}</p>
              <p className="text-slate-400 text-sm">حي الروضة، طريق صاري، جدة</p>
           </div>
           <div className="space-y-8">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">الدعم</h4>
              <button className="flex items-center gap-2 text-indigo-400 font-black hover:text-white transition-colors">
                <MessageCircle size={20} /> واتساب العمليات
              </button>
           </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-6 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">
           <p>© {new Date().getFullYear()} لوجستيك جدة. جميع الحقوق محفوظة.</p>
           <p className="flex items-center gap-2">بنيت لخدمة تجارة جدة 🇸🇦</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
