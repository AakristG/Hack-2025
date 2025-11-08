import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen" style={{ background: 'oklch(98% 0.016 73.684)' }}>
        <div className="flex min-h-screen">
          <div className="flex-1"></div>
          <div className="flex-1 flex items-center justify-center p-10">
            <div className="text-black text-2xl">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ background: 'oklch(98% 0.016 73.684)' }}>
      <div className="flex min-h-screen max-w-7xl mx-auto">
        {/* Left side with X logo */}
        <div className="flex-1 flex items-center justify-center p-10" style={{ background: 'oklch(98% 0.016 73.684)' }}>
          <div className="w-96 h-96 text-black flex items-center justify-center max-w-full">
            <img src="/images/tMobile.png" alt = "logo" className = "w-full h-full object-contain"/>
          </div>
        </div>

        {/* Right side with content */}
        <div className="flex-1 flex items-center justify-center p-10" style={{ background: 'oklch(98% 0.016 73.684)' }}>
          <div className="max-w-md w-full">
            <h1 className="text-4xl font-bold text-black mb-16 leading-tight tracking-tight">Welcome to TMobile Pulse</h1>
            <h2 className="text-3xl font-bold text-black mb-8 leading-tight">Join today.</h2>

            {/* Sign up buttons */}
            <div className="flex flex-col gap-3 mb-5">
              <button
                type="button"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white text-black border border-gray-300 rounded-full text-base font-normal hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white text-black border border-gray-300 rounded-full text-base font-normal hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Sign up with Apple
              </button>
              <div className="relative text-center my-2">
                <span className="relative inline-block px-2" style={{ background: 'oklch(98% 0.016 73.684)' }}>
                  <span className="text-sm text-gray-500">OR</span>
                </span>
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300 -z-10"></div>
              </div>
              <button
                type="button"
                className="w-full py-3 px-4 rounded-full text-base font-bold text-white border-none transition-colors"
                style={{ background: 'oklch(59.2% 0.249 0.584)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'oklch(55% 0.249 0.584)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'oklch(59.2% 0.249 0.584)';
                }}
              >
                Create account
              </button>
            </div>

            {/* Legal text */}
            <p className="text-xs text-gray-500 leading-snug mb-20">
              By signing up, you agree to the{' '}
              <button type="button" className="underline hover:no-underline" style={{ color: 'oklch(59.2% 0.249 0.584)' }}>
                Terms of Service
              </button>{' '}
              and{' '}
              <button type="button" className="underline hover:no-underline" style={{ color: 'oklch(59.2% 0.249 0.584)' }}>
                Privacy Policy
              </button>
              , including{' '}
              <button type="button" className="underline hover:no-underline" style={{ color: 'oklch(59.2% 0.249 0.584)' }}>
                Cookie Use
              </button>
              .
            </p>

            {/* Login section */}
            <div className="mt-10">
              <p className="text-base font-bold text-black mb-5">Already have an account?</p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-3">
                {error && (
                  <div className="bg-red-100 text-red-800 py-3 px-3 rounded-lg mb-3 text-center text-sm border border-red-200">
                    {error}
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full py-3 px-4 border border-gray-300 rounded text-base bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-transparent"
                  style={{ '--tw-ring-color': 'oklch(59.2% 0.249 0.584)' } as React.CSSProperties & { '--tw-ring-color'?: string }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'oklch(59.2% 0.249 0.584)';
                    e.currentTarget.style.boxShadow = '0 0 0 2px oklch(59.2% 0.249 0.584)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '';
                    e.currentTarget.style.boxShadow = '';
                  }}
                  autoFocus
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full py-3 px-4 border border-gray-300 rounded text-base bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-transparent"
                  style={{ '--tw-ring-color': 'oklch(59.2% 0.249 0.584)' } as React.CSSProperties & { '--tw-ring-color'?: string }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'oklch(59.2% 0.249 0.584)';
                    e.currentTarget.style.boxShadow = '0 0 0 2px oklch(59.2% 0.249 0.584)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '';
                    e.currentTarget.style.boxShadow = '';
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-black text-white border border-black rounded-full text-base font-bold hover:bg-gray-800 transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>
              <div className="mt-3 text-center text-sm text-gray-500">
                <p>
                  Default: <strong className="text-black font-semibold">admin</strong> / <strong className="text-black font-semibold">admin123</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

