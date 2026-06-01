import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Save, Loader } from 'lucide-react';
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
    if (confirm('Delete skill shard coordinate?')) {
      await api.delete(`/skills/${id}`);
      fetchSkills();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 font-mono text-xs uppercase tracking-widest text-[#888888]">
        <Loader className="animate-spin text-white mr-3" size={16} />
        <span>Fetching capability sharding...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 select-none">
      
      {/* Title & Setup Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/10 pb-8 relative">
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#888888]">/ Capabilities Registry</span>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">SYS_SKILLS</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-4 border border-white bg-white hover:bg-black text-black hover:text-white font-mono text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Plus size={14} />
          <span>Assign Skill Shard</span>
        </button>
      </div>

      {/* Grid of current skills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map(skill => {
          const tech = TECH_STACK.find(t => t.name === skill.skill_name);
          return (
            <div
              key={skill._id}
              className="bg-black border border-white/10 p-6 rounded-none flex justify-between items-center hover:border-white transition-all duration-300 group relative"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-black rounded-none flex items-center justify-center border border-white/10 p-2">
                  <img 
                    src={`https://cdn.simpleicons.org/${tech?.slug || 'codeforces'}`} 
                    className="w-full h-full object-contain filter brightness-75 group-hover:brightness-100 transition-all duration-300" 
                    alt="" 
                  />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider">{skill.skill_name}</h3>
                  <p className="text-[9px] font-mono text-[#888888] uppercase tracking-widest mt-0.5">{skill.category}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-[8px] font-mono uppercase px-2 py-1 bg-white/5 border border-white/10 text-slate-300">
                  {skill.proficiency_level}
                </span>
                <button
                  onClick={() => handleDelete(skill._id)}
                  className="border border-red-500/20 text-red-500 hover:border-red-500 hover:bg-red-500/10 p-2 transition-all"
                  title="Remove Shard"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          );
        })}

        {skills.length === 0 && (
          <div className="col-span-full py-16 text-center border border-dashed border-white/10 rounded-none text-xs font-mono uppercase tracking-widest text-[#888888]">
            No capabilities registered yet. Add a skill to begin sync.
          </div>
        )}
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[1000] p-4 font-mono">
          <div className="bg-black border border-white/10 p-8 rounded-none w-full max-w-md shadow-2xl relative space-y-6 animate-fadeIn">
            
            {/* Subtle decorative brutalist corner elements */}
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-white"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-white"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white"></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white"></div>

            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h2 className="text-sm font-black uppercase text-white tracking-widest">/ Assign Skill Shard</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#888888] hover:text-white p-1 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="relative">
                <label className="text-[10px] uppercase tracking-widest text-[#888888] mb-2 block">
                  Search Official Stack
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full bg-black border border-white/10 rounded-none p-3 text-white text-xs uppercase tracking-widest outline-none focus:border-white transition-all"
                    placeholder="SEARCH C++, REACT, DOCKER..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <div className="absolute w-full mt-2 bg-black border border-white/10 rounded-none max-h-56 overflow-y-auto z-50 shadow-2xl divide-y divide-white/5">
                      {TECH_STACK.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase())).map(tech => (
                        <button 
                          key={tech.name}
                          onClick={() => handleSelectTech(tech)}
                          className="w-full text-left p-3 hover:bg-white hover:text-black flex items-center gap-3 text-[10px] uppercase tracking-widest transition-all text-[#888888] font-bold"
                        >
                          <img src={`https://cdn.simpleicons.org/${tech.slug}`} className="w-4 h-4 object-contain" alt="" />
                          <span>{tech.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {formData.skill_name && (
                <div className="p-4 bg-white/5 border border-white/10 rounded-none flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[8px] uppercase tracking-widest text-[#888888]">Selected Capability</span>
                    <div className="flex items-center gap-2 mt-1">
                      <img src={`https://cdn.simpleicons.org/${TECH_STACK.find(t => t.name === formData.skill_name)?.slug}`} className="w-4 h-4 object-contain" alt="" />
                      <span className="text-white font-bold uppercase tracking-wider">{formData.skill_name}</span>
                    </div>
                  </div>
                  <span className="text-[8px] uppercase tracking-widest px-2 py-0.5 bg-white/10 text-slate-300">
                    {formData.category}
                  </span>
                </div>
              )}

              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#888888] mb-2 block">
                  Proficiency Rating
                </label>
                <select 
                  className="w-full bg-black border border-white/10 rounded-none p-3 text-white text-xs uppercase tracking-widest outline-none focus:border-white transition-all"
                  value={formData.proficiency_level}
                  onChange={(e) => setFormData({...formData, proficiency_level: e.target.value})}
                >
                  {PROFICIENCY_LEVELS.map(level => (
                    <option key={level} value={level} className="bg-black text-white">{level.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <button 
                onClick={handleSave} 
                disabled={saving || !formData.skill_name}
                className="w-full py-4 bg-white hover:bg-black disabled:opacity-50 text-black hover:text-white border border-white font-black uppercase text-xs tracking-widest transition-all duration-300 flex justify-center items-center gap-2 shadow-2xl"
              >
                {saving ? <Loader className="animate-spin" size={14} /> : <><Save size={14}/> Save Capability</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}