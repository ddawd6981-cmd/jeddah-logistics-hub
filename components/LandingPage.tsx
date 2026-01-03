
import React, { useEffect, useState, useRef } from 'react';
import { 
  Box, Zap, Truck, MapPin, 
  ChevronLeft, ArrowLeft,
  Activity, Wind, Check,
  Shield, 
  MessageCircle,
  Clock,
  ShieldCheck,
  ChevronDown,
  Star,
  Globe,
  LayoutDashboard,
  Timer,
  ChevronUp,
  CreditCard,
  Target,
  Smartphone
} from 'lucide-react';
import { JEDDAH_DISTRICTS } from '../constants';

interface LandingPageProps {
  onGoToLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGoToLogin }) => {
  const [scrolled, setScrolled] = useState(false);
  const [districtIndex, setDistrictIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  
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

  const navLinks = [
    { name: 'الرئيسية', href: '#home' },
    { name: 'المميزات', href: '#features' },
    { name: 'الأسعار', href: '#pricing' },
    { name: 'الأسئلة الشائعة', href: '#faq' },
  ];

  const pricingPlans = [
    { 
      name: 'باقة التجربة', 
      price: '25', 
      desc: 'للمتاجر الناشئة والطلبات المحدودة', 
      features: ['توصيل خلال 3 ساعات', 'دعم فني عبر واتساب', 'تتبع حي أساسي', 'تقارير أسبوعية'],
      icon: <Box className="text-slate-400" />
    },
    { 
      name: 'باقة النمو', 
      price: '19', 
      desc: 'الخيار الأمثل للمتاجر المتوسطة', 
      features: ['توصيل فوري خلال 60 دقيقة', 'ربط Webhook كامل (سلة/زد)', 'إثبات POD رقمي بالصورة', 'دعم فني 24/7'], 
      popular: true,
      icon: <Zap className="text-white" />
    },
    { 
      name: 'باقة المؤسسات', 
      price: '15', 
      desc: 'حلول مخصصة للكميات الكبيرة', 
      features: ['مدير حساب تقني مخصص', 'توزيع جغرافي ذكي', 'تقارير أداء تحليلية', 'أولوية في التوزيع'],
      icon: <Shield className="text-indigo-600" />
    },
  ];

  const faqs = [
    { q: 'ما هي المناطق التي تغطيها الخدمة؟', a: 'نغطي حالياً كافة أحياء مدينة جدة من أبحر الشمالية وحتى الخمرة جنوباً، مع خطط توسع قريبة لمكة والمدينة.' },
    { q: 'هل النظام يدعم الربط مع سلة وزد؟', a: 'نعم، نوفر ربطاً مباشراً وتلقائياً عبر Webhooks يستقبل الطلبات فور تغيير حالتها في متجرك دون تدخل يدوي.' },
    { q: 'كيف أضمن تحصيل مبالغ الـ COD؟', a: 'النظام يوفر محفظة رقمية لكل مندوب، ويتم تتبع المبالغ المحصلة لحظياً مع تقارير يومية للمطابقة المالية.' },
    { q: 'هل هناك حد أدنى للشحنات؟', a: 'لا يوجد حد أدنى، باقة التجربة تتيح لك شحن طلب واحد فقط، بينما توفر باقات الأعمال أسعاراً تنافسية للكميات.' }
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offset = 100;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white font-['Cairo'] text-slate-900 overflow-x-hidden selection:bg-indigo-100 scroll-smooth">
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
              <div className="flex flex-col text-right">
                <span className="text-2xl font-black tracking-tighter text-slate-900 leading-none">لوجستيك جدة</span>
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">Jeddah Logistics Hub</span>
              </div>
            </div>

            <ul className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="text-sm font-black text-slate-500 hover:text-indigo-600 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={onGoToLogin} className="bg-slate-900 text-white px-8 lg:px-10 py-4 rounded-2xl text-sm font-black hover:bg-black elite-shadow transition-all flex items-center gap-2 group">
              دخول النظام <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-48 lg:pt-24 bg-[#FBFDFF] overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative">
          
          <div className="relative z-10 space-y-12 order-2 lg:order-1 text-center lg:text-right">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl elite-shadow border border-indigo-50">
                <div className="bg-indigo-600 p-2 rounded-xl">
                  <Zap size={18} className="text-white animate-pulse" />
                </div>
                <span className="text-[12px] font-black text-indigo-900 uppercase tracking-widest">توصيل في أقل من 60 دقيقة</span>
              </div>
              
              <h1 className="text-5xl lg:text-[5.5rem] font-black leading-[1.1] tracking-tighter text-slate-900">
                أدر عملياتك <br/>
                بذكاء <span className="text-indigo-600">الميدان.</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-slate-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                اربط متجرك بأسطولنا الاحترافي. نضمن وصول طرودك في <span className="text-slate-900 font-black underline decoration-indigo-200">أسرع وقت</span> لكافة أحياء جدة.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <button onClick={onGoToLogin} className="bg-indigo-600 text-white px-12 py-6 rounded-[2.5rem] font-black text-lg shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all flex items-center justify-center gap-4 group">
                ابدأ التشغيل الآن <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center gap-4 px-6 py-4 bg-white rounded-3xl border border-slate-100 elite-shadow">
                <div className="flex -space-x-4 rtl:space-x-reverse">
                  {[1,2,3].map(i => (
                    <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100" alt="" />
                  ))}
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-slate-900">50+ مندوب نشط</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">يجوبون شوارع جدة الآن</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="relative aspect-square w-full max-w-xl mx-auto">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
              
              {/* Animated Connection Visual */}
              <div className="relative z-20 h-full w-full flex items-center justify-center">
                <div className="w-full h-full relative flex items-center justify-around">
                  
                  {/* Driver Side */}
                  <div className="flex flex-col items-center gap-6 group">
                    <div className="w-32 h-32 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl transition-transform group-hover:scale-110">
                      <Truck size={56} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="bg-white px-6 py-3 rounded-2xl elite-shadow border border-slate-50 text-center">
                       <p className="text-xs font-black text-slate-900">الكابتن</p>
                       <p className="text-[10px] font-bold text-emerald-500">متاح للإرسال</p>
                    </div>
                  </div>

                  {/* Animated Connecting Line */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-px">
                    <svg width="100%" height="20" viewBox="0 0 100 20" fill="none" preserveAspectRatio="none">
                      <path d="M0 10 H100" stroke="#6366f1" strokeWidth="2" strokeDasharray="6 6">
                        <animate attributeName="stroke-dashoffset" from="0" to="-12" dur="1s" repeatCount="indefinite" />
                      </path>
                      <circle cx="50" cy="10" r="4" fill="#6366f1">
                        <animate attributeName="cx" from="0" to="100" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
                      </circle>
                    </svg>
                  </div>

                  {/* District Side */}
                  <div className="flex flex-col items-center gap-6 group">
                    <div className="w-32 h-32 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl transition-transform group-hover:scale-110 relative">
                      <MapPin size={56} />
                      <div className="absolute -top-4 -right-4 bg-white p-3 rounded-2xl elite-shadow animate-bounce">
                        <Timer size={24} className="text-indigo-600" />
                      </div>
                    </div>
                    <div className={`bg-white px-6 py-3 rounded-2xl elite-shadow border border-slate-50 text-center transition-all duration-500 ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                       <p className="text-xs font-black text-slate-900">حي {JEDDAH_DISTRICTS[districtIndex]}</p>
                       <p className="text-[10px] font-bold text-indigo-600">60 دقيقة توصيل</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-white relative">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">قوة التكنولوجيا في خدمة اللوجستيات</h2>
            <p className="text-lg text-slate-500 font-medium">طورنا نظاماً يجمع بين بساطة الاستخدام وقوة الأتمتة لضمان كفاءة تشغيلية بنسبة 100%.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Globe size={32} />, title: "ربط تقني فوري", desc: "تكامل مباشر مع منصات سلة وزد لاستيراد الطلبات تلقائياً وبدء التوصيل فوراً." },
              { icon: <Target size={32} />, title: "توزيع ذكي (AI)", desc: "خوارزمية متطورة توزع الطلبات على أقرب مندوب متاح حسب السعة والحي الجغرافي." },
              { icon: <Smartphone size={32} />, title: "تطبيق المناديب", desc: "واجهة احترافية للسائقين لإدارة المهام، توثيق الوصول، وتصوير إثبات الاستلام." },
              { icon: <CreditCard size={32} />, title: "تحصيل مالي دقيق", desc: "نظام محفظة ذكي يتتبع المبالغ المحصلة (COD) ويصدر تقارير مطابقة يومية للمحاسبة." },
              { icon: <Activity size={32} />, title: "تتبع لحظي", desc: "خريطة حية تتيح لك مراقبة تحركات 50 شاحنة في شوارع جدة بكل دقة." },
              { icon: <ShieldCheck size={32} />, title: "أمان وموثوقية", desc: "نظام صلاحيات متقدم يضمن خصوصية البيانات وأمان المبالغ النقدية المحصلة." },
            ].map((f, i) => (
              <div key={i} className="p-10 bg-[#FBFDFF] rounded-[3rem] border border-slate-100 hover:border-indigo-200 transition-all group">
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center text-indigo-600 elite-shadow mb-8 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4">{f.title}</h3>
                <p className="text-slate-500 font-bold leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full -mr-64 -mt-64 blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-600/5 rounded-full -ml-48 -mb-48 blur-[100px]"></div>
        
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight">باقات تناسب نمو تجارتك</h2>
            <p className="text-lg text-slate-400 font-medium">أسعار شفافة وعادلة، تدفع فقط مقابل ما تشحن.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, i) => (
              <div key={i} className={`relative p-12 rounded-[3.5rem] border transition-all ${
                plan.popular ? 'bg-indigo-600 border-indigo-500 scale-105 shadow-2xl' : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white text-indigo-600 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                    الأكثر طلباً
                  </div>
                )}
                
                <div className="mb-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${plan.popular ? 'bg-white/20' : 'bg-white/5'}`}>
                    {plan.icon}
                  </div>
                  <h3 className={`text-2xl font-black mb-2 ${plan.popular ? 'text-white' : 'text-slate-200'}`}>{plan.name}</h3>
                  <p className={`text-sm font-bold ${plan.popular ? 'text-indigo-100' : 'text-slate-500'}`}>{plan.desc}</p>
                </div>

                <div className="mb-10">
                  <div className="flex items-end gap-2">
                    <span className={`text-5xl font-black tracking-tighter ${plan.popular ? 'text-white' : 'text-white'}`}>{plan.price}</span>
                    <span className={`text-sm font-black mb-2 uppercase ${plan.popular ? 'text-indigo-200' : 'text-slate-500'}`}>ر.س / شحنة</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-12">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.popular ? 'bg-indigo-400' : 'bg-white/10'}`}>
                        <Check size={12} className="text-white" />
                      </div>
                      <span className={`text-sm font-bold ${plan.popular ? 'text-indigo-50' : 'text-slate-300'}`}>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={onGoToLogin}
                  className={`w-full py-5 rounded-2xl font-black transition-all ${
                  plan.popular ? 'bg-white text-indigo-600 hover:bg-indigo-50 shadow-xl' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                }`}>
                  ابدأ مع هذه الباقة
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">الأسئلة الشائعة</h2>
            <p className="text-lg text-slate-500 font-medium">كل ما تحتاج لمعرفته حول خدماتنا اللوجستية في جدة.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((item, i) => (
              <div key={i} className={`rounded-[2rem] border-2 transition-all overflow-hidden ${openFaq === i ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-50 bg-[#FBFDFF] hover:border-slate-200'}`}>
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-8 py-7 flex items-center justify-between text-right"
                >
                  <span className="text-lg font-black text-slate-900">{item.q}</span>
                  <div className={`p-2 rounded-xl transition-all ${openFaq === i ? 'bg-indigo-600 text-white rotate-180' : 'bg-slate-100 text-slate-400'}`}>
                    <ChevronDown size={20} />
                  </div>
                </button>
                {openFaq === i && (
                  <div className="px-8 pb-8 animate-in slide-in-from-top-4 duration-300">
                    <p className="text-slate-500 font-bold leading-relaxed text-lg">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-[1400px] mx-auto bg-slate-900 rounded-[4rem] p-12 lg:p-24 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="relative z-10 text-center max-w-4xl mx-auto space-y-10">
            <h2 className="text-4xl lg:text-7xl font-black text-white leading-tight">جاهز لتسريع <br/> عمليات التوصيل لديك؟</h2>
            <p className="text-xl text-slate-400 font-medium leading-relaxed">انضم لأكثر من 200 متجر إلكتروني يثقون في لوجستيك جدة لإدارة شحناتهم الميدانية.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <button onClick={onGoToLogin} className="bg-indigo-600 text-white px-12 py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all flex items-center justify-center gap-4 group">
                سجل الآن مجاناً <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <a href="https://wa.me/966538997567" className="bg-white/10 text-white px-12 py-6 rounded-[2rem] font-black text-xl border border-white/10 hover:bg-white/20 transition-all flex items-center justify-center gap-4">
                تواصل مع المبيعات <MessageCircle size={24} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-50 bg-[#FBFDFF]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-slate-900 p-2.5 rounded-2xl text-white">
                <Box size={24} />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tighter">لوجستيك جدة</span>
            </div>
            <p className="text-slate-500 font-bold leading-relaxed">أول نظام لوجستي ذكي مخصص حصرياً لمدينة جدة لخدمة قطاع المتاجر الإلكترونية بأسطول ميداني احترافي.</p>
            <div className="flex gap-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all cursor-pointer">
                   <div className="w-4 h-4 bg-current rounded-sm"></div>
                 </div>
               ))}
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">روابط سريعة</h4>
            <ul className="space-y-4">
              {navLinks.map(link => (
                <li key={link.name}><a href={link.href} onClick={(e) => scrollToSection(e, link.href)} className="text-slate-600 font-black hover:text-indigo-600 transition-colors">{link.name}</a></li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">الدعم والمساعدة</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-600 font-black hover:text-indigo-600 transition-colors">مركز المساعدة</a></li>
              <li><a href="#" className="text-slate-600 font-black hover:text-indigo-600 transition-colors">دليل استخدام النظام</a></li>
              <li><a href="#" className="text-slate-600 font-black hover:text-indigo-600 transition-colors">الربط البرمجي API</a></li>
              <li><a href="#" className="text-slate-600 font-black hover:text-indigo-600 transition-colors">سياسة الخصوصية</a></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">تواصل معنا</h4>
            <div className="space-y-4 text-slate-600 font-black">
              <p>حي المحمدية، طريق الأمير سلطان</p>
              <p>جدة، المملكة العربية السعودية</p>
              <p dir="ltr" className="text-right hover:text-indigo-600 cursor-pointer">+966 538 997 567</p>
              <p className="hover:text-indigo-600 cursor-pointer">hi@jeddah-logistics.com</p>
            </div>
          </div>
        </div>
        
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mt-20 pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm font-bold text-slate-400">© {new Date().getFullYear()} لوجستيك جدة. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-8">
             <img src="https://salla.sa/favicon.ico" className="h-6 grayscale opacity-30" alt="Salla" />
             <img src="https://zid.sa/favicon.ico" className="h-6 grayscale opacity-30" alt="Zid" />
             <div className="flex items-center gap-2 text-slate-300 font-black text-[10px] uppercase">
                <Shield size={14} />
                بيانات مشفرة وآمنة
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
