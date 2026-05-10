import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', role: 'customer',city:''});
  const [otp, setOtp] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Helper to switch modes and clear browser memory/state
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setStep(1);
    setFormData({ name: '', email: '', phone: '', password: '', role: 'customer',city:''});
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      await axios.post('/api/auth/signup', formData);
      toast.success('OTP sent to your email!');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/verify-otp', { ...formData, otp });
      login(res.data.user, res.data.token);
      toast.success('Signup successful!');
      navigate(res.data.user.role === 'vendor' ? '/vendor/dashboard' : '/customer/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', {
        email: formData.email,
        password: formData.password
      });
      login(res.data.user, res.data.token);
      toast.success('Welcome back!');
      navigate(res.data.user.role === 'vendor' ? '/vendor/dashboard' : '/customer/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-cyan-500/30">
      <Navbar />
      
      <div className="flex items-center justify-center px-6 py-12 lg:py-20">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[3rem] bg-slate-900/40 border border-slate-800 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] lg:grid-cols-2 backdrop-blur-sm">
          
          {/* Left Decorative Side (Unchanged) */}
          <div className="relative hidden lg:flex flex-col justify-between bg-cyan-600 p-16 overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="relative z-10">
              <div className="text-2xl font-bold tracking-tighter text-white mb-12">ServiceTrip.</div>
              <h1 className="text-5xl font-black text-white leading-[1.1] mb-6">
                Your Home, <br /> Handled by <span className="text-cyan-200">Experts.</span>
              </h1>
              <p className="text-lg text-cyan-50/80 leading-relaxed max-w-sm">
                Join 50,000+ households getting professional maintenance with a click of a button.
              </p>
            </div>
            <div className="relative z-10 grid grid-cols-2 gap-6 text-white font-bold">
              <div><p className="text-2xl">99%</p><p className="text-xs opacity-60 uppercase">Satisfaction</p></div>
              <div><p className="text-2xl">24/7</p><p className="text-xs opacity-60 uppercase">Concierge</p></div>
            </div>
          </div>

          {/* Right Form Side */}
          <div className="p-8 md:p-16 flex flex-col justify-center bg-slate-900/60">
            <div className="mx-auto w-full max-w-sm space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-extrabold text-white tracking-tight">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="mt-2 text-slate-400">
                  {isLogin ? 'Please enter your details.' : 'Start your journey with us today.'}
                </p>
              </div>

             
              <form 
      className="space-y-4" 
      key={isLogin ? "login-section" : "signup-section"}
      onSubmit={(e) => {
        e.preventDefault(); // Stop page refresh
        if (isLogin) {
          handleLogin();
        } else if (step === 1) {
          handleSignup();
        } else {
          handleVerifyOTP();
        }
      }}
    >
      {isLogin ? (
        <>
          <Input label="Email" type="email" name="email" autoComplete="username" placeholder="name@company.com" onChange={handleChange} required />
          <Input label="Password" type="password" name="password" autoComplete="current-password" placeholder="••••••••" onChange={handleChange} required />
          {/* Change button to type="submit" */}
          <Button isLoading={loading} type="submit">Sign In</Button>
        </>
      ) : step === 1 ? (
        <>
          {/* ... Role selection buttons stay same as they are type="button" ... */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">I am a</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
              <button 
                type="button"
                onClick={() => setFormData({...formData, role: 'customer'})}
                className={`py-2 text-sm font-medium rounded-xl transition-all ${formData.role === 'customer' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              >Customer</button>
              <button 
                type="button"
                onClick={() => setFormData({...formData, role: 'vendor'})}
                className={`py-2 text-sm font-medium rounded-xl transition-all ${formData.role === 'vendor' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              >Vendor</button>
            </div>
          </div>
          <Input label="Full Name" type="text" name="name" autoComplete="name" placeholder="John Doe" onChange={handleChange} required />
          <Input label="Email" type="email" name="email" autoComplete="email" placeholder="john@example.com" onChange={handleChange} required />
          <Input label="Phone" type="tel" name="phone" autoComplete="tel" placeholder="12345 67890" onChange={handleChange} required />
          {formData.role === "customer" && <Input label="City" type="text" name="city" autoComplete="city" placeholder="Bengaluru, Delhi" onChange={handleChange} required />}
          <Input label="Password" type="password" name="password" autoComplete="new-password" minLength={8} placeholder="Min. 8 characters" onChange={handleChange} required />
          <Button isLoading={loading} type="submit">Create Account</Button>
        </>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-slate-400 mb-4 text-left">Verify your email address to continue.</p>
            <input 
              type="text" 
              maxLength={6} 
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 text-center text-3xl font-bold tracking-[0.5em] text-cyan-400 focus:border-cyan-500 transition-all outline-none"
              placeholder="000000"
              onChange={(e) => setOtp(e.target.value)} 
              required
            />
          </div>
          <Button isLoading={loading} type="submit">Verify & Finish</Button>
          <button type="button" onClick={() => setStep(1)} className="w-full text-xs text-slate-500 hover:text-cyan-400 transition-colors">Didn't receive a code? Edit details</button>
        </div>
      )}
    </form>

              <p className="text-center text-sm text-slate-500">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <button 
                  type="button"
                  onClick={toggleMode} 
                  className="font-bold text-cyan-500 hover:text-cyan-400 transition-colors underline-offset-4 hover:underline"
                >
                  {isLogin ? 'Sign up' : 'Log in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, type, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
        {label}
      </label>
      <div className="relative group">
        <input 
          {...props}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none"
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-cyan-400 transition-colors"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const Button = ({ children, isLoading, type = "submit", ...props }) => (
    <button
    {...props}
    type={type}
    disabled={isLoading || props.disabled}
    className={`
      relative w-full py-4 px-6 rounded-2xl font-bold tracking-wide transition-all duration-200
      flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed
      ${isLoading 
        ? 'bg-slate-800 text-slate-500' 
        : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20 hover:shadow-cyan-500/30'
      }
    `}
  >
    {isLoading ? (
      <>
        <svg className="animate-spin h-5 w-5 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Processing...</span>
      </>
    ) : (
      children
    )}
  </button>
);

export default Login;