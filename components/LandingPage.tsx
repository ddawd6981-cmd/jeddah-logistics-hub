
import React, { useEffect, useState } from 'react';
import { 
  Box, ArrowLeft, Zap, ShieldCheck, 
  Truck, BarChart3, Globe, CheckCircle, 
  MessageCircle, ArrowRight,
  Package, MapPin, Smartphone, ChevronLeft,
  ChevronDown, Play, Star, Shield, ArrowUpRight
} from 'lucide-react';
import { SUPPORT_PHONE } from '../constants';

interface LandingPageProps {
  onGoToLogin: () => void;
}

// Fixed Salla Logo with high-quality SVG path (Salla Green)
const SallaIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg" fill="none">
    <circle cx="50" cy="50" r="50" fill="#00df82"/>
    <path d="M70 40H30C27.79 40 26 41.79 26 44V64C26 66.21 27.79 68 30 68H70C72.21 68 74 66.21 74 64V44C74 41.79 72.21 40 70 40ZM50 60C44.48 60 40 55.52 40 50C40 44.48 44.48 40 50 40C55.52 40 60 44.48 60 50C60 55.52 55.52 60 50 60Z" fill="white"/>
  </svg>
);

const LandingPage: React.FC<LandingPageProps> = ({ onGoToLogin }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-['Cairo'] text-slate-900 overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
      {/* Premium Global Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-6 lg:px-12 ${
        scrolled ? 'bg-white/90 backdrop-blur-2xl shadow-[0_15px_50px_-15px_rgba(0,0,0,0.08)] py-4' : 'bg-transparent py-10'
      }`}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-16">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-2xl shadow-indigo-600/30 group-hover:rotate-12 transition-all duration-500">
                <Box size={28} />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900">لوجستيك جدة</span>
            </div>
            
            <div className="hidden lg:flex items-center gap-10 text-[13px] font-black text-slate-500 uppercase tracking-wider">
              <a href="#features" className="hover:text-indigo-600 transition-colors flex items-center gap-1">المميزات</a>
              <a href="#fleet" className="hover:text-indigo-600 transition-colors">أسطول جدة</a>
              <a href="#integrations" className="hover:text-indigo-600 transition-colors">الربط التقني</a>
              <a href="#support" className="hover:text-indigo-600 transition-colors">الدعم</a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={onGoToLogin}
              className="text-sm font-black text-slate-600 hover:text-indigo-600 transition-all px-6 py-3 rounded-xl hover:bg-indigo-50"
            >
              دخول التجار
            </button>
            <button 
              onClick={onGoToLogin}
              className="bg-slate-900 text-white px-10 py-4.5 rounded-[1.4rem] text-sm font-black hover:bg-black shadow-2xl shadow-slate-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3 group"
            >
              ابدأ الآن
              <div className="bg-white/10 p-1 rounded-lg">
                <ChevronLeft size={16} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - The OTO Style Experience */}
      <section className="pt-56 lg:pt-64 pb-32 relative overflow-hidden bg-[#fafbff]">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-indigo-50 rounded-full blur-[150px] -mr-[40%] -mt-[20%] opacity-70 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-emerald-50 rounded-full blur-[150px] -ml-[20%] -mb-[20%] opacity-40"></div>
        
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative z-10 space-y-10 animate-in slide-in-from-right-12 duration-1000">
            <div className="inline-flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">تغطية شاملة لجميع أحياء جدة 🇸🇦</span>
            </div>

            <h1 className="text-6xl lg:text-[6.5rem] font-black leading-[1] text-slate-900 tracking-tighter">
              نظامك الذكي <br/>
              <span className="gradient-text">لشحن بلا حدود.</span>
            </h1>

            <p className="text-xl lg:text-2xl text-slate-500 font-medium leading-relaxed max-w-xl">
              اربط متجرك بأسطول من 50 شاحنة احترافية في جدة. أتمتة كاملة لعمليات الاستلام والتوصيل عبر الويب هوك.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <button 
                onClick={onGoToLogin}
                className="bg-indigo-600 text-white px-14 py-7 rounded-[2rem] font-black text-xl shadow-[0_25px_60px_-15px_rgba(99,102,241,0.5)] hover:bg-indigo-700 transition-all hover:-translate-y-1.5 active:scale-95 flex items-center justify-center gap-4 group"
              >
                اربط متجرك الآن
                <ArrowLeft size={28} className="group-hover:-translate-x-2 transition-transform duration-500" />
              </button>
              <button className="bg-white border-2 border-slate-100 text-slate-700 px-12 py-7 rounded-[2rem] font-black text-xl hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-4 group shadow-sm">
                تحدث مع المبيعات
                <div className="bg-slate-50 p-2 rounded-full group-hover:bg-indigo-50 transition-colors">
                   <MessageCircle size={20} />
                </div>
              </button>
            </div>

            <div className="flex items-center gap-10 pt-10">
               <div className="flex -space-x-4 space-x-reverse">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-sm">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}&top=shortHair`} alt="User" />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-4 border-white bg-slate-900 text-white flex items-center justify-center text-xs font-black shadow-sm">+250</div>
               </div>
               <div className="space-y-1">
                  <div className="flex text-amber-400">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">تجار يثقون في لوجستيك جدة</p>
               </div>
            </div>
          </div>
          
          <div className="relative animate-in zoom-in-95 duration-1000 delay-200">
             {/* Main Hero Image Context */}
             <div className="relative z-10 w-full max-w-[550px] aspect-[9/11] bg-white p-4 rounded-[4.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-50 overflow-hidden transform hover:rotate-1 transition-transform duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" 
                  className="w-full h-full object-cover rounded-[4rem]"
                  alt="Logistics Fleet"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
             </div>

             {/* Floating Info Cards (OTO Style) */}
             <div className="absolute -right-10 top-20 z-20 glass-card p-7 rounded-[2.5rem] shadow-2xl flex items-center gap-5 animate-float border border-white/40">
                <div className="bg-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
                  <CheckCircle size={28} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">توصيل ناجح</p>
                   <p className="text-base font-black text-slate-900">حي المرجان - جدة</p>
                </div>
             </div>

             <div className="absolute -left-12 bottom-24 z-20 bg-slate-900 p-8 rounded-[3rem] shadow-2xl border border-white/10 flex items-center gap-6 animate-float-delayed">
                <div className="relative">
                   <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center text-white">
                      <Truck size={32} />
                   </div>
                   <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-slate-900 animate-pulse"></div>
                </div>
                <div className="text-white">
                   <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">الأسطول النشط</p>
                   <p className="text-xl font-black tracking-tight">50 شاحنة احترافية</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Trust & Integration Bar - Fixed Logos */}
      <section className="py-24 border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-16">منصات التجارة المتصلة بنا</p>
          <div className="flex flex-wrap justify-center items-center gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
             <div className="flex items-center gap-3">
                <SallaIcon className="w-12 h-12" />
                <span className="text-3xl font-black text-[#00df82] tracking-tighter">سلة</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="text-4xl font-black text-slate-900 tracking-tighter">ZID</div>
                <span className="text-xl font-bold text-slate-400 uppercase">زد</span>
             </div>
             <div className="text-3xl font-black text-slate-800 flex items-center gap-2">
                <Globe className="text-indigo-600" />
                Shopify
             </div>
             <div className="text-3xl font-black text-slate-700">Magento</div>
          </div>
        </div>
      </section>

      {/* Features Grid - The Elite Experience */}
      <section id="features" className="py-40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-32 space-y-6">
            <h2 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter">حلول ذكية لنمو <br/> <span className="text-indigo-600">تجارتك في جدة.</span></h2>
            <p className="text-xl text-slate-500 font-medium">نوفر لك البنية التحتية اللوجستية التي تمنح عملاءك تجربة توصيل عالمية في غضون ساعات.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { 
                title: 'مزامنة الويب هوك', 
                desc: 'اربط متجرك في سلة أو زد، واستقبل الطلبات في لوحة تحكمك فور حدوثها في المتجر وبدقة 100%.',
                icon: Zap,
                color: 'bg-indigo-50 text-indigo-600'
              },
              { 
                title: 'توزيع حي للأسطول', 
                desc: 'خوارزمية ذكية توزع الشحنات على 50 شاحنة بناءً على الحي الجغرافي لضمان أسرع وقت وصول.',
                icon: MapPin,
                color: 'bg-rose-50 text-rose-600'
              },
              { 
                title: 'إثبات التوصيل الرقمي', 
                desc: 'توقيع إلكتروني، تصوير الطرد، وتوثيق الموقع الجغرافي لكل شحنة يتم تسليمها للعميل.',
                icon: Smartphone,
                color: 'bg-emerald-50 text-emerald-600'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-14 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 group cursor-pointer hover:-translate-y-2">
                <div className={`${feature.color} w-20 h-20 rounded-[1.8rem] flex items-center justify-center mb-10 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                   <feature.icon size={36} />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-6">{feature.title}</h3>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                <div className="mt-10 flex items-center gap-2 text-indigo-600 text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                  استكشف المزيد <ArrowUpRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Elite */}
      <footer id="support" className="bg-slate-900 pt-32 pb-16 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[130px] rounded-full -mr-[10%] -mt-[10%]"></div>
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-20 mb-32">
            <div className="lg:col-span-2 space-y-12">
               <div className="flex items-center gap-4">
                 <div className="bg-indigo-600 p-3 rounded-2xl text-white">
                   <Box size={32} />
                 </div>
                 <span className="text-4xl font-black tracking-tighter">لوجستيك جدة</span>
               </div>
               <p className="text-slate-400 text-xl max-w-md font-medium leading-relaxed">
                 نقود التحول الرقمي في خدمات اللوجستيك بجدة، لنمنح تجارنا القوة التي يحتاجونها للنمو والتميز.
               </p>
               <div className="flex gap-6">
                  <a href="#" className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-indigo-600 transition-all border border-white/5"><Globe size={24} /></a>
                  <a href={`https://wa.me/${SUPPORT_PHONE.replace('+', '')}`} className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-emerald-600 transition-all border border-white/5"><MessageCircle size={24} /></a>
               </div>
            </div>
            
            <div className="space-y-10">
              <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">المنصة</h4>
              <ul className="space-y-6 text-slate-300 font-bold text-lg">
                <li><a href="#" className="hover:text-white transition-colors">عن لوجستيك جدة</a></li>
                <li><a href="#" className="hover:text-white transition-colors">الربط مع سلة</a></li>
                <li><a href="#" className="hover:text-white transition-colors">الربط مع زد</a></li>
                <li><a href="#" className="hover:text-white transition-colors">اتفاقية الخدمة</a></li>
              </ul>
            </div>

            <div className="space-y-10">
              <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">تواصل معنا</h4>
              <div className="space-y-8">
                 <div>
                    <p className="text-slate-500 text-xs font-black mb-2 uppercase tracking-widest">المقر الرئيسي</p>
                    <p className="text-slate-200 font-black text-xl">حي الروضة، برج الأعمال، جدة</p>
                 </div>
                 <div>
                    <p className="text-slate-500 text-xs font-black mb-2 uppercase tracking-widest">الدعم الفني</p>
                    <p className="text-indigo-400 font-black text-3xl">{SUPPORT_PHONE}</p>
                 </div>
                 <button 
                  onClick={onGoToLogin}
                  className="bg-white text-slate-900 w-full py-6 rounded-3xl font-black text-xl hover:bg-indigo-50 transition-all shadow-2xl active:scale-95"
                 >
                   تسجيل الدخول للنظام
                 </button>
              </div>
            </div>
          </div>
          
          <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
             <p>© {new Date().getFullYear()} JEDDAH LOGISTICS HUB. جميع الحقوق محفوظة.</p>
             <p className="flex items-center gap-2">
                MADE WITH ❤️ FOR JEDDAH BUSINESS
             </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
