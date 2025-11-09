import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ParticleBackground from './ParticleBackground';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const result = await login(username, password);
        if (result.success) {
          // Redirect will happen automatically via useEffect
        } else {
          setError(result.error || 'Login failed');
          setLoading(false);
        }
      } else {
        // Register
        const result = await register(username, email, password);
        if (result.success) {
          // Redirect will happen automatically via useEffect
        } else {
          setError(result.error || 'Registration failed');
          setLoading(false);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Base Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600"></div>
      
      {/* Particle Animation */}
      <ParticleBackground />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen max-w-7xl mx-auto">
        {/* Left side with logo */}
        <div className="flex-1 flex items-center justify-center p-10">
          <div className="w-96 h-96 text-white flex items-center justify-center max-w-full backdrop-blur-sm bg-white/10 rounded-3xl p-8 shadow-2xl">
            <img src="/images/tMobile.png" alt="logo" className="w-full h-full object-contain drop-shadow-lg" />
          </div>
        </div>

        {/* Right side with content */}
        <div className="flex-1 flex items-center justify-center p-10">
          <div className="max-w-md w-full backdrop-blur-md bg-white/90 rounded-3xl p-8 shadow-2xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight tracking-tight">
              {isLogin ? 'Welcome back' : 'Join today'}
            </h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-8 leading-tight">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </h2>

            {error && (
              <div className="bg-red-100 text-red-800 py-3 px-4 rounded-lg mb-5 text-sm border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter your username"
                />
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required={!isLogin}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg text-base font-bold text-white border-none transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                {loading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setUsername('');
                  setEmail('');
                  setPassword('');
                }}
                className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>

            {/* Legal text */}
            {!isLogin && (
              <p className="text-xs text-gray-500 leading-snug mt-8">
                By signing up, you agree to the{' '}
                <button type="button" className="underline hover:no-underline text-purple-600">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="underline hover:no-underline text-purple-600">
                  Privacy Policy
                </button>
                .
              </p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;
