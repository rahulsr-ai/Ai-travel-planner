import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export const AuthPage: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const [isLogin, setIsLogin] = useState<boolean>(isLoginPage);

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { loginUser, signupUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);



    try {


      if (isLogin) {
        await loginUser(email, password);
      } else {
        if (!name) {
          setError('Name is required');
          setIsSubmitting(false);
          return;
        }
        await signupUser(name, email, password);

      }

      // --- CRITICAL STORAGE DOUBLE CHECK CONTROLS ---
      const checkToken = localStorage.getItem('token');
      const checkUser = localStorage.getItem('user');


      if (checkToken && checkUser) {
        navigate('/dashboard');
      } else {
        setTimeout(() => {
          if (localStorage.getItem('token')) {
            navigate('/dashboard');
          } else {
            setError("Authentication succeeded but token mapping failed to write locally. Try again.");
          }
        }, 100);
      }

    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Authentication failed. Please check network responses in F12 Network tab.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
      style={{ backgroundColor: 'var(--layout-bg)' }}
    >
      {/* Horizontal Main Card Container */}
      <div
        className="max-w-4xl w-full flex bg-white rounded-2xl shadow-xl overflow-hidden min-h-137.5 border"
        style={{ borderColor: 'var(--layout-border)' }}
      >

        {/* Left Side: Form Area */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          {/* Logo*/}
          <div className="flex flex-col items-center justify-center text-center">
            <img
              src="/hr-trip-logo.png"
              alt="HR Trrip Logo"
              className="h-16 w-auto object-contain mb-10"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/150x50/0d9488/ffffff?text=HR+Trrip';
              }}
            />



            <p className="text-sm max-w-xs" style={{ color: 'var(--layout-muted)' }}>
              {isLogin ? "Welcome back! Let's plan your next destination." : 'Join us to auto-generate travel schedules.'}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-3 rounded">
              <p className="text-xs text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wider mb-1"
                  style={{ color: 'var(--brand-dark)' }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none text-sm transition-all focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  style={{ borderColor: 'var(--layout-border)' }}
                  placeholder="Rahul Rawat"
                />
              </div>
            )}

            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider mb-1"
                style={{ color: 'var(--brand-dark)' }}
              >
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none text-sm transition-all focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                style={{ borderColor: 'var(--layout-border)' }}
                placeholder="developer@example.com"
              />
            </div>

            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider mb-1"
                style={{ color: 'var(--brand-dark)' }}
              >
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none text-sm transition-all focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                style={{ borderColor: 'var(--layout-border)' }}
                placeholder="••••••••"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer w-full flex justify-center py-2.5 px-4 text-sm font-semibold rounded-lg text-white transition-colors duration-200 disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--brand-primary)',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--brand-hover)')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--brand-primary)')}
              >
                {isSubmitting ? 'Processing...' : isLogin ? 'Sign In' : 'Get Started'}
              </button>
            </div>
          </form>

          {/* Toggle Button */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-xs font-semibold tracking-wide cursor-pointer"
              style={{ color: 'var(--brand-primary)' }}
            >
              {isLogin ? "DON'T HAVE AN ACCOUNT? SIGN UP" : 'ALREADY HAVE AN ACCOUNT? SIGN IN'}
            </button>
          </div>
        </div>

        {/* Right Side Travel Imag Section */}
        <div className="hidden md:block md:w-1/2 relative"  >
          <img
            src="/sites-img/login-img.jpg"
            alt="Scenic Travel Destination"
            className="w-full h-full object-cover  hover:mix-blend-normal transition-all duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-t p-8 flex flex-col justify-end text-white" style={{ backgroundImage: 'linear-gradient(to top, var(--brand-dark) 0%, transparent 100%)' }}>
            <h3 className="text-xl font-bold">Your AI-Powered Travel Desk</h3>
            <p className="text-xs mt-1 max-w-sm" style={{ color: 'var(--brand-light)' }}>
              Upload your raw travel vouchers or tickets and watch our AI craft a hyper-personalized itinerary instantly.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};