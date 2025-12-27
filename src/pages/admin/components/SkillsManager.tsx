import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, Loader, Search } from 'lucide-react';
import { api } from '../../../lib/api';

const TECH_STACK = [
  { name: 'C++', slug: 'cplusplus', category: 'Programming Languages' },
  { name: 'Python', slug: 'python', category: 'Programming Languages' },
  { name: 'Java', slug: 'java', category: 'Programming Languages' },
  { name: 'JavaScript', slug: 'javascript', category: 'Programming Languages' },
  { name: 'TypeScript', slug: 'typescript', category: 'Programming Languages' },
  { name: 'Go', slug: 'go', category: 'Programming Languages' },
  { name: 'HTML5', slug: 'html5', category: 'Frontend' },
  { name: 'CSS3', slug: 'css3', category: 'Frontend' },
  { name: 'React.js', slug: 'react', category: 'Frontend' },
  { name: 'Next.js', slug: 'nextdotjs', category: 'Frontend' },
  { name: 'Tailwind CSS', slug: 'tailwindcss', category: 'Frontend' },
  { name: 'Node.js', slug: 'nodedotjs', category: 'Backend' },
  { name: 'Express.js', slug: 'express', category: 'Backend' },
  { name: 'NestJS', slug: 'nestjs', category: 'Backend' },
  { name: 'Django', slug: 'django', category: 'Backend' },
  { name: 'FastAPI', slug: 'fastapi', category: 'Backend' },
  { name: 'Android (Java)', slug: 'android', category: 'Mobile Development' },
  { name: 'Flutter', slug: 'flutter', category: 'Mobile Development' },
  { name: 'MySQL', slug: 'mysql', category: 'Databases & Cloud' },
  { name: 'PostgreSQL', slug: 'postgresql', category: 'Databases & Cloud' },
  { name: 'MongoDB', slug: 'mongodb', category: 'Databases & Cloud' },
  { name: 'Firebase Firestore', slug: 'firebase', category: 'Databases & Cloud' },
  { name: 'Firebase Realtime DB', slug: 'firebase', category: 'Databases & Cloud' },
  { name: 'MongoDB Atlas', slug: 'mongodb', category: 'Databases & Cloud' },
  { name: 'AWS', slug: 'amazonaws', category: 'Databases & Cloud' },
  { name: 'Vercel', slug: 'vercel', category: 'Databases & Cloud' },
  { name: 'TensorFlow', slug: 'tensorflow', category: 'AI & ML' },
  { name: 'PyTorch', slug: 'pytorch', category: 'AI & ML' },
  { name: 'Scikit-learn', slug: 'scikitlearn', category: 'AI & ML' },
  { name: 'OpenCV', slug: 'opencv', category: 'AI & ML' },
  { name: 'Git', slug: 'git', category: 'Tools & Infrastructure' },
  { name: 'Docker', slug: 'docker', category: 'Tools & Infrastructure' },
  { name: 'Linux', slug: 'linux', category: 'Tools & Infrastructure' },
  { name: 'Postman', slug: 'postman', category: 'Tools & Infrastructure' },
  { name: 'GitHub Actions', slug: 'githubactions', category: 'Tools & Infrastructure' },
  { name: 'Nginx', slug: 'nginx', category: 'Tools & Infrastructure' },
  { name: 'IoT', slug: 'arduino', category: 'Tools & Infrastructure' },
  { name: 'ESP32 / ESP8266', slug: 'espressif', category: 'Tools & Infrastructure' },
].sort((a, b) => a.name.localeCompare(b.name));

const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export default function SkillsManager() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    skill_name: '',
    category: '',
    proficiency_level: 'Intermediate',
    display_order: 0,
  });

  useEffect(() => { fetchSkills(); }, []);

  const fetchSkills = async () => {
    try {
      const response = await api.get('/skills');
      setSkills(response.data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleSelectTech = (tech: any) => {
    setFormData({ ...formData, skill_name: tech.name, category: tech.category });
    setSearchTerm('');
  };

  const handleSave = async () => {
    if (!formData.skill_name) return;
    setSaving(true);
    try {
      await api.post('/skills', formData);
      fetchSkills();
      setShowModal(false);
      setFormData({ skill_name: '', category: '', proficiency_level: 'Intermediate', display_order: 0 });
    } catch (error) { console.error(error); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete skill?')) {
      await api.delete(`/skills/${id}`);
      fetchSkills();
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader className="animate-spin text-cyan-500" /></div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-white">Skills Dashboard</h1>
        <button onClick={() => setShowModal(true)} className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all">
          <Plus size={20} /> Add Technical Skill
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map(skill => {
          const tech = TECH_STACK.find(t => t.name === skill.skill_name);
          return (
            <div key={skill._id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex justify-between items-center group">
              <div className="flex items-center gap-4">
                <img src={`https://cdn.simpleicons.org/${tech?.slug || 'codeforces'}`} className="w-8 h-8" alt="" />
                <div>
                  <h3 className="text-white font-bold">{skill.skill_name}</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-tighter">{skill.category}</p>
                </div>
              </div>
              <button onClick={() => handleDelete(skill._id)} className="text-slate-600 hover:text-red-500 p-2"><Trash2 size={18}/></button>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-white/10 p-8 rounded-[2rem] w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">Assign Language</h2>
              <button onClick={() => setShowModal(false)}><X className="text-slate-500" /></button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Search Official Tech Stack</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-slate-500" size={18} />
                  <input 
                    type="text" 
                    className="w-full bg-black border border-white/10 rounded-xl p-3 pl-10 text-white focus:border-cyan-500 outline-none"
                    placeholder="Search C++, React, Docker..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <div className="absolute w-full mt-2 bg-slate-900 border border-slate-800 rounded-xl max-h-56 overflow-y-auto z-10 shadow-2xl">
                      {TECH_STACK.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase())).map(tech => (
                        <button 
                          key={tech.name}
                          onClick={() => handleSelectTech(tech)}
                          className="w-full text-left p-4 hover:bg-cyan-600 flex items-center gap-4 border-b border-white/5 last:border-0"
                        >
                          <img src={`https://cdn.simpleicons.org/${tech.slug}`} className="w-6 h-6" alt="" />
                          <span className="text-white font-medium">{tech.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {formData.skill_name && (
                <div className="p-4 bg-cyan-600/10 border border-cyan-600/30 rounded-xl">
                  <p className="text-xs text-cyan-500 font-bold uppercase mb-1">Selected</p>
                  <div className="flex items-center gap-2">
                    <img src={`https://cdn.simpleicons.org/${TECH_STACK.find(t => t.name === formData.skill_name)?.slug}`} className="w-5 h-5" alt="" />
                    <span className="text-white font-bold">{formData.skill_name}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Proficiency</label>
                <select 
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-white appearance-none"
                  value={formData.proficiency_level}
                  onChange={(e) => setFormData({...formData, proficiency_level: e.target.value})}
                >
                  {PROFICIENCY_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                </select>
              </div>

              <button 
                onClick={handleSave} 
                disabled={saving || !formData.skill_name}
                className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold text-white transition-all disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {saving ? <Loader className="animate-spin" /> : <><Save size={20}/> Save Skill</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}