//frontend/src/pages/AdminLogin.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, admin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && admin) {
      navigate('/dashboard');
    }
  }, [admin, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    }
  };

  return (
    <>
      <Helmet>
        <title>MIND-X: Admin Login</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#81C99C]/20 to-[#FBB859]/10">
        <div className="max-w-md w-full p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/50">
          <div className="mb-10">
            <h1 className="text-center font-montserrat font-bold text-[#FBB859] text-5xl tracking-wider mb-3 transform hover:scale-105 transition-transform duration-300">
              MIND-X
            </h1>
            <h2 className="text-center text-xl font-medium text-[#606161]/80">
              Admin Dashboard
            </h2>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg bg-red-50 p-4 border-l-4 border-red-500">
                <div className="text-sm text-red-700 font-medium">{error}</div>
              </div>
            )}

            <div className="space-y-4">
              <div className="group">
                <label htmlFor="email-address" className="block text-sm font-medium text-[#606161]/80 mb-1 ml-1">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full px-4 py-3 rounded-lg border border-[#606161]/20 bg-white/50 backdrop-blur-sm text-[#606161] placeholder-[#606161]/40 focus:outline-none focus:ring-2 focus:ring-[#FBB859]/50 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="group">
                <label htmlFor="password" className="block text-sm font-medium text-[#606161]/80 mb-1 ml-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full px-4 py-3 rounded-lg border border-[#606161]/20 bg-white/50 backdrop-blur-sm text-[#606161] placeholder-[#606161]/40 focus:outline-none focus:ring-2 focus:ring-[#FBB859]/50 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="relative w-full flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium
                  bg-gradient-to-r from-[#FBB859] to-[#81C99C] 
                  hover:from-[#FBB859]/90 hover:to-[#81C99C]/90
                  focus:outline-none focus:ring-2 focus:ring-[#FBB859]/50 focus:ring-offset-2
                  transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <span className="absolute left-4 flex items-center">
                  <svg 
                    className="h-5 w-5 text-white/90" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </span>
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;