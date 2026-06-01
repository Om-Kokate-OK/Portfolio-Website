import { useEffect, useState } from 'react';
import { Trophy, TrendingUp, ExternalLink, Clock } from 'lucide-react';
import { api } from '../lib/api';

interface CodingMetric {
  _id: string;
  platform_name: string;
  username: string;
  profile_url: string;
  total_solved: number;
  easy_solved?: number;
  medium_solved?: number;
  hard_solved?: number;
  rank_rating?: string;
  badge_icon_url?: string;
  display_order: number;
  last_updated: string;
  created_at: string;
}

export default function CodingProfile() {
  const [metrics, setMetrics] = useState<CodingMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await api.get('/coding-metrics');
        setMetrics(response.data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 bg-slate-950 text-white relative overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 cyber-grid opacity-[0.06] pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5 shadow-neon-cyan/5 mx-auto">
            <Trophy className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Competitive Coding</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
            Coding Profiles
          </h1>
          <p className="text-slate-400 font-light max-w-2xl mx-auto text-lg leading-relaxed">
            My algorithmic performance, rank ratings, and problem-solving metrics across top competitive sites.
          </p>
        </div>

        {metrics.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl max-w-xl mx-auto">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">No profiles configured yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {metrics.map((metric) => (
              <div
                key={metric._id}
                className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-cyan-500/30 rounded-3xl p-8 shadow-2xl transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                        {metric.platform_name}
                      </h3>
                      <p className="text-slate-400 text-xs font-medium">@{metric.username}</p>
                    </div>
                    {metric.badge_icon_url && (
                      <img
                        src={metric.badge_icon_url}
                        alt={`${metric.platform_name} badge`}
                        className="w-12 h-12 rounded-xl border border-white/10 p-1 bg-slate-950"
                      />
                    )}
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between p-4 bg-slate-900/60 border border-white/5 rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        <span className="text-slate-300 font-bold text-xs uppercase tracking-wider">Total Solved</span>
                      </div>
                      <span className="text-2xl font-black text-cyan-400">{metric.total_solved}</span>
                    </div>

                    {(metric.easy_solved !== null ||
                      metric.medium_solved !== null ||
                      metric.hard_solved !== null) && (
                        <div className="grid grid-cols-3 gap-2">
                          {metric.easy_solved !== null && (
                            <div className="p-3 bg-slate-900/40 border border-white/5 rounded-2xl text-center">
                              <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Easy</div>
                              <div className="text-lg font-black text-emerald-400">
                                {metric.easy_solved}
                              </div>
                            </div>
                          )}
                          {metric.medium_solved !== null && (
                            <div className="p-3 bg-slate-900/40 border border-white/5 rounded-2xl text-center">
                              <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Medium</div>
                              <div className="text-lg font-black text-amber-400">
                                {metric.medium_solved}
                              </div>
                            </div>
                          )}
                          {metric.hard_solved !== null && (
                            <div className="p-3 bg-slate-900/40 border border-white/5 rounded-2xl text-center">
                              <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Hard</div>
                              <div className="text-lg font-black text-red-400">
                                {metric.hard_solved}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                    {metric.rank_rating && (
                      <div className="flex items-center justify-between p-4 bg-slate-900/60 border border-white/5 rounded-2xl">
                        <div className="flex items-center space-x-3">
                          <TrendingUp className="w-5 h-5 text-cyan-400" />
                          <span className="text-slate-300 font-bold text-xs uppercase tracking-wider">Platform Rating</span>
                        </div>
                        <span className="text-xl font-black text-cyan-400">{metric.rank_rating}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Sync {formatDate(metric.last_updated)}</span>
                  </div>
                  <a
                    href={metric.profile_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-xl transition-all text-xs font-black uppercase tracking-wider text-white shadow-neon-cyan/20"
                  >
                    <span>Launch</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-20 max-w-4xl mx-auto bg-white/[0.01] border border-white/5 rounded-3xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 cyber-grid-dense opacity-[0.03] pointer-events-none"></div>
          <h2 className="text-xl font-black uppercase tracking-wider text-cyan-400 mb-4">Core Problem Solving Journey</h2>
          <p className="text-slate-400 font-light leading-relaxed text-sm max-w-2xl mx-auto">
            I consistently maintain an active presence on algorithmic environments to sharpen cognitive speed and master advanced data structures. Solving dynamic programming, graph networks, and structural algorithms keeps me sharp and production ready.
          </p>
        </div>
      </div>
    </div>
  );
}
