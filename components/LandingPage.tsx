import React, { useEffect, useState } from 'react';
import { 
  Box, Zap, Truck, MapPin, 
  ChevronLeft, ArrowLeft,
  Check,
  ChevronDown,
  Globe,
  CreditCard,
  Smartphone,
  CheckCircle2,
  Navigation,
  Users,
  PackageCheck,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone
} from 'lucide-react';
import { JEDDAH_DISTRICTS } from '../constants';
import { Stats } from '../types';

interface LandingPageProps {
  onGoToLogin: () => void;
  stats: Stats;
}

const JeddahMapBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[4rem] bg-[#f0f4ff]">
    <svg viewBox="0 0 800 1200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M200 0C200 0 180 150 240 300C300 450 210 600 230 800C250 1000 190 1200 190 1200H0V0H200Z" 
        fill="#6366f1" 
        fillOpacity="0.08"
      />
      <path 
        d="M200 0C200 0 180 150 240 300C300 450 210 600 230 800C250 1000 190 1200 190 1200" 
        stroke="#6366f1" 
        strokeWidth="4" 
        strokeOpacity="0.1"
      />
      <path d="M350 0V1200" stroke="#6366f1" strokeWidth="1" strokeOpacity="0.05"/>
      <path d="M550 0V1200" stroke="#6366f1" strokeWidth="1" strokeOpacity="0.05"/>
      <path d="M750 0V1200" stroke="#6366f1" strokeWidth="1" strokeOpacity="0.05"/>
      <path d="M0 300H800M0 600H800M0 900H800" stroke="#6366f1" strokeWidth="1" strokeDasharray="10 10" strokeOpacity="0.05"/>
      <g className="font-bold select-none opacity-40">
        <text x="350" y="150" fill="#1e293b" fontSize="18" className="font-black">أبحر الشمالية</text>
        <text x="520" y="320" fill="#1e293b" fontSize="18" className="font-black">المحمدية</text>
        <text x="380" y="550" fill="#1e293b" fontSize="18" className="font-black">الروضة</text>
        <text x="580" y="780" fill="#1e293b" fontSize="18" className="font-black">حي البلد</text>
        <text x="420" y="1050" fill="#1e293b" fontSize="18" className="font-black">الخمرة</text>
      </g>
      <circle cx="450" cy="280" r="6" fill="#6366f1" className="animate-pulse" />
      <circle cx="620" cy="450" r="5" fill="#f59e0b" className="animate-pulse" />
      <circle cx="410" cy="820" r="7" fill="#6366f1" fillOpacity="0.4" />
    </svg>
  </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onGoToLogin, stats }) => {
  const [scrolled, setScrolled] = useState(false);
  const [districtIndex, setDistrictIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [activeFaqs, setActiveFaqs] = useState<Set<number>>(new Set([0]));
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const [selectedPricing, setSelectedPricing] = useState<number | null>(null);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setDistrictIndex((prev) => (prev + 1) % JEDDAH_DISTRICTS.length);
        setFade(true);
      }, 500);
    }, 4000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const handleToggleFaq = (index: number) => {
    const next = new Set(activeFaqs);
    // Fixed logic: Toggle (add if missing, delete if exists) to allow closing
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setActiveFaqs(next);
  };

  const featureData = [
    { icon: <Globe size={32} />, title: "ربط سلة وزد", desc: "استقبل طلباتك تلقائياً من متاجرك الإلكترونية بمجرد تغيير حالتها." },
    { icon: <Zap size={32} />, title: "توزيع ذكي (AI)", desc: "خوارزميات متقدمة تسند الطلبات للمناديب بناءً على الموقع والسعة." },
    { icon: <Navigation size={32} />, title: "تتبع GPS لحظي", desc: "راقب حركة الأسطول في شوارع جدة بدقة متناهية عبر الخريطة الحية." },
    { icon: <CheckCircle2 size={32} />, title: "إثبات رقمي (POD)", desc: "توثيق التسليم عبر الصورة والتوقيع والموقع الجغرافي لضمان الجودة." },
    { icon: <CreditCard size={32} />, title: "إدارة COD دقيقة", desc: "نظام محاسبي متكامل لمتابعة المبالغ المحصلة والعهد المالية لكل مندوب." },
    { icon: <Smartphone size={32} />, title: "تطبيق ميداني بسيط", desc: "واجهة سهلة للمناديب تعمل على كافة الهواتف لإنجاز المهام بسرعة." },
  ];

  return (
    <div className="min-h-screen bg-white font-['Cairo'] text-slate-900 overflow-x-hidden selection:bg-indigo-100 scroll-smooth text-right" dir="rtl">
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

            <ul className="hidden lg:flex items-center gap-8">
              {['الرئيسية', 'المميزات', 'الأسعار', 'الأسئلة الشائعة'].map((item, i) => (
                <li key={i}>
                  <a href={`#${['home', 'features', 'pricing', 'faq'][i]}`} className="text-sm font-black text-slate-500 hover:text-indigo-600 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={onGoToLogin} className="bg-slate-900 text-white px-8 lg:px-10 py-4 rounded-2xl text-sm font-black hover:bg-black elite-shadow transition-all flex items-center gap-2 group">
              دخول النظام <ChevronLeft size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-48 lg:pt-32 pb-20 bg-[#FBFDFF] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-24 items-center relative">
          
          <div className="relative z-10 space-y-12 text-right animate-in slide-in-from-right duration-1000">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl elite-shadow border border-indigo-50">
                <div className="bg-indigo-600 p-2 rounded-xl">
                  <Zap size={18} className="text-white animate-pulse" />
                </div>
                <span className="text-[12px] font-black text-indigo-900 uppercase tracking-widest">توصيل ذكي في جدة</span>
              </div>
              
              <h1 className="text-5xl lg:text-[5.5rem] font-black leading-[1.1] tracking-tighter text-slate-900">
                أدر عملياتك <br/>
                بذكاء <span className="text-indigo-600">الميدان.</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-slate-500 font-medium leading-relaxed max-w-xl">
                اربط متجرك بأسطولنا الاحترافي. نضمن وصول طرودك في <span className="text-slate-900 font-black underline decoration-indigo-200">أسرع وقت</span> لكافة أحياء جدة.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-start">
              <button onClick={onGoToLogin} className="bg-indigo-600 text-white px-12 py-6 rounded-[2.5rem] font-black text-lg shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all flex items-center justify-center gap-4 group">
                ابدأ التشغيل الآن <ArrowLeft size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center gap-4 px-6 py-4 bg-white rounded-3xl border border-slate-100 elite-shadow">
                <div className="flex -space-x-4">
                  {[1, 2, 3].map(i => (
                    <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 99}`} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100" alt="" />
                  ))}
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900">{stats.activeTrucks} مندوب نشط</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">يجوبون شوارع جدة الآن</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end animate-in zoom-in duration-1000">
            <div className="w-full max-w-[460px] aspect-[4/5.2] bg-white rounded-[4rem] p-8 lg:p-12 elite-shadow border-[12px] border-slate-50/50 overflow-hidden relative group transition-all duration-500 hover:scale-[1.02] flex flex-col">
              <JeddahMapBackground />

              <div className="relative z-20 flex items-center justify-between w-full px-2 mb-8">
                 <div className="flex flex-col items-center gap-4 w-24">
                    <div className="w-16 h-16 bg-slate-900 rounded-[1.8rem] flex items-center justify-center text-white shadow-2xl ring-4 ring-white/50">
                       <Truck size={32} />
                    </div>
                    <div className="bg-white/95 px-3 py-2.5 rounded-2xl shadow-lg border border-slate-50 text-center w-full">
                       <p className="text-[11px] font-black text-slate-900 leading-none mb-1">المندوب الميداني</p>
                       <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">نشط الآن</span>
                    </div>
                 </div>

                 <div className="flex-1 relative h-1 mx-4 flex items-center">
                    <div className="w-full h-[3px] bg-slate-200/60 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-600 rounded-full w-[40%] animate-[flowBeam_2s_linear_infinite]" />
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2.5 rounded-full shadow-xl border border-indigo-50 z-40">
                       <Zap size={16} className="text-indigo-600 animate-pulse" />
                    </div>
                 </div>

                 <div className="flex flex-col items-center gap-4 w-24">
                    <div className="w-16 h-16 bg-indigo-600 rounded-[1.8rem] flex items-center justify-center text-white shadow-2xl ring-4 ring-white/50">
                       <MapPin size={32} />
                    </div>
                    <div className={`bg-white/95 px-3 py-2.5 rounded-2xl shadow-lg border border-slate-50 text-center w-full transition-all duration-500 ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                       <p className="text-[11px] font-black text-slate-900 leading-none mb-1">حي {JEDDAH_DISTRICTS[districtIndex]}</p>
                       <p className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">{stats.avgDeliveryTime}</p>
                    </div>
                 </div>
              </div>

              <div className="relative z-30 grid grid-cols-2 gap-5 mt-auto">
                 <div className="bg-white/95 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-xl border border-white flex flex-col items-center gap-3">
                    <div className="bg-slate-900 w-12 h-12 rounded-[1.2rem] text-white flex items-center justify-center">
                      <Users size={24} />
                    </div>
                    <div className="text-center">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">المناديب</p>
                       <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{stats.activeTrucks}</p>
                    </div>
                 </div>
                 
                 <div className="bg-white/95 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-xl border border-white flex flex-col items-center gap-3">
                    <div className="bg-emerald-500 w-12 h-12 rounded-[1.2rem] text-white flex items-center justify-center">
                      <PackageCheck size={24} />
                    </div>
                    <div className="text-center">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">المسلمة</p>
                       <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{stats.deliveredToday}</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-white relative">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
            <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">كل ما تحتاجه للسيطرة على <br/><span className="text-indigo-600">عملياتك اللوجستية.</span></h2>
            <p className="text-lg text-slate-500 font-medium">نظام متكامل يغنيك عن التشتت، من لحظة استلام الطلب حتى توقيع العميل.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureData.map((f, i) => (
              <FeatureCard 
                key={i}
                icon={f.icon}
                title={f.title}
                desc={f.desc}
                index={i}
                isSelected={selectedFeature === i}
                onSelect={() => setSelectedFeature(selectedFeature === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight">خطط تناسب <span className="text-indigo-600">طموحك.</span></h2>
            <p className="text-lg text-slate-500 font-medium mt-6">شفافية تامة في الأسعار لدعم نمو تجارتك.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard 
              name="الناشئ"
              price="299"
              index={0}
              isSelected={selectedPricing === 0}
              onSelect={() => setSelectedPricing(selectedPricing === 0 ? null : 0)}
              features={["ربط متجر واحد", "تتبع لـ 5 مناديب", "دعم فني عبر البريد", "تقارير أسبوعية"]}
            />
            <PricingCard 
              name="المحترف"
              price="799"
              index={1}
              isPopular
              isSelected={selectedPricing === 1}
              onSelect={() => setSelectedPricing(selectedPricing === 1 ? null : 1)}
              features={["ربط متاجرك غير المحدود", "تتبع لـ 50 مندوب", "توزيع ذكي (AI)", "دعم فني 24/7"]}
            />
            <PricingCard 
              name="المؤسسات"
              price="تواصل"
              index={2}
              isSelected={selectedPricing === 2}
              onSelect={() => setSelectedPricing(selectedPricing === 2 ? null : 2)}
              features={["تتبع أساطيل ضخمة", "لوحة تحكم مخصصة", "تكامل API خاص", "مدير حساب مخصص"]}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-16 text-slate-900">الأسئلة الشائعة</h2>
          <div className="space-y-4">
            {[
              { q: "هل يدعم النظام الربط مع سلة وزد؟", a: "نعم، النظام مصمم للربط المباشر عبر Webhooks لاستقبال الطلبات فوراً عند تغيير حالتها في المتجر." },
              { q: "كيف يعمل تتبع المناديب؟", a: "يعتمد النظام على GPS الهاتف المباشر للمندوب لتحديث موقعه على الخريطة الإدارية كل دقيقة لضمان مراقبة حية دقيقة." },
              { q: "هل هناك عمولة على الشحنة؟", a: "لا، نحن لا نأخذ عمولات. تدفع فقط اشتراكاً شهرياً ثابتاً مهما كان عدد شحناتك، مما يساعدك على تقليل تكاليف التشغيل." },
              { q: "هل النظام مخصص لجدة فقط؟", a: "النظام مهيأ حالياً لأحياء جدة بدقة عالية وتوزيع ذكي، ولكن يمكن توسيعه ليشمل كافة مدن المملكة حسب احتياجاتكم." }
            ].map((faq, i) => (
              <div key={i} className={`border rounded-[2rem] overflow-hidden shadow-sm transition-all ${activeFaqs.has(i) ? 'ring-2 ring-indigo-500/20 shadow-lg border-indigo-200' : 'border-slate-100 hover:shadow-md'}`}>
                <button 
                  onClick={() => handleToggleFaq(i)}
                  className={`w-full flex justify-between items-center p-8 transition-all duration-300 text-right ${activeFaqs.has(i) ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 hover:bg-slate-50'}`}
                >
                  <span className="text-lg font-black">{faq.q}</span>
                  <ChevronDown className={`transition-transform duration-300 ${activeFaqs.has(i) ? 'rotate-180' : ''}`} />
                </button>
                {activeFaqs.has(i) && (
                  <div className="p-8 bg-slate-50 border-t border-slate-100 animate-in slide-in-from-top-4 duration-300">
                    <p className="text-slate-600 font-bold leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-32 pb-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-600 p-2.5 rounded-2xl">
                  <Box size={24} />
                </div>
                <span className="text-2xl font-black">لوجستيك جدة</span>
              </div>
              <p className="text-slate-400 font-medium leading-relaxed">
                الجيل القادم من أنظمة إدارة الأساطيل الميدانية في المملكة العربية السعودية.
              </p>
              <div className="flex gap-4">
                <SocialIcon icon={<Twitter size={20} />} index={0} />
                <SocialIcon icon={<Facebook size={20} />} index={1} />
                <SocialIcon icon={<Instagram size={20} />} index={2} />
                <SocialIcon icon={<Linkedin size={20} />} index={3} />
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-lg font-black text-indigo-400">روابط سريعة</h4>
              <ul className="space-y-4">
                <li><a href="#home" className="text-slate-400 hover:text-white transition-colors">الرئيسية</a></li>
                <li><a href="#features" className="text-slate-400 hover:text-white transition-colors">المميزات</a></li>
                <li><a href="#pricing" className="text-slate-400 hover:text-white transition-colors">الأسعار</a></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-lg font-black text-indigo-400">قانوني</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">سياسة الخصوصية</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">شروط الخدمة</a></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-lg font-black text-indigo-400">اتصل بنا</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-400">
                  <Mail size={18} className="text-indigo-600" />
                  contact@jeddah-logistics.com
                </li>
                <li className="flex items-center gap-3 text-slate-400">
                  <Phone size={18} className="text-indigo-600" />
                  +966 50 000 0000
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-16 text-center text-slate-500 text-sm font-bold">
            <p>© {new Date().getFullYear()} لوجستيك جدة. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes flowBeam {
          from { transform: translateX(-200%); }
          to { transform: translateX(300%); }
        }
        .reveal-item {
          transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, index, isSelected, onSelect }: { icon: React.ReactNode, title: string, desc: string, index: number, isSelected: boolean, onSelect: () => void }) => (
  <div 
    onClick={onSelect}
    className={`p-10 bg-white rounded-[3rem] border transition-all group cursor-pointer reveal-item ${isSelected ? 'border-indigo-600 shadow-2xl ring-4 ring-indigo-50 scale-[1.02]' : 'border-slate-100 hover:border-indigo-600/20 hover:shadow-2xl hover:shadow-indigo-500/10'}`}
  >
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform ${isSelected ? 'bg-indigo-600 text-white scale-110 shadow-lg' : 'bg-slate-50 text-indigo-600 group-hover:scale-110'}`}>
      {icon}
    </div>
    <h3 className="text-xl font-black text-slate-900 mb-4">{title}</h3>
    <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
  </div>
);

const PricingCard = ({ name, price, features, isPopular, index, isSelected, onSelect }: { name: string, price: string, features: string[], isPopular?: boolean, index: number, isSelected: boolean, onSelect: () => void }) => (
  <div 
    onClick={onSelect}
    className={`p-12 rounded-[4rem] border transition-all relative cursor-pointer reveal-item ${isSelected ? 'border-indigo-600 ring-8 ring-indigo-50 shadow-2xl scale-[1.07] z-20' : isPopular ? 'bg-slate-900 text-white border-slate-900 shadow-2xl scale-105 z-10' : 'bg-white text-slate-900 border-slate-100 shadow-sm hover:shadow-xl'}`}
  >
    {isPopular && <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase">الأكثر طلباً</div>}
    <div className="text-center space-y-4 mb-12">
      <h3 className={`text-xl font-black uppercase tracking-widest opacity-60`}>{name}</h3>
      <div className="flex items-end justify-center gap-1">
        <span className="text-5xl font-black tracking-tighter">{price}</span>
        {price !== "تواصل" && <span className="text-lg font-black opacity-40 mb-1">ر.س / شهر</span>}
      </div>
    </div>
    <ul className="space-y-6 mb-12">
      {features.map((f, i) => (
        <li key={i} className="flex items-center gap-4 text-sm font-bold">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isPopular || isSelected ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
            <Check size={14} />
          </div>
          {f}
        </li>
      ))}
    </ul>
    <button className={`w-full py-5 rounded-[1.5rem] font-black text-sm transition-all ${isPopular || isSelected ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-black'}`}>
      ابدأ التجربة مجاناً
    </button>
  </div>
);

const SocialIcon = ({ icon, index }: { icon: React.ReactNode, index: number }) => (
  <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all">
    {icon}
  </a>
);

export default LandingPage;