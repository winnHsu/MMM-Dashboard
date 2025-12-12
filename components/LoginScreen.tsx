import React, { useState } from 'react';
import { Lock, AlertCircle, ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check email domain
    if (!email.endsWith('@metromeshmedia.com')) {
      setError('Invalid email or password.');
      return;
    }

    // Check password
    if (password !== 'Metromesh8379!') {
      setError('Invalid email or password.');
      return;
    }

    // Success
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header Section */}
        <div className="bg-gray-50 px-8 py-8 border-b border-gray-100 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
             <Lock className="text-emerald-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">MetroMesh Media</h1>
          <p className="text-gray-500 font-medium text-sm mt-1">Authorized Access Only</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide ml-1">
                Email Address
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide ml-1">
                Password
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm font-medium border border-red-100 animate-in slide-in-from-top-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-emerald-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
            >
              Sign In to Dashboard
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} MetroMesh Media. Internal use only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
