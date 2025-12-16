import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star, X, Save, Loader } from 'lucide-react';
import { api } from '../../../lib/api';

interface Project {
  _id: string;
  title: string;
  short_description: string;
  detailed_description?: string;
  my_contribution?: string;
  tech_stack: string[];
  github_url?: string;
  live_demo_url?: string;
  image_urls: string[];
  featured: boolean;
  display_order: number;
  created_at: string;
}

interface ProjectInsert {
  title: string;
  short_description: string;
  detailed_description?: string;
  my_contribution?: string;
  tech_stack: string[];
  github_url?: string;
  live_demo_url?: string;
  image_urls: string[];
  featured: boolean;
  display_order: number;
}

/* ===================== ONLY NEW HELPER ===================== */
const convertToDirectImageUrl = (url: string) => {
  // GitHub blob → raw
  if (url.includes('github.com') && url.includes('/blob/')) {
    return url
      .replace('github.com', 'raw.githubusercontent.com')
      .replace('/blob/', '/');
  }

  // Google Drive → direct image
  if (url.includes('drive.google.com')) {
    const match = url.match(/\/d\/([^/]+)/);
    if (match) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
  }

  return url;
};
/* ========================================================== */

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectInsert>({
    title: '',
    short_description: '',
    detailed_description: '',
    my_contribution: '',
    tech_stack: [],
    github_url: '',
    live_demo_url: '',
    image_urls: [],
    featured: false,
    display_order: 0,
  });
  const [techInput, setTechInput] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        short_description: project.short_description,
        detailed_description: project.detailed_description,
        my_contribution: project.my_contribution,
        tech_stack: project.tech_stack,
        github_url: project.github_url,
        live_demo_url: project.live_demo_url,
        image_urls: project.image_urls,
        featured: project.featured,
        display_order: project.display_order,
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        short_description: '',
        detailed_description: '',
        my_contribution: '',
        tech_stack: [],
        github_url: '',
        live_demo_url: '',
        image_urls: [],
        featured: false,
        display_order: projects.length,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setTechInput('');
    setImageInput('');
  };

  const addTech = () => {
    if (techInput.trim()) {
      setFormData({
        ...formData,
        tech_stack: [...formData.tech_stack, techInput.trim()],
      });
      setTechInput('');
    }
  };

  const removeTech = (index: number) => {
    setFormData({
      ...formData,
      tech_stack: formData.tech_stack.filter((_, i) => i !== index),
    });
  };

  /* ============ ONLY FIXED FUNCTION (NO UI CHANGE) ============ */
  const addImage = () => {
    if (!imageInput.trim()) return;

    const directUrl = convertToDirectImageUrl(imageInput.trim());

    setFormData({
      ...formData,
      image_urls: [...formData.image_urls, directUrl],
    });

    setImageInput('');
  };
  /* =========================================================== */

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      image_urls: formData.image_urls.filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingProject) {
        await api.put(`/projects/${editingProject._id}`, formData);
      } else {
        await api.post('/projects', formData);
      }
      await fetchProjects();
      closeModal();
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      await fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  /* ===================== UI BELOW (UNCHANGED) ===================== */
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
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-gray-400">Manage your portfolio projects</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800"
          >
            {project.image_urls.length > 0 && (
              <div className="aspect-video bg-slate-800">
                <img
                  src={project.image_urls[0]}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold text-white">{project.title}</h3>
                {project.featured && <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />}
              </div>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {project.short_description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech_stack.slice(0, 3).map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-slate-800 text-cyan-400 text-xs rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openModal(project)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-20 bg-slate-900 rounded-xl border border-slate-800">
          <p className="text-gray-400 mb-4">No projects yet</p>
          <button
            onClick={() => openModal()}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
          >
            Add Your First Project
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-800">
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Short Description *
                </label>
                <textarea
                  rows={2}
                  value={formData.short_description}
                  onChange={(e) =>
                    setFormData({ ...formData, short_description: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-white resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Detailed Description
                </label>
                <textarea
                  rows={4}
                  value={formData.detailed_description}
                  onChange={(e) =>
                    setFormData({ ...formData, detailed_description: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  My Contribution
                </label>
                <textarea
                  rows={4}
                  value={formData.my_contribution}
                  onChange={(e) => setFormData({ ...formData, my_contribution: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-white resize-none"
                  placeholder="Describe your specific role and contributions..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tech Stack
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                    className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-white"
                    placeholder="Add technology"
                  />
                  <button
                    type="button"
                    onClick={addTech}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tech_stack?.map((tech, idx) => (
                    <span
                      key={idx}
                      className="flex items-center space-x-2 px-3 py-1 bg-slate-800 text-cyan-400 rounded-full"
                    >
                      <span>{tech}</span>
                      <button type="button" onClick={() => removeTech(idx)}>
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.github_url || ''}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={formData.live_demo_url || ''}
                    onChange={(e) => setFormData({ ...formData, live_demo_url: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image URLs
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="url"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                    className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-white"
                    placeholder="Add image URL"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {formData.image_urls?.map((url, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${idx + 1}`}
                        className="w-full aspect-video object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 bg-slate-800 border-slate-700 rounded focus:ring-2 focus:ring-cyan-500"
                  />
                  <span className="text-gray-300">Featured Project</span>
                </label>

                <div className="flex items-center space-x-2">
                  <label className="text-gray-300">Display Order:</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) =>
                      setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
                    }
                    className="w-20 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-white"
                  />
                </div>
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
                disabled={saving || !formData.title || !formData.short_description}
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
                    <span>Save Project</span>
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
