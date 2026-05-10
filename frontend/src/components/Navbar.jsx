import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (path) => {
    navigate(path);
    closeMobileMenu();
  };

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-12">
          <div onClick={()=>navigate("/")} className="hover:cursor-pointer text-xl sm:text-2xl font-black tracking-tight text-cyan-600">
            Service<span className="text-slate-900">Trip</span>
          </div>
          <nav className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-slate-600">
            <button onClick={() => navigate('/')} className="hover:text-cyan-600 transition-colors">Home</button>
            <button onClick={() => navigate('/services')} className="hover:text-cyan-600 transition-colors">Services</button>
            {/* <button className="hover:text-cyan-600 transition-colors">How it works</button> */}
          </nav>
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-500">Welcome, {user.name}</span>
              <button
                onClick={() => navigate(user.role === 'vendor' ? '/vendor/dashboard' : '/customer/dashboard')}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 transition-all"
              >
                Dashboard
              </button>
              <button onClick={logout} className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className=" hidden lg:flex bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-cyan-600 transition-all shadow-lg shadow-slate-200"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Toggle mobile menu"
        >
          <svg
            className="w-6 h-6 text-slate-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-100 shadow-lg">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-3">
              <button
                onClick={() => handleNavClick('/')}
                className="text-left px-3 py-2 text-slate-600 hover:text-cyan-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('/services')}
                className="text-left px-3 py-2 text-slate-600 hover:text-cyan-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Services
              </button>
              {/* <button
                onClick={() => closeMobileMenu()}
                className="text-left px-3 py-2 text-slate-600 hover:text-cyan-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                How it works
              </button> */}
            </nav>

            {/* Mobile Auth Section */}
            <div className="border-t border-slate-200 pt-4">
              {user ? (
                <div className="space-y-3">
                  <div className="px-3 py-2 text-sm font-medium text-slate-500 bg-slate-50 rounded-lg">
                    Welcome, {user.name}
                  </div>
                  <button
                    onClick={() => handleNavClick(user.role === 'vendor' ? '/vendor/dashboard' : '/customer/dashboard')}
                    className="w-full px-4 py-3 text-left text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all font-medium"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="w-full px-4 py-3 text-left text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNavClick('/login')}
                  className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl font-bold hover:bg-cyan-600 transition-all shadow-lg"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;