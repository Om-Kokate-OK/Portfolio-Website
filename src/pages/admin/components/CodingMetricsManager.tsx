import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, Loader } from 'lucide-react';
import { api } from '../../../lib/api';

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

interface CodingMetricInsert {
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
}

const COMMON_PLATFORMS = ['LeetCode', 'Codeforces', 'HackerRank', 'CodeChef', 'AtCoder', 'Other'];

export default function CodingMetricsManager() {
  const [metrics, setMetrics] = useState<CodingMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMetric, setEditingMetric] = useState<CodingMetric | null>(null);
  const [formData, setFormData] = useState<CodingMetricInsert>({
    platform_name: '',
    username: '',
    profile_url: '',
    total_solved: 0,
    easy_solved: undefined,
    medium_solved: undefined,
    hard_solved: undefined,
    rank_rating: '',
    badge_icon_url: '',
    display_order: 0,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMetrics();
  }, []);

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

  const openModal = (metric?: CodingMetric) => {
    if (metric) {
      setEditingMetric(metric);
      setFormData({
        platform_name: metric.platform_name,
        username: metric.username,
        profile_url: metric.profile_url,
        total_solved: metric.total_solved,
        easy_solved: metric.easy_solved,
        medium_solved: metric.medium_solved,
        hard_solved: metric.hard_solved,
        rank_rating: metric.rank_rating,
        badge_icon_url: metric.badge_icon_url,
        display_order: metric.display_order,
      });
    } else {
      setEditingMetric(null);
      setFormData({
        platform_name: '',
        username: '',
        profile_url: '',
        total_solved: 0,
        easy_solved: undefined,
        medium_solved: undefined,
        hard_solved: undefined,
        rank_rating: '',
        badge_icon_url: '',
        display_order: metrics.length,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMetric(null);
  };

  const handleSave = async () => {
    if (!formData.platform_name || !formData.username || !formData.profile_url) return;

    setSaving(true);

    try {
      const dataToSave = {
        ...formData,
        last_updated: new Date().toISOString(),
      };

      if (editingMetric) {
        await api.put(`/coding-metrics/${editingMetric._id}`, dataToSave);
      } else {
        await api.post('/coding-metrics', dataToSave);
      }

      await fetchMetrics();
      closeModal();
    } catch (error) {
      console.error('Error saving coding metric:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coding metric?')) return;

    try {
      await api.delete(`/coding-metrics/${id}`);
      await fetchMetrics();
    } catch (error) {
      console.error('Error deleting coding metric:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Coding Metrics</h1>
          <p className="text-gray-400">Manage your coding platform statistics</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Platform</span>
        </button>
      </div>

      {metrics.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 rounded-xl border border-slate-800">
          <p className="text-gray-400 mb-4">No coding metrics yet</p>
          <button
            onClick={() => openModal()}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
          >
            Add Your First Platform
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric) => (
            <div
              key={metric._id}
              className="bg-slate-900 rounded-xl p-6 border border-slate-800"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{metric.platform_name}</h3>
                  <p className="text-sm text-gray-400">@{metric.username}</p>
                </div>
                {metric.badge_icon_url && (
                  <img
                    src={metric.badge_icon_url}
                    alt="Badge"
                    className="w-10 h-10 rounded"
                  />
                )}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                  <span className="text-gray-400">Total Solved</span>
                  <span className="text-xl font-bold text-cyan-400">{metric.total_solved}</span>
                </div>

                {(metric.easy_solved !== null ||
                  metric.medium_solved !== null ||
                  metric.hard_solved !== null) && (
                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      {metric.easy_solved !== null && (
                        <div className="p-2 bg-slate-800 rounded">
                          <div className="text-gray-400">Easy</div>
                          <div className="font-bold text-green-400">{metric.easy_solved}</div>
                        </div>
                      )}
                      {metric.medium_solved !== null && (
                        <div className="p-2 bg-slate-800 rounded">
                          <div className="text-gray-400">Med</div>
                          <div className="font-bold text-yellow-400">{metric.medium_solved}</div>
                        </div>
                      )}
                      {metric.hard_solved !== null && (
                        <div className="p-2 bg-slate-800 rounded">
                          <div className="text-gray-400">Hard</div>
                          <div className="font-bold text-red-400">{metric.hard_solved}</div>
                        </div>
                      )}
                    </div>
                  )}

                {metric.rank_rating && (
                  <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                    <span className="text-gray-400">Rating</span>
                    <span className="font-bold text-cyan-400">{metric.rank_rating}</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => openModal(metric)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(metric._id)}
                  className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-800">
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {editingMetric ? 'Edit Coding Metric' : 'Add New Platform'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Platform Name *
                </label>
                <select
                  value={formData.platform_name}
                  onChange={(e) => setFormData({ ...formData, platform_name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-white"
                  required
                >
                  <option value="">Select platform</option>
                  {COMMON_PLATFORMS.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Total Solved *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.total_solved}
                    onChange={(e) =>
                      setFormData({ ...formData, total_solved: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Profile URL *
                </label>
                <input
                  type="url"
                  value={formData.profile_url}
                  onChange={(e) => setFormData({ ...formData, profile_url: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-white"
                  placeholder="https://..."
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Easy Solved
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.easy_solved || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        easy_solved: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Medium Solved
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.medium_solved || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        medium_solved: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hard Solved
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.hard_solved || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hard_solved: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rank/Rating
                </label>
                <input
                  type="text"
                  value={formData.rank_rating || ''}
                  onChange={(e) => setFormData({ ...formData, rank_rating: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-white"
                  placeholder="e.g., 1500, Knight, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Badge Icon URL
                </label>
                <input
                  type="url"
                  value={formData.badge_icon_url || ''}
                  onChange={(e) => setFormData({ ...formData, badge_icon_url: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-white"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-white"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-900 border-t border-slate-800 p-6 flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={
                  saving || !formData.platform_name || !formData.username || !formData.profile_url
                }
                className="flex items-center space-x-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 rounded-lg transition-colors"
              >
                {saving ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save Metric</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
