
import React, { useEffect, useState } from 'react';
import { 
  Box, Zap, Truck, MapPin, 
  ChevronLeft, Star, ArrowLeft,
  CheckCircle, Smartphone, Activity, Wind,
  MousePointer2, Globe, ShieldCheck, Code,
  Link as LinkIcon, Server, Database, Layers,
  CheckCircle2, Search, Smartphone as PhoneIcon,
  Clock, Shield, LayoutDashboard, Send
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
  const [districtSearch, setDistrictSearch] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setDistrictIndex((prev) => (prev + 1) % JEDDAH_DISTRICTS.length);
        setCaptainIndex((prev) => (prev + 1) % CAPTAINS.length);
        setStatusIndex((prev) => (prev + 1) % DELIVERY_STATUSES.length);
        setFade(true);
      }, 500);
    }, 4500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const filteredDistricts = JEDDAH_DISTRICTS.filter(d => d.includes(districtSearch));

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
            <div className="hidden lg:flex items-center gap-8">
              <button onClick={() => scrollToSection('features')} className="text-sm font-black text-slate-500 hover:text-indigo-600 transition-colors">المميزات</button>
              <button onClick={() => scrollToSection('districts')} className="text-sm font-black text-slate-500 hover:text-indigo-600 transition-colors">المناطق</button>
              <button onClick={() => scrollToSection('integration')} className="text-sm font-black text-slate-500 hover:text-indigo-600 transition-colors">الربط البرمجي</button>
            </div>
          </div>
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="flex items-center gap-3">
              <button onClick={onGoToLogin} className="hidden sm:block text-sm font-black text-slate-600 hover:text-indigo-600 px-6 py-3 transition-colors">دخول النظام</button>
              <button onClick={onGoToLogin} className="bg-slate-900 text-white px-8 lg:px-10 py-4 rounded-2xl text-sm font-black hover:bg-black elite-shadow transition-all flex items-center gap-2 group">
                إبدأ الآن <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-48 lg:pt-24 bg-[#FBFDFF] overflow-hidden">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-indigo-50/50 rounded-full blur-[120px] -mr-[20%] -mt-[10%] pointer-events-none"></div>
        
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <div className="relative z-10 space-y-12 order-2 lg:order-1 text-center lg:text-right animate-in fade-in slide-in-from-right-10 duration-1000 pt-16 lg:pt-0">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl elite-shadow border border-indigo-50">
                <div className="bg-indigo-600 p-2 rounded-xl">
                  <Zap size={18} className="text-white animate-pulse" />
                </div>
                <span className="text-[12px] font-black text-indigo-900 uppercase tracking-widest">الأسرع في جدة - توصيل في أقل من ساعة</span>
              </div>
              
              <h1 className="text-5xl lg:text-[5.5rem] font-black leading-[1.1] tracking-tighter text-slate-900">
                مستقبلك اللوجستي <br/>
                يبدأ في <span className="text-indigo-600">جدة.</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-slate-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                اربط متجرك بأسطولنا الاحترافي. نضمن وصول طرودك في <span className="text-slate-900 font-black underline decoration-indigo-200">أقل من 60 دقيقة</span> لكافة أحياء جدة.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <button onClick={onGoToLogin} className="bg-indigo-600 text-white px-12 py-6 rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-4">
                توصيل شحنتك الأولى <ArrowLeft size={24} />
              </button>
              <button onClick={() => scrollToSection('integration')} className="bg-white text-slate-900 border-2 border-slate-100 px-10 py-6 rounded-[2rem] font-black text-lg hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-3">
                <LinkIcon size={22} /> الربط البرمجي
              </button>
            </div>
          </div>

          {/* Visual Side */}
          <div className="relative order-1 lg:order-2">
             <div className="relative bg-white rounded-[4rem] p-4 elite-shadow border border-slate-100 w-full max-w-[550px] mx-auto group overflow-hidden">
                <div className="relative h-[550px] w-full rounded-[3.5rem] overflow-hidden bg-slate-900">
                  <div className="absolute inset-0 opacity-40">
                     <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1000" className="w-full h-full object-cover grayscale brightness-50" alt="Map" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                     <div className={`transition-all duration-700 transform ${fade ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-[3rem] border border-white/20 shadow-2xl flex flex-col items-center gap-4">
                           <div className="bg-indigo-600 p-5 rounded-3xl shadow-xl">
                              <Truck size={42} className="text-white" />
                           </div>
                           <div className="text-center">
                              <p className="text-xs font-black text-indigo-300 uppercase tracking-widest mb-1">كابتن نشط</p>
                              <p className="text-2xl font-black text-white">{CAPTAINS[captainIndex]}</p>
                              <div className="flex items-center justify-center gap-2 mt-2">
                                 <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                                 <span className="text-xs font-bold text-emerald-400">{DELIVERY_STATUSES[statusIndex]}</span>
                              </div>
                           </div>
                        </div>
                        <div className="mt-4 flex justify-center">
                           <div className="bg-indigo-600 px-6 py-2 rounded-2xl text-sm font-black text-white shadow-xl">حي {JEDDAH_DISTRICTS[districtIndex]}</div>
                        </div>
                     </div>
                  </div>
                </div>
                {/* Floatings */}
                <div className="absolute top-10 left-10 z-30 bg-white/90 backdrop-blur-xl p-4 rounded-3xl elite-shadow border border-white/50 flex items-center gap-4">
                   <div className="bg-emerald-500 p-2 rounded-xl text-white"><CheckCircle size={20} /></div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400">آخر تسليم</p>
                      <p className="text-xs font-black text-slate-900">قبل 2 دقيقة</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter text-slate-900 leading-tight">المميزات التي تجعلنا الخيار الأول</h2>
            <p className="text-xl text-slate-500 font-medium">نحن لا نوفر مجرد توصيل، بل حل لوجستي متكامل لنمو أعمالك في جدة.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: 'توزيع ذكي AI Dispatch', 
                desc: 'محرك ذكاء اصطناعي يوزع الطلبات على أقرب مندوب متاح في الحي لضمان سرعة فائقة.', 
                icon: Zap, color: 'text-amber-600', bg: 'bg-amber-100/50' 
              },
              { 
                title: 'ربط سلة وزد مباشر', 
                desc: 'بوابة ويب هوك متطورة تستقبل طلباتك تلقائياً من متجرك دون أي تدخل يدوي.', 
                icon: Globe, color: 'text-indigo-600', bg: 'bg-indigo-100/50' 
              },
              { 
                title: 'إثبات رقمي POD', 
                desc: 'توثيق كل تسليم بالصورة وتوقيع العميل رقمياً مع تتبع الموقع الجغرافي اللحظي.', 
                icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-100/50' 
              },
              { 
                title: 'تغطية 100% لأحياء جدة', 
                desc: 'أسطولنا يغطي كافة مناطق جدة من الشمال إلى الجنوب دون استثناءات.', 
                icon: MapPin, color: 'text-rose-600', bg: 'bg-rose-100/50' 
              },
              { 
                title: 'تتبع لحظي للعميل', 
                desc: 'رابط مباشر للعملاء لمتابعة المندوب على الخريطة لحظة بلحظة حتى وصول الطلب.', 
                icon: Smartphone, color: 'text-slate-600', bg: 'bg-slate-100' 
              },
              { 
                title: 'دعم فني 24/7', 
                desc: 'فريق عمليات متخصص يراقب أسطولك ويحل كافة المشاكل الميدانية على مدار الساعة.', 
                icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-100/50' 
              }
            ].map((f, i) => (
              <div key={i} className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100 hover:bg-white hover:elite-shadow transition-all group">
                <div className={`${f.bg} w-16 h-16 rounded-2xl flex items-center justify-center ${f.color} mb-10 group-hover:scale-110 transition-transform`}>
                  <f.icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-6">{f.title}</h3>
                <p className="text-slate-500 font-bold leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Guide Section */}
      <section id="integration" className="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full -mr-48 -mt-48"></div>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div className="space-y-6">
                <h2 className="text-4xl lg:text-7xl font-black tracking-tighter leading-tight">الربط البرمجي <br/> في <span className="text-indigo-400">ثواني</span></h2>
                <p className="text-xl text-slate-400 font-medium">خطوات بسيطة لربط متجرك واستقبال الطلبات تلقائياً.</p>
              </div>
              
              <div className="space-y-8">
                {[
                  { step: '01', title: 'احصل على رابط الويب هوك', desc: 'من لوحة التحكم الخاصة بك، انسخ رابط الاستقبال المخصص لمتجرك.', icon: LinkIcon },
                  { step: '02', title: 'أضف الرابط في سلة أو زد', desc: 'توجه لإعدادات المطور وأضف الرابط لتلقي تحديثات الطلبات الجديدة.', icon: Server },
                  { step: '03', title: 'استقبل الطلبات تلقائياً', desc: 'فور تأكيد العميل للطلب، سيظهر لدينا فوراً ويتم إسناده لأقرب مندوب.', icon: CheckCircle2 }
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-6 group">
                    <div className="bg-white/10 p-4 rounded-2xl text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <s.icon size={28} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white mb-2">{s.title}</h4>
                      <p className="text-slate-400 font-medium">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-slate-800/50 p-1 rounded-[3rem] border border-white/10 shadow-2xl backdrop-blur-sm">
               <div className="bg-slate-900 rounded-[2.5rem] p-8 space-y-6 font-mono text-sm overflow-hidden">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  </div>
                  <p className="text-indigo-400">// Jeddah Logistics Hub Integration API</p>
                  <p className="text-slate-300">POST <span className="text-emerald-400">/webhook/v1/orders</span></p>
                  <div className="space-y-1 pl-4">
                    <p className="text-slate-500">{'{'}</p>
                    <p className="pl-4"><span className="text-amber-400">"order_id"</span>: <span className="text-emerald-400">"SA-102934"</span>,</p>
                    <p className="pl-4"><span className="text-amber-400">"customer_name"</span>: <span className="text-emerald-400">"محمد أحمد"</span>,</p>
                    <p className="pl-4"><span className="text-amber-400">"district"</span>: <span className="text-emerald-400">"الشاطئ"</span>,</p>
                    <p className="pl-4"><span className="text-amber-400">"phone"</span>: <span className="text-emerald-400">"053xxxx567"</span></p>
                    <p className="text-slate-500">{'}'}</p>
                  </div>
                  <div className="pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl">
                      <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-lg"><CheckCircle2 size={16} /></div>
                      <p className="text-slate-400 font-black text-xs">تم فك تشفير العنوان بنجاح بواسطة AI</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Districts Section */}
      <section id="districts" className="py-32 bg-white relative">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-10 mb-20">
            <div className="space-y-6 max-w-2xl text-right">
              <h2 className="text-4xl lg:text-6xl font-black tracking-tighter text-slate-900 leading-tight">تغطية شاملة لكافة أحياء جدة</h2>
              <p className="text-xl text-slate-500 font-medium">سواء كنت في الشمال المترف أو الجنوب النابض بالحياة، أسطولنا يغطي كل زاوية في العروس.</p>
            </div>
            <div className="relative w-full lg:w-96">
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="ابحث عن حيك..." 
                className="w-full pr-14 pl-6 py-5 bg-slate-50 border-none rounded-[1.5rem] font-bold outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                value={districtSearch}
                onChange={(e) => setDistrictSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {filteredDistricts.length > 0 ? filteredDistricts.map((d, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 px-6 py-3 rounded-2xl text-sm font-black text-slate-700 hover:bg-indigo-600 hover:text-white hover:-translate-y-1 transition-all cursor-default flex items-center gap-2">
                <MapPin size={14} className="opacity-50" />
                {d}
              </div>
            )) : (
              <div className="py-20 text-center text-slate-400 font-bold">عذراً، لم نجد نتائج لـ "{districtSearch}"</div>
            )}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 relative">
          <div className="bg-indigo-600 rounded-[4rem] p-12 lg:p-24 text-white text-center relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(79,70,229,0.3)]">
            <div className="relative z-10 space-y-10">
              <h2 className="text-4xl lg:text-7xl font-black tracking-tighter leading-tight">هل أنت مستعد لتطوير <br/> لوجستيات متجرك؟</h2>
              <p className="text-xl lg:text-2xl text-indigo-100 font-medium max-w-2xl mx-auto">ابدأ اليوم مع لوجستيك جدة واستمتع بأتمتة كاملة لشحناتك مع أسرع خدمة توصيل ميدانية.</p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button onClick={onGoToLogin} className="bg-white text-indigo-600 px-14 py-6 rounded-[2rem] font-black text-xl hover:bg-indigo-50 hover:-translate-y-1 transition-all shadow-2xl flex items-center gap-4">
                  دخول النظام <ChevronLeft size={24} />
                </button>
                <button onClick={() => window.open(`https://wa.me/966538997567`, '_blank')} className="bg-indigo-700/50 text-white border border-white/20 px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-indigo-800/60 transition-all">
                  تحدث مع المبيعات
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
              <div className="bg-indigo-600 p-2 rounded-xl text-white">
                <Box size={24} />
              </div>
              <span className="text-2xl font-black tracking-tighter">لوجستيك جدة</span>
            </div>
            <p className="text-slate-500 font-bold leading-relaxed">
              الخيار الأول للمتاجر الذكية في مدينة جدة. تقنية متقدمة، سرعة فائقة، وأمان تام لشحناتك.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-black text-slate-900 mb-8">روابط سريعة</h4>
            <ul className="space-y-4">
              {['الرئيسية', 'المميزات', 'المناطق المغطاة', 'الربط البرمجي'].map(item => (
                <li key={item}><button onClick={() => scrollToSection(item === 'المميزات' ? 'features' : item === 'المناطق المغطاة' ? 'districts' : 'integration')} className="text-slate-500 font-bold hover:text-indigo-600 transition-colors">{item}</button></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-black text-slate-900 mb-8">الدعم والمساعدة</h4>
            <ul className="space-y-4">
              {['مركز المساعدة', 'الأسئلة الشائعة', 'تواصل معنا', 'سياسة الخصوصية'].map(item => (
                <li key={item}><button onClick={onGoToLogin} className="text-slate-500 font-bold hover:text-indigo-600 transition-colors">{item}</button></li>
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
