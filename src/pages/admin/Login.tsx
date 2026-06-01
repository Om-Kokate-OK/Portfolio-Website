import { useState, FormEvent } from 'react';
import { LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from '../../hooks/useRouter';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { navigate } = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: signInError } = await signIn(username, password);

      if (signInError) {
        setError('Invalid username or password');
      } else {
        navigate('/admin/dashboard');
      }
    } catch {
      setError('An error occurred. Please try again.');
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

      <div className="max-w-md w-full relative z-10 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-mono-labels uppercase tracking-widest text-[#888888]">// Authentication Portal</span>
          <h1 className="text-5xl font-black uppercase tracking-tighter text-white">
            ADMIN_SYNC
          </h1>
          <p className="text-slate-400 text-xs font-mono-labels uppercase tracking-wider">Secure portfolio synchronize gate</p>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-[10px] font-mono-labels uppercase tracking-widest text-[#888888] mb-2">
                User Coordinate ID
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

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-4 bg-white hover:bg-slate-200 text-black font-black uppercase text-xs tracking-widest rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Execute Sync</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-xs font-mono-labels uppercase tracking-widest text-[#888888] hover:text-white transition-colors"
          >
            ← Cancel Sync / Return
          </button>
        </div>
      </div>
    </div>
  );
}
