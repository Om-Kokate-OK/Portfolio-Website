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
    <div className="min-h-screen py-20 bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Coding Profile
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            My competitive programming journey across various platforms
          </p>
        </div>

        {metrics.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              No coding metrics added yet. Add your coding platform stats in the admin panel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {metrics.map((metric) => (
              <div
                key={metric._id}
                className="group bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700 hover:border-cyan-500 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                      {metric.platform_name}
                    </h3>
                    <p className="text-gray-400">@{metric.username}</p>
                  </div>
                  {metric.badge_icon_url && (
                    <img
                      src={metric.badge_icon_url}
                      alt={`${metric.platform_name} badge`}
                      className="w-12 h-12 rounded-lg"
                    />
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <span className="text-gray-300">Total Solved</span>
                    </div>
                    <span className="text-2xl font-bold text-cyan-400">{metric.total_solved}</span>
                  </div>

                  {(metric.easy_solved !== null ||
                    metric.medium_solved !== null ||
                    metric.hard_solved !== null) && (
                      <div className="grid grid-cols-3 gap-2">
                        {metric.easy_solved !== null && (
                          <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                            <div className="text-xs text-gray-400 mb-1">Easy</div>
                            <div className="text-lg font-bold text-green-400">
                              {metric.easy_solved}
                            </div>
                          </div>
                        )}
                        {metric.medium_solved !== null && (
                          <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                            <div className="text-xs text-gray-400 mb-1">Medium</div>
                            <div className="text-lg font-bold text-yellow-400">
                              {metric.medium_solved}
                            </div>
                          </div>
                        )}
                        {metric.hard_solved !== null && (
                          <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                            <div className="text-xs text-gray-400 mb-1">Hard</div>
                            <div className="text-lg font-bold text-red-400">
                              {metric.hard_solved}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  {metric.rank_rating && (
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="w-5 h-5 text-cyan-500" />
                        <span className="text-gray-300">Rating</span>
                      </div>
                      <span className="text-xl font-bold text-cyan-400">{metric.rank_rating}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-700">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Updated {formatDate(metric.last_updated)}</span>
                  </div>
                  <a
                    href={metric.profile_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors text-sm font-medium"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-20 max-w-4xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
          <h2 className="text-2xl font-bold mb-4 text-center">About My Coding Journey</h2>
          <p className="text-gray-300 text-center leading-relaxed">
            I regularly practice algorithmic problem-solving to sharpen my programming skills and stay
            updated with data structures and algorithms. These platforms help me maintain a
            competitive edge and continuously improve my problem-solving abilities.
          </p>
        </div>
      </div>
    </div>
  );
}
