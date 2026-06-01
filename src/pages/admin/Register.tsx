import { useState, FormEvent } from 'react';
import { UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { api } from '../../lib/api';
import { useRouter } from '../../hooks/useRouter';

export default function AdminRegister() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { navigate } = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await api.post('/auth/register', {
        username,
        email,
        password,
        role: 'admin' // Create admin by default on this secret route
      });
      setSuccess(true);
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000000] px-4 relative overflow-hidden select-none">
      {/* Background wireframe grids */}
      <div className="absolute inset-0 grid grid-cols-4 pointer-events-none">
        <div className="border-r border-white/5"></div>
        <div className="border-r border-white/5"></div>
        <div className="border-r border-white/5"></div>
        <div></div>
      </div>

      <div className="max-w-md w-full relative z-10 space-y-8 py-12">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-mono-labels uppercase tracking-widest text-[#888888]">// Secret Vector Registry</span>
          <h1 className="text-5xl font-black uppercase tracking-tighter text-white">
            SYS_REGISTER
          </h1>
          <p className="text-slate-400 text-xs font-mono-labels uppercase tracking-wider">Register a new administrator node</p>
        </div>

        <div className="bg-[#0b0b0b] rounded-3xl p-8 border border-white/10 shadow-2xl relative">
          <div className="absolute top-4 right-4 flex items-center space-x-1.5 text-[8px] font-mono-labels uppercase text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>SHARD-SYS_ACTIVE</span>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-400 text-xs font-mono-labels uppercase tracking-wider">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex flex-col items-center text-center space-y-4 font-mono-labels">
              <CheckCircle className="w-8 h-8 text-emerald-400 animate-bounce" />
              <div>
                <h3 className="text-emerald-400 font-bold uppercase text-sm">Node Registered Successfully</h3>
                <p className="text-slate-400 text-xs mt-2 uppercase tracking-wide">Your new administrator account is verified.</p>
              </div>
              <button
                onClick={() => navigate('/openItBaby')}
                className="mt-2 text-xs text-white bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-xl transition-all uppercase tracking-widest"
              >
                Go to Sign In →
              </button>
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-[10px] font-mono-labels uppercase tracking-widest text-[#888888] mb-2">
                  Username ID
                </label>
                <input
                  type="text"
                  id="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-[#111] border border-white/10 focus:border-white rounded-xl focus:ring-0 outline-none transition-all text-white text-sm font-light"
                  placeholder="Enter admin ID"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-[10px] font-mono-labels uppercase tracking-widest text-[#888888] mb-2">
                  Contact Coordinates (E-mail)
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#111] border border-white/10 focus:border-white rounded-xl focus:ring-0 outline-none transition-all text-white text-sm font-light"
                  placeholder="admin@company.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-[10px] font-mono-labels uppercase tracking-widest text-[#888888] mb-2">
                  Passphrase Vector
                </label>
                <input
                  type="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#111] border border-white/10 focus:border-white rounded-xl focus:ring-0 outline-none transition-all text-white text-sm font-light"
                  placeholder="••••••••••••"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-[10px] font-mono-labels uppercase tracking-widest text-[#888888] mb-2">
                  Verify Passphrase
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#111] border border-white/10 focus:border-white rounded-xl focus:ring-0 outline-none transition-all text-white text-sm font-light"
                  placeholder="••••••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-4 bg-white hover:bg-slate-200 text-black font-black uppercase text-xs tracking-widest rounded-xl transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Establish Node</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs font-mono-labels uppercase tracking-widest text-[#888888] hover:text-white transition-colors"
          >
            ← Cancel / Return
          </button>
        </div>
      </div>
    </div>
  );
}
