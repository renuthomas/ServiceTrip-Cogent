import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const categories = [
  { title: 'AC Service', subtitle: 'Install & Repair', icon: '❄️' },
  { title: 'Plumbing', subtitle: 'Fix leaks & fittings', icon: '🔧' },
  { title: 'Carpentry', subtitle: 'Furniture & woodwork', icon: '🪚' },
  { title: 'Cleaning', subtitle: 'Deep sanitization', icon: '✨' },
  { title: 'Pest Control', subtitle: 'Safety first', icon: '🛡️' },
  { title: 'Electrician', subtitle: 'Wiring & lights', icon: '⚡' }
];

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const searchService=()=>{
    navigate("/services",{state:{searchData:search}});
  }

  const handleKeyDown = (event) => {
    if (event?.key === 'Enter') {
      searchService();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative pt-16 pb-24 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-cyan-50/50 to-transparent -z-10" />
          
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl">
              <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-100 text-cyan-700 text-xs font-bold uppercase tracking-wider mb-6">
                Premium Home Services
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
                Your home, <br /> 
                <span className="text-cyan-600 underline decoration-cyan-200 underline-offset-8">Perfectly maintained.</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-xl">
                Experience the gold standard of home maintenance. From plumbing to deep cleaning, book top-rated professionals in seconds.
              </p>

              {/* Enhanced Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-2xl shadow-2xl shadow-slate-200 border border-slate-100">
                <div className="flex-1 flex items-center px-4 gap-3">
                  <svg className="text-slate-400" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  <input
                    type="text"
                    placeholder="Search for 'Deep Cleaning' or 'Electrician'..."
                    className="w-full py-3 outline-none text-slate-700 placeholder:text-slate-400"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    
                  />
                </div>
                <button onClick={()=>searchService()} className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-cyan-200">
                  Find Expert
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Popular Categories</h2>
              <p className="text-slate-500">Hand-picked professionals for every corner of your home.</p>
            </div>
            <button onClick={() => navigate('/services')} className="text-cyan-600 font-bold hover:gap-3 flex items-center gap-2 transition-all">
              View all services <span>→</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {categories.map((cat) => (
              <div 
                key={cat.title} 
                className="group p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-500/5 transition-all cursor-pointer text-center"
              >
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 group-hover:bg-cyan-50 transition-colors">
                  {cat.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{cat.title}</h3>
                <p className="text-xs text-slate-500">{cat.subtitle}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Us Section */}
        <section className="max-w-7xl mx-auto px-6 py-24">
  <div className="relative isolate overflow-hidden bg-slate-950 rounded-[3.5rem] border border-slate-800 shadow-2xl">
    {/* Sophisticated Ambient Light Effects */}
    <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full" />
    <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/10 blur-[100px] rounded-full" />

    <div className="relative z-10 grid lg:grid-cols-12 gap-12 p-8 md:p-16 lg:p-20 items-center">
      
      {/* Content Column */}
      <div className="lg:col-span-7 space-y-8 md:space-y-12">
  {/* Header Section */}
  <div className="text-left">
    {/* Badge: Centered on tiny screens, left-aligned on small+ */}
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4 md:mb-6">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
      </span>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 whitespace-nowrap">
        The ServiceTrip Standard
      </span>
    </div>

    {/* Responsive Heading: Scales from 3xl to 5xl */}
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-[1.2] md:leading-tight tracking-tight">
      Safety, Transparency, <br className="hidden sm:block" />
      <span className="text-slate-500"> & 100% Peace of Mind.</span>
    </h2>
  </div>

  {/* Feature List */}
  <div className="grid grid-cols-1 gap-y-6 md:gap-y-10">
    {[
      { 
        t: 'Rigorous Vetting', 
        d: 'Every professional undergoes a 4-step background check and skill assessment.',
        icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/> 
      },
      { 
        t: 'Upfront Quoting', 
        d: 'Know exactly what you’ll pay before you book. No surge pricing, ever.',
        icon: <path d="M12 2v20m10-10H2"/> 
      },
      { 
        t: 'Service Guarantee', 
        d: 'Not satisfied? We will re-work the job at no extra cost to you.',
        icon: <path d="m9 11 3 3L22 4m-2 12.03V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h11.03"/> 
      }
    ].map((item) => (
      <div key={item.t} className="group flex flex-col sm:flex-row items-start gap-4 md:gap-6">
        {/* Icon: Smaller on mobile, larger on desktop */}
        <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-cyan-500 transition-all duration-500 shadow-lg">
          <svg className="w-5 h-5 text-cyan-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {item.icon}
          </svg>
        </div>
        
        <div className="space-y-1">
          <h4 className="text-base md:text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
            {item.t}
          </h4>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-md">
            {item.d}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>

      {/* Stats Column - Bento Grid Style */}
   <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
  {/* Trust Score Card - Full width on all screens */}
  <div className="col-span-1 sm:col-span-2 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md rounded-[2rem] border border-white/10 p-6 md:p-8 flex flex-col justify-between min-h-[140px] md:min-h-[160px]">
    <p className="text-slate-400 text-sm font-medium">Customer Trust Score</p>
    <div className="flex items-end justify-between sm:block">
      <div>
        <p className="text-4xl md:text-5xl font-black text-white tracking-tighter">
          4.9<span className="text-cyan-500">/5</span>
        </p>
        <div className="flex gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-3.5 h-3.5 md:w-4 md:h-4 text-cyan-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          ))}
        </div>
      </div>
      
      {/* Visual flair for mobile: hidden on desktop, shows "Verified" on mobile */}
      <div className="sm:hidden text-[10px] font-bold text-cyan-500 uppercase tracking-widest bg-cyan-500/10 px-2 py-1 rounded-md border border-cyan-500/20">
        Verified
      </div>
    </div>
  </div>
  
  {/* Bookings Card - 50/50 on small screens, 100% stack on mobile */}
  <div className="bg-cyan-600 rounded-[2.5rem] sm:rounded-[2rem] p-6 md:p-8 flex flex-col justify-between shadow-xl shadow-cyan-900/20">
    <p className="text-cyan-100 text-xs font-bold uppercase tracking-wider">Bookings</p>
    <p className="text-3xl md:text-4xl font-black text-white mt-4 sm:mt-8">12M+</p>
  </div>

  {/* Cities Card - 50/50 on small screens, 100% stack on mobile */}
  <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] sm:rounded-[2rem] p-6 md:p-8 flex flex-col justify-between">
    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Cities</p>
    <p className="text-3xl md:text-4xl font-black text-white mt-4 sm:mt-8">120+</p>
  </div>
</div>

    </div>
  </div>
</section>
      </main>
    </div>
  );
};

export default Home;