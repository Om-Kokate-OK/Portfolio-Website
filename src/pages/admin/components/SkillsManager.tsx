import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, Loader } from 'lucide-react';
import { api } from '../../../lib/api';

interface Skill {
  _id: string;
  skill_name: string;
  category: string;
  proficiency_level?: string;
  years_of_experience?: number;
  display_order: number;
  created_at: string;
}

interface SkillInsert {
  skill_name: string;
  category: string;
  proficiency_level?: string;
  years_of_experience?: number;
  display_order: number;
}

const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const COMMON_CATEGORIES = [
  'Frontend',
  'Backend',
  'Database',
  'DevOps',
  'Mobile',
  'Tools',
  'Other',
];

export default function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState<SkillInsert>({
    skill_name: '',
    category: '',
    proficiency_level: 'Intermediate',
    years_of_experience: undefined,
    display_order: 0,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await api.get('/skills');
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({
        skill_name: skill.skill_name,
        category: skill.category,
        proficiency_level: skill.proficiency_level,
        years_of_experience: skill.years_of_experience,
        display_order: skill.display_order,
      });
    } else {
      setEditingSkill(null);
      setFormData({
        skill_name: '',
        category: '',
        proficiency_level: 'Intermediate',
        years_of_experience: undefined,
        display_order: skills.length,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSkill(null);
  };

  const handleSave = async () => {
    if (!formData.skill_name || !formData.category) return;

    setSaving(true);

    try {
      if (editingSkill) {
        await api.put(`/skills/${editingSkill._id}`, formData);
      } else {
        await api.post('/skills', formData);
      }

      await fetchSkills();
      closeModal();
    } catch (error) {
      console.error('Error saving skill:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      await api.delete(`/skills/${id}`);
      await fetchSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  const groupedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  return (
    <div className="max-w-6xl">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Skills</h1>
          <p className="text-gray-400">Manage your technical skills</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Skill</span>
        </button>
      </div>

      {Object.keys(groupedSkills).length === 0 ? (
        <div className="text-center py-20 bg-slate-900 rounded-xl border border-slate-800">
          <p className="text-gray-400 mb-4">No skills yet</p>
          <button
            onClick={() => openModal()}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
          >
            Add Your First Skill
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="bg-slate-900 rounded-xl p-6 border border-slate-800">
              <h2 className="text-xl font-bold text-cyan-400 mb-4">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySkills.map((skill) => (
                  <div
                    key={skill._id}
                    className="bg-slate-800 rounded-lg p-4 flex justify-between items-start"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{skill.skill_name}</h3>
                      <p className="text-sm text-gray-400">{skill.proficiency_level}</p>
                      {skill.years_of_experience && (
                        <p className="text-xs text-gray-500 mt-1">
                          {skill.years_of_experience} years
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal(skill)}
                        className="p-2 hover:bg-slate-700 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4 text-cyan-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(skill._id)}
                        className="p-2 hover:bg-slate-700 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-800">
            <div className="border-b border-slate-800 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Skill Name *
                </label>
                <input
                  type="text"
                  value={formData.skill_name}
                  onChange={(e) => setFormData({ ...formData, skill_name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-white"
                  placeholder="React, Python, Docker..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-white"
                  required
                >
                  <option value="">Select a category</option>
                  {COMMON_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Proficiency Level *
                </label>
                <select
                  value={formData.proficiency_level}
                  onChange={(e) => setFormData({ ...formData, proficiency_level: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-white"
                >
                  {PROFICIENCY_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.years_of_experience || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      years_of_experience: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-white"
                  placeholder="Optional"
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

            <div className="border-t border-slate-800 p-6 flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.skill_name || !formData.category}
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
                    <span>Save Skill</span>
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
