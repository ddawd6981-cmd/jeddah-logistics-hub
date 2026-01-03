
import React, { useEffect, useState } from 'react';
import { 
  Box, Zap, Truck, MapPin, 
  ChevronLeft, Star, ArrowLeft,
  CheckCircle, Smartphone, Activity, Wind,
  MousePointer2, Globe, ShieldCheck
} from 'lucide-react';
import { JEDDAH_DISTRICTS } from '../constants';

interface LandingPageProps {
  onGoToLogin: () => void;
}

const CAPTAINS = ['أحمد م.', 'خالد ع.', 'عمر س.', 'فهد ن.', 'إبراهيم و.', 'سلطان ق.'];
const DELIVERY_STATUSES = ['جاري الاستلام', 'في الطريق للعميل', 'وصل لموقع التوصيل', 'جاري فحص الشحنة'];

const LandingPage: React.FC<LandingPageProps> = ({ onGoToLogin }) => {
  const [scrolled, setScrolled] = useState(false);
  const [districtIndex, setDistrictIndex] = useState(0);
  const [captainIndex, setCaptainIndex] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [deliveryCount, setDeliveryCount] = useState(1420);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // محاكاة حية للعمليات على الخريطة
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setDistrictIndex((prev) => (prev + 1) % JEDDAH_DISTRICTS.length);
        setCaptainIndex((prev) => (prev + 1) % CAPTAINS.length);
        setStatusIndex((prev) => (prev + 1) % DELIVERY_STATUSES.length);
        setDeliveryCount(prev => prev + Math.floor(Math.random() * 2) + 1);
        setFade(true);
      }, 500);
    }, 4500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white font-['Cairo'] text-slate-900 overflow-x-hidden selection:bg-indigo-100">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-6 lg:px-12 ${
        scrolled ? 'bg-white/90 backdrop-blur-2xl shadow-xl py-4' : 'bg-transparent py-8'
      }`}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-2xl shadow-indigo-600/30 group-hover:rotate-6 transition-all">
                <Box size={28} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-slate-900 leading-none">لوجستيك جدة</span>
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">Jeddah Logistics Hub</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 lg:gap-8">
            <nav className="hidden lg:flex items-center gap-8">
              {['الرئيسية', 'المميزات', 'المناطق', 'الربط البرمجي'].map((item, i) => (
                <a key={i} href="#" className="text-sm font-black text-slate-500 hover:text-indigo-600 transition-colors">{item}</a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <button onClick={onGoToLogin} className="hidden sm:block text-sm font-black text-slate-600 hover:text-indigo-600 px-6 py-3 transition-colors">تسجيل دخول</button>
              <button onClick={onGoToLogin} className="bg-slate-900 text-white px-8 lg:px-10 py-4 rounded-2xl text-sm font-black hover:bg-black elite-shadow transition-all flex items-center gap-2 group">
                إبدأ الآن <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-48 lg:pt-24 bg-[#FBFDFF] overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-indigo-50/50 rounded-full blur-[120px] -mr-[20%] -mt-[10%] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-emerald-50/30 rounded-full blur-[120px] -ml-[20%] -mb-[10%] pointer-events-none"></div>
        
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Content */}
          <div className="relative z-10 space-y-12 order-2 lg:order-1 text-center lg:text-right animate-in fade-in slide-in-from-right-10 duration-1000 pt-16 lg:pt-0">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl elite-shadow border border-indigo-50">
                <div className="bg-indigo-600 p-2 rounded-xl">
                  <Zap size={18} className="text-white animate-pulse" />
                </div>
                <span className="text-[12px] font-black text-indigo-900 uppercase tracking-widest">التوصيل الفوري الأسرع في جدة</span>
              </div>
              
              <h1 className="text-5xl lg:text-[5.5rem] font-black leading-[1.1] tracking-tighter text-slate-900">
                مستقبلك اللوجستي <br/>
                يبدأ في <span className="text-indigo-600">جدة.</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-slate-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                اربط متجرك بأسطولنا المكون من 50 مندوباً محترفاً يجوبون شوارع جدة الآن. نضمن وصول طلباتك في <span className="text-slate-900 font-black underline decoration-indigo-200">أقل من 60 دقيقة</span>.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <button onClick={onGoToLogin} className="bg-indigo-600 text-white px-12 py-6 rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-4">
                توصيل شحنتك الأولى <ArrowLeft size={24} />
              </button>
              <button className="bg-white text-slate-900 border-2 border-slate-100 px-10 py-6 rounded-[2rem] font-black text-lg hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-3">
                <Smartphone size={22} /> تحميل التطبيق
              </button>
            </div>

            <div className="flex items-center gap-10 justify-center lg:justify-start pt-4">
              <div className="flex -space-x-4 space-x-reverse">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} className="w-12 h-12 rounded-full border-4 border-white shadow-sm" alt="client" />
                ))}
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-slate-900">انضم لـ +500 متجر في جدة</p>
                <div className="flex items-center gap-1 mt-1">
                  {[1,2,3,4,5].map(i => <Star key={i} size={12} className="text-amber-400 fill-current" />)}
                  <span className="text-[10px] font-black text-slate-400 mr-2">تقييم 4.9/5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Side (Jeddah Map Dynamic Operations) */}
          <div className="relative order-1 lg:order-2 animate-in fade-in slide-in-from-left-10 duration-1000">
             {/* Map Container */}
             <div className="relative bg-white rounded-[4rem] p-4 elite-shadow border border-slate-100 w-full max-w-[550px] mx-auto group">
                <div className="relative h-[620px] w-full rounded-[3.5rem] overflow-hidden bg-slate-900 shadow-inner">
                   {/* Digital Map Background */}
                   <div className="absolute inset-0 opacity-40">
                     <img 
                      src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1000&auto=format&fit=crop" 
                      className="w-full h-full object-cover grayscale contrast-125 brightness-50 scale-110" 
                      alt="Digital Map" 
                    />
                   </div>
                  
                  {/* Digital Grid & HUD Overlay */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none" style={{backgroundImage: 'radial-gradient(#6366f1 1.5px, transparent 1.5px)', backgroundSize: '40px 40px'}}></div>
                  <div className="absolute inset-0 border-[20px] border-indigo-500/5 pointer-events-none rounded-[3.5rem]"></div>

                  {/* Active Dynamic Delivery Simulation */}
                  <div className="absolute inset-0">
                     {/* Dynamic Points that represent active deliveries */}
                     <div className="absolute top-[25%] right-[20%] transition-opacity duration-1000">
                        <div className="w-4 h-4 bg-indigo-500 rounded-full animate-ping absolute"></div>
                        <div className="w-4 h-4 bg-indigo-600 rounded-full relative shadow-lg shadow-indigo-600/50"></div>
                     </div>

                     <div className="absolute bottom-[30%] left-[25%] transition-opacity duration-1000">
                        <div className="w-4 h-4 bg-emerald-500 rounded-full animate-ping absolute"></div>
                        <div className="w-4 h-4 bg-emerald-600 rounded-full relative shadow-lg shadow-emerald-600/50"></div>
                     </div>
                     
                     {/* Moving Asset / Captain Status */}
                     <div className={`absolute top-[40%] left-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-700 transform ${fade ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}>
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20 shadow-2xl flex flex-col items-center gap-3 min-w-[200px]">
                           <div className="bg-indigo-600 p-4 rounded-2xl shadow-xl shadow-indigo-600/30">
                              <Truck size={38} className="text-white" />
                           </div>
                           <div className="text-center">
                              <p className="text-[9px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-1">كابتن نشط الآن</p>
                              <p className="text-lg font-black text-white">{CAPTAINS[captainIndex]}</p>
                              <div className="flex items-center justify-center gap-2 mt-2">
                                 <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                                 <span className="text-[10px] font-bold text-emerald-400">{DELIVERY_STATUSES[statusIndex]}</span>
                              </div>
                           </div>
                        </div>
                        <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent"></div>
                        <div className="bg-indigo-600 px-4 py-2 rounded-xl text-[11px] font-black text-white shadow-xl">حي {JEDDAH_DISTRICTS[districtIndex]}</div>
                     </div>

                     {/* Stats Overlay on Map Footer */}
                     <div className="absolute bottom-10 left-10 right-10 flex justify-between gap-4">
                        <div className="flex-1 bg-white/5 backdrop-blur-lg border border-white/10 p-5 rounded-[2rem] text-center">
                           <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">مناديب أونلاين</p>
                           <p className="text-2xl font-black text-white">48</p>
                        </div>
                        <div className="flex-1 bg-white/5 backdrop-blur-lg border border-white/10 p-5 rounded-[2rem] text-center">
                           <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">عمليات جارية</p>
                           <p className="text-2xl font-black text-white">{120 + deliveryCount}</p>
                        </div>
                     </div>
                  </div>
                </div>
                
                {/* Floating Elements - FIXED VISIBILITY */}
                {/* Successful Delivery Notification - Cycles Districts */}
                <div className={`absolute top-12 left-10 right-10 z-20 transition-all duration-1000 transform ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
                   <div className="bg-white/95 backdrop-blur-xl border border-white/50 p-6 rounded-[2.5rem] elite-shadow flex items-center gap-5">
                      <div className="bg-emerald-500 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-emerald-500/40">
                         <CheckCircle size={34} />
                      </div>
                      <div className="text-right flex-1">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">آخر عملية توصيل ناجحة</p>
                         <h4 className="text-xl font-black text-slate-900 tracking-tight">حي {JEDDAH_DISTRICTS[districtIndex]}</h4>
                         <div className="flex items-center gap-2 mt-1">
                            <Activity size={12} className="text-emerald-500" />
                            <p className="text-[10px] text-emerald-600 font-black">تم التوصيل بواسطة الكابتن {CAPTAINS[captainIndex]}</p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Instant Badge Floating - ADJUSTED FOR FULL VISIBILITY */}
                <div className="absolute bottom-40 -right-12 z-30 transition-transform hover:scale-105 duration-300">
                   <div className="bg-slate-900 p-7 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col items-center gap-3 transform rotate-2">
                      <div className="bg-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/40">
                         <Wind size={28} className="animate-pulse" />
                      </div>
                      <div className="text-center px-4">
                         <p className="text-[11px] font-black text-indigo-300 uppercase tracking-[0.3em] mb-1">توصيل فوري</p>
                         <p className="text-3xl font-black text-white leading-none">60 <span className="text-sm font-bold text-slate-400">دقيقة</span></p>
                      </div>
                   </div>
                </div>

                {/* Mouse Interaction Mock */}
                <div className="absolute top-1/2 left-1/4 z-10 pointer-events-none opacity-50">
                    <MousePointer2 size={24} className="text-white fill-indigo-600 animate-bounce" />
                </div>
             </div>

             {/* Background Decoration */}
             <div className="absolute -z-10 -bottom-20 -left-20 w-80 h-80 bg-indigo-100/50 rounded-full blur-[100px]"></div>
             <div className="absolute -z-10 -top-20 -right-20 w-80 h-80 bg-emerald-100/50 rounded-full blur-[100px]"></div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-24 bg-white relative overflow-hidden border-y border-slate-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-right">
           <div className="flex flex-col gap-2">
              <span className="text-6xl font-black text-slate-900">50+</span>
              <span className="text-sm font-black text-indigo-600 uppercase tracking-widest">مندوب توصيل محترف في جدة</span>
           </div>
           <div className="w-px h-20 bg-slate-100 hidden md:block"></div>
           <div className="flex flex-col gap-2">
              <span className="text-6xl font-black text-slate-900">100%</span>
              <span className="text-sm font-black text-indigo-600 uppercase tracking-widest">تغطية كافة أحياء جدة السكنية</span>
           </div>
           <div className="w-px h-20 bg-slate-100 hidden md:block"></div>
           <div className="flex flex-col gap-2">
              <span className="text-6xl font-black text-slate-900">1h</span>
              <span className="text-sm font-black text-indigo-600 uppercase tracking-widest">الحد الأقصى للتوصيل الفوري</span>
           </div>
        </div>
      </section>

      {/* Detailed Features */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter text-slate-900 leading-tight">شريكك اللوجستي الذكي في جدة</h2>
            <p className="text-xl text-slate-500 font-medium">نحن لا نوصل الطرود فحسب، نحن نبني تجربة استلام مبهرة لعملائك تزيد من ولاءهم لعلامتك التجارية.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: 'ربط سلة وزد الاحترافي', 
                desc: 'تكامل كامل مع API سلة وزد. استقبل الطلبات تلقائياً فور تأكيدها في متجرك دون أي تدخل يدوي.', 
                icon: Globe, color: 'text-indigo-600', bg: 'bg-indigo-100/50' 
              },
              { 
                title: 'التوزيع الذكي (AI Dispatch)', 
                desc: 'نظامنا يوزع الطلبات تلقائياً على أقرب كابتن متاح في الحي لضمان أقل وقت انتظار ممكن.', 
                icon: Zap, color: 'text-amber-600', bg: 'bg-amber-100/50' 
              },
              { 
                title: 'إثبات رقمي (POD)', 
                desc: 'تصوير الطرد وتوقيع العميل رقمياً عند الاستلام، مع إرسال رسالة فورية للمتجر بتأكيد التوصيل.', 
                icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-100/50' 
              }
            ].map((f, i) => (
              <div key={i} className="bg-white p-12 rounded-[3.5rem] elite-shadow border border-slate-50 hover:-translate-y-2 transition-all group">
                <div className={`${f.bg} w-16 h-16 rounded-2xl flex items-center justify-center ${f.color} mb-10 group-hover:rotate-12 transition-transform`}>
                  <f.icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-6">{f.title}</h3>
                <p className="text-slate-500 font-bold leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jeddah Coverage Map Promo */}
      <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[100px] rounded-full -mr-48 -mt-48"></div>
         <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 space-y-10 order-2 lg:order-1 text-right">
               <div className="space-y-6">
                  <h2 className="text-4xl lg:text-7xl font-black tracking-tighter leading-tight">نغطي كل شبر <br/> في <span className="text-indigo-400">مدينة جدة</span></h2>
                  <p className="text-xl text-slate-400 font-medium">من أبحر شمالاً إلى الخمرة جنوباً، ومن الكورنيش غرباً إلى الحرازات شرقاً. مناديبنا متواجدون في كل زاوية لخدمتكم.</p>
               </div>
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <p className="text-4xl font-black">100+</p>
                     <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">حي مغطى بالكامل</p>
                  </div>
                  <div className="space-y-2">
                     <p className="text-4xl font-black">24/7</p>
                     <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">دعم فني ميداني</p>
                  </div>
               </div>
               <button className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-lg hover:bg-indigo-50 transition-all flex items-center gap-3">
                  عرض خريطة التغطية <MapPin size={20} />
               </button>
            </div>
            <div className="flex-1 order-1 lg:order-2">
               <img 
                 src="https://images.unsplash.com/photo-1544413660-299165566b1d?q=80&w=1000&auto=format&fit=crop" 
                 className="w-full rounded-[3rem] shadow-2xl rotate-3 scale-110 opacity-80" 
                 alt="Jeddah Night Cityscape" 
               />
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 relative">
          <div className="bg-indigo-600 rounded-[4rem] p-12 lg:p-24 text-white text-center relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(79,70,229,0.3)]">
            <div className="relative z-10 space-y-10">
              <h2 className="text-4xl lg:text-7xl font-black tracking-tighter leading-tight">هل أنت مستعد لتطوير <br/> لوجستيات متجرك؟</h2>
              <p className="text-xl lg:text-2xl text-indigo-100 font-medium max-w-2xl mx-auto">ابدأ اليوم مع لوجستيك جدة واستمتع بأتمتة كاملة لشحناتك مع أسرع خدمة توصيل ميدانية.</p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button onClick={onGoToLogin} className="bg-white text-indigo-600 px-14 py-6 rounded-[2rem] font-black text-xl hover:bg-indigo-50 hover:-translate-y-1 transition-all shadow-2xl flex items-center gap-4">
                  إنشاء حساب مجاناً <ChevronLeft size={24} />
                </button>
                <button className="bg-indigo-700/50 text-white border border-white/20 px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-indigo-800/60 transition-all">
                  تحدث مع مبيعاتنا
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 pt-32 pb-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24 text-right">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-xl shadow-indigo-600/20">
                <Box size={24} />
              </div>
              <span className="text-2xl font-black tracking-tighter">لوجستيك جدة</span>
            </div>
            <p className="text-slate-500 font-bold leading-relaxed">
              الخيار الأول للمتاجر الذكية في مدينة جدة. تقنية متقدمة، سرعة فائقة، وأمان تام لشحناتك.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-black text-slate-900 mb-8">عن المنصة</h4>
            <ul className="space-y-4">
              {['الرئيسية', 'المميزات', 'المناطق المغطاة', 'الأسعار', 'الربط البرمجي'].map(item => (
                <li key={item}><a href="#" className="text-slate-500 font-bold hover:text-indigo-600 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-black text-slate-900 mb-8">الدعم والمساعدة</h4>
            <ul className="space-y-4">
              {['مركز المساعدة', 'الأسئلة الشائعة', 'تواصل معنا', 'سياسة الخصوصية'].map(item => (
                <li key={item}><a href="#" className="text-slate-500 font-bold hover:text-indigo-600 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-black text-slate-900 mb-8">تواصل معنا</h4>
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-slate-500">
                <MapPin size={20} className="text-indigo-600" />
                <span className="font-bold">برج طريق الملك، جدة، المملكة العربية السعودية</span>
              </div>
              <div className="flex items-center gap-4 text-slate-500">
                <Smartphone size={20} className="text-indigo-600" />
                <span className="font-bold">+966 538 997 567</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-16 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-right">
          <p className="text-slate-400 font-bold">© 2025 لوجستيك جدة. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-8">
            <span className="text-slate-400 font-bold text-sm">صُنع بكل فخر في جدة 🇸🇦</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
