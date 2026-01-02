
import React, { useEffect, useState } from 'react';
import { 
  Box, Zap, ShieldCheck, 
  Truck, BarChart3, Globe, CheckCircle, 
  MessageCircle, ArrowLeft,
  Package, MapPin, Smartphone, ChevronLeft,
  Star, ArrowUpRight, Play, Users, 
  Layers, Lock
} from 'lucide-react';
import { SUPPORT_PHONE } from '../constants';

interface LandingPageProps {
  onGoToLogin: () => void;
}

const SallaLogo = () => (
  <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer">
    <div className="w-12 h-12 rounded-2xl bg-[#00df82] flex items-center justify-center shadow-lg shadow-[#00df82]/20">
      <svg viewBox="0 0 100 100" className="w-7 h-7 fill-white"><path d="M70 40H30C27.79 40 26 41.79 26 44V64C26 66.21 27.79 68 30 68H70C72.21 68 74 66.21 74 64V44C74 41.79 72.21 40 70 40ZM50 60C44.48 60 40 55.52 40 50C40 44.48 44.48 40 50 40C55.52 40 60 44.48 60 50C60 55.52 55.52 60 50 60Z"/></svg>
    </div>
    <span className="text-2xl font-black text-[#00df82] tracking-tighter">سلة</span>
  </div>
);

const ZidLogo = () => (
  <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer">
    <div className="w-12 h-12 rounded-2xl bg-[#7e3af2] flex items-center justify-center shadow-lg shadow-[#7e3af2]/20 text-white font-black text-xs">
      ZID
    </div>
    <span className="text-2xl font-black text-[#7e3af2] tracking-tighter">زد</span>
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
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-6 lg:px-12 ${
        scrolled ? 'bg-white/80 backdrop-blur-2xl shadow-xl py-4' : 'bg-transparent py-10'
      }`}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-2xl shadow-indigo-600/30 group-hover:rotate-12 transition-all">
                <Box size={28} />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900">لوجستيك جدة</span>
            </div>
            
            <div className="hidden lg:flex items-center gap-8 text-[13px] font-black text-slate-400 uppercase tracking-widest">
              <a href="#features" className="hover:text-indigo-600 transition-colors">المميزات</a>
              <a href="#integrations" className="hover:text-indigo-600 transition-colors">الربط التقني</a>
              <a href="#support" className="hover:text-indigo-600 transition-colors">الدعم</a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={onGoToLogin} className="text-sm font-black text-slate-600 hover:text-indigo-600 px-6 py-3 rounded-xl transition-all">دخول</button>
            <button onClick={onGoToLogin} className="bg-slate-900 text-white px-10 py-4.5 rounded-[1.4rem] text-sm font-black hover:bg-black shadow-2xl shadow-slate-200 transition-all flex items-center gap-3">
              ابدأ الآن
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-56 lg:pt-64 pb-32 relative overflow-hidden bg-[#fafbff]">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-[120px] -mr-[30%] -mt-[10%] opacity-60"></div>
        
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10 relative z-10 animate-in slide-in-from-right duration-1000">
            <div className="inline-flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100 pulse-soft">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">تغطية كاملة لمدينة جدة 🚢</span>
            </div>

            <h1 className="text-6xl lg:text-[6rem] font-black leading-[1.1] text-slate-900 tracking-tighter">
              بوابة الشحن <br/>
              <span className="gradient-text">الأذكى في جدة.</span>
            </h1>

            <p className="text-xl lg:text-2xl text-slate-500 font-medium leading-relaxed max-w-xl">
              نظام لوجستي متكامل يربط متجرك بأسطول من 50 شاحنة احترافية للتوصيل الميل الأخير في غضون ساعات.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <button onClick={onGoToLogin} className="bg-indigo-600 text-white px-12 py-7 rounded-[2rem] font-black text-xl shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all hover:-translate-y-1.5 flex items-center justify-center gap-4 group">
                اربط متجرك الآن
                <ArrowLeft size={24} className="group-hover:-translate-x-2 transition-transform" />
              </button>
              <button className="bg-white border-2 border-slate-100 text-slate-700 px-10 py-7 rounded-[2rem] font-black text-xl hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-4 shadow-sm">
                شاهد العرض
                <Play size={20} className="fill-current" />
              </button>
            </div>

            {/* Trusted By Section (Fixed & Professional) */}
            <div className="flex items-center gap-12 pt-10">
               <div className="flex -space-x-4 space-x-reverse">
                  {['Felix', 'Aidan', 'Jordan', 'Alex'].map((seed, i) => (
                    <div key={i} className="w-14 h-14 rounded-2xl border-4 border-white bg-slate-100 overflow-hidden shadow-xl transform hover:-translate-y-2 transition-transform duration-500">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4`} alt="Merchant" />
                    </div>
                  ))}
                  <div className="w-14 h-14 rounded-2xl border-4 border-white bg-slate-900 text-white flex items-center justify-center text-xs font-black shadow-xl">+250</div>
               </div>
               <div className="space-y-2">
                  <div className="flex text-amber-400 gap-1">
                    {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">تجار ومتاجر يثقون بلوجستيك جدة</p>
               </div>
            </div>
          </div>
          
          <div className="relative animate-in zoom-in duration-1000 delay-200">
             <div className="relative z-10 w-full max-w-[550px] aspect-[10/12] bg-white p-4 rounded-[4.5rem] shadow-2xl border border-slate-50 overflow-hidden floating-anim">
                <img 
                  src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2075&auto=format&fit=crop" 
                  className="w-full h-full object-cover rounded-[4rem]"
                  alt="Delivery Truck"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-12 right-12 text-white">
                   <p className="text-4xl font-black tracking-tighter">10,000+</p>
                   <p className="text-sm font-black text-indigo-300 uppercase tracking-widest">شحنة شهرياً</p>
                </div>
             </div>

             {/* Dynamic Floating Elements */}
             <div className="absolute -right-8 top-1/4 z-20 glass-card p-6 rounded-[2.5rem] shadow-2xl flex items-center gap-4 animate-bounce-slow">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                   <CheckCircle size={24} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">توصيل ناجح</p>
                   <p className="text-sm font-black text-slate-800">حي الشاطئ، جدة</p>
                </div>
             </div>

             <div className="absolute -left-12 bottom-1/4 z-20 bg-slate-900 p-8 rounded-[3rem] shadow-2xl border border-white/10 flex items-center gap-6">
                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white relative">
                   <Truck size={32} />
                   <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-slate-900 animate-pulse"></div>
                </div>
                <div className="text-white">
                   <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">الأسطول الميداني</p>
                   <p className="text-xl font-black">50 شاحنة نشطة</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Partners Logos Section */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-16">منصات متصلة بالويب هوك الخاص بنا</p>
          <div className="flex flex-wrap justify-center items-center gap-16 md:gap-32">
             <SallaLogo />
             <ZidLogo />
             <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer">
                <Globe className="text-indigo-600" size={32} />
                <span className="text-2xl font-black text-slate-800 tracking-tighter">Shopify</span>
             </div>
             <div className="text-2xl font-black text-slate-400 flex items-center gap-2 grayscale cursor-pointer">
                <Layers size={24} />
                Magento
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-40 relative bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-32 space-y-6">
             <h2 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter">حلول ذكية <br/> <span className="text-indigo-600">لعملياتك اللوجستية.</span></h2>
             <p className="text-xl text-slate-500 font-medium">كل ما تحتاجه لإدارة شحناتك في منصة واحدة متطورة تدعم أتمتة كاملة.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: 'مزامنة الويب هوك', 
                desc: 'استقبل الطلبات من سلة وزد لحظة حدوثها ووزعها تلقائياً على السائقين الأقرب.',
                icon: Zap,
                bg: 'bg-indigo-50',
                color: 'text-indigo-600'
              },
              { 
                title: 'إدارة 50 شاحنة', 
                desc: 'نظام إسناد ذكي (Smart Dispatching) يوزع 500 شحنة يومياً على 50 مندوب باحترافية.',
                icon: Truck,
                bg: 'bg-emerald-50',
                color: 'text-emerald-600'
              },
              { 
                title: 'تتبع لحظي دقيق', 
                desc: 'شاهد تحركات الأسطول في أحياء جدة لحظة بلحظة وراقب أداء كل مندوب بدقة.',
                icon: MapPin,
                bg: 'bg-rose-50',
                color: 'text-rose-600'
              }
            ].map((f, i) => (
              <div key={i} className="p-12 rounded-[3.5rem] bg-white border border-slate-100 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 group cursor-pointer hover:-translate-y-2">
                 <div className={`${f.bg} ${f.color} w-20 h-20 rounded-[1.8rem] flex items-center justify-center mb-10 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                    <f.icon size={36} />
                 </div>
                 <h3 className="text-3xl font-black text-slate-900 mb-6">{f.title}</h3>
                 <p className="text-lg text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                 <div className="mt-10 flex items-center gap-2 text-indigo-600 text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                   استكشف الميزة <ArrowUpRight size={16} />
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-32 px-6">
         <div className="max-w-7xl mx-auto bg-slate-900 rounded-[4rem] p-16 lg:p-32 relative overflow-hidden text-center text-white">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full -mr-[10%] -mt-[10%]"></div>
            <div className="relative z-10 space-y-12">
               <h2 className="text-5xl lg:text-7xl font-black tracking-tighter">جاهز لنقل تجارتك <br/> للمستوى التالي؟</h2>
               <p className="text-xl lg:text-2xl text-slate-400 font-medium max-w-2xl mx-auto">انضم لأكثر من 250 تاجر في جدة يستخدمون "لوجستيك جدة" لإدارة شحناتهم يومياً.</p>
               <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <button onClick={onGoToLogin} className="bg-white text-slate-900 px-14 py-7 rounded-[2rem] font-black text-xl hover:bg-indigo-50 transition-all shadow-2xl active:scale-95">ابدأ مجاناً اليوم</button>
                  <button className="bg-white/10 text-white px-14 py-7 rounded-[2rem] font-black text-xl border border-white/10 hover:bg-white/20 transition-all">تواصل مع الدعم</button>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer id="support" className="bg-white pt-32 pb-16 border-t border-slate-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-20 mb-32">
            <div className="lg:col-span-2 space-y-10">
               <div className="flex items-center gap-4">
                  <div className="bg-slate-900 p-3 rounded-2xl text-white"><Box size={32} /></div>
                  <span className="text-3xl font-black tracking-tighter">لوجستيك جدة</span>
               </div>
               <p className="text-slate-500 text-xl font-medium max-w-md leading-relaxed">
                  نظام شحن متطور صمم خصيصاً ليناسب احتياجات السوق في مدينة جدة، بربط مباشر وتوزيع أسطول ذكي.
               </p>
               <div className="flex gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer"><Globe size={24} /></div>
                  <div className="bg-slate-50 p-4 rounded-2xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer"><MessageCircle size={24} /></div>
               </div>
            </div>
            
            <div className="space-y-10">
               <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">روابط سريعة</h4>
               <ul className="space-y-6 text-slate-500 font-bold">
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">المميزات</a></li>
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">الأسطول</a></li>
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">الربط التقني</a></li>
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">اتفاقية الخدمة</a></li>
               </ul>
            </div>

            <div className="space-y-10">
               <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">تواصل معنا</h4>
               <div className="space-y-8">
                  <div>
                     <p className="text-slate-400 text-[10px] font-black uppercase mb-1">واتساب العمليات</p>
                     <p className="text-xl font-black text-slate-900">{SUPPORT_PHONE}</p>
                  </div>
                  <div>
                     <p className="text-slate-400 text-[10px] font-black uppercase mb-1">المقر الرئيسي</p>
                     <p className="text-xl font-black text-slate-900">حي الروضة، طريق صاري، جدة</p>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="pt-16 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
             <p>© {new Date().getFullYear()} JEDDAH LOGISTICS HUB. حقوق الطبع محفوظة.</p>
             <p className="flex items-center gap-2">صنع بحب لأجل تجارة جدة 🇸🇦</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
