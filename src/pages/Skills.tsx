import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Code2, Database, Layout, Server, Smartphone, Wrench, Cpu, Terminal, Loader } from 'lucide-react';

const TECH_SLUGS: Record<string, string> = {
  'C++': 'cplusplus', 'Python': 'python', 'Java': 'java', 'JavaScript': 'javascript', 'TypeScript': 'typescript', 'Go': 'go',
  'HTML5': 'html5', 'CSS3': 'css3', 'React.js': 'react', 'Next.js': 'nextdotjs', 'Tailwind CSS': 'tailwindcss',
  'Node.js': 'nodedotjs', 'Express.js': 'express', 'NestJS': 'nestjs', 'Django': 'django', 'FastAPI': 'fastapi',
  'Android (Java)': 'android', 'Flutter': 'flutter', 'MySQL': 'mysql', 'PostgreSQL': 'postgresql', 'MongoDB': 'mongodb',
  'Firebase Firestore': 'firebase', 'Firebase Realtime DB': 'firebase', 'MongoDB Atlas': 'mongodb', 'AWS': 'amazonaws',
  'Vercel': 'vercel', 'TensorFlow': 'tensorflow', 'PyTorch': 'pytorch', 'Scikit-learn': 'scikitlearn', 'OpenCV': 'opencv',
  'Git': 'git', 'Docker': 'docker', 'Linux': 'linux', 'Postman': 'postman', 'GitHub Actions': 'githubactions',
  'Nginx': 'nginx', 'IoT': 'arduino', 'ESP32 / ESP8266': 'espressif'
};

export default function Skills() {
  const [groupedSkills, setGroupedSkills] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await api.get('/skills');
        const grouped = response.data.reduce((acc: any, skill: any) => {
          if (!acc[skill.category]) acc[skill.category] = [];
          acc[skill.category].push(skill);
          return acc;
        }, {});
        setGroupedSkills(grouped);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchSkills();
  }, []);

  const getTheme = (cat: string) => {
    const themes: any = {
      'Programming Languages': { icon: Code2, color: 'text-amber-400', bar: 'bg-amber-500', desc: 'Core logic & development' },
      'Frontend': { icon: Layout, color: 'text-blue-400', bar: 'bg-blue-500', desc: 'UI & User Experience' },
      'Backend': { icon: Server, color: 'text-emerald-400', bar: 'bg-emerald-500', desc: 'Logic & API Systems' },
      'Databases & Cloud': { icon: Database, color: 'text-cyan-400', bar: 'bg-cyan-500', desc: 'Data & Infrastructure' },
      'AI & ML': { icon: Cpu, color: 'text-purple-400', bar: 'bg-purple-500', desc: 'Intelligence & Modeling' },
      'Mobile Development': { icon: Smartphone, color: 'text-pink-400', bar: 'bg-pink-500', desc: 'Mobile Applications' },
      'Tools & Infrastructure': { icon: Wrench, color: 'text-slate-400', bar: 'bg-slate-500', desc: 'DevOps & Tooling' },
    };
    return themes[cat] || { icon: Terminal, color: 'text-gray-400', bar: 'bg-gray-500', desc: 'Technical Skills' };
  };

  const getProgress = (level?: string) => ({ 'Expert': '95%', 'Advanced': '85%', 'Intermediate': '70%' }[level || ''] || '50%');

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader className="animate-spin text-cyan-500" /></div>;

  return (
    <div className="min-h-screen py-24 bg-slate-950 text-white relative overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 cyber-grid opacity-[0.06] pointer-events-none"></div>
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5 shadow-neon-cyan/5 mx-auto">
            <Code2 size={14} className="text-cyan-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Technical Capability</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
            Tech Stack
          </h1>
          <p className="text-slate-400 font-light max-w-xl mx-auto text-lg leading-relaxed">
            A comprehensive toolbox of technologies mastered through research, development, and system deployments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(groupedSkills).map(([category, skills]: any) => {
            const theme = getTheme(category);
            const Icon = theme.icon;
            return (
              <div key={category} className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-cyan-500/30 rounded-3xl p-8 shadow-2xl transition-all duration-500 flex flex-col justify-between group/card">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3.5 bg-white/5 rounded-2xl group-hover/card:bg-cyan-500/10 border border-white/5 group-hover/card:border-cyan-500/25 transition-all">
                      <Icon className={theme.color} size={24} />
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-white">{category}</h2>
                  </div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-8">{theme.desc}</p>
                </div>

                <div className="space-y-6">
                  {skills.sort((a:any, b:any) => a.display_order - b.display_order).map((skill: any) => {
                    const slug = TECH_SLUGS[skill.skill_name] || 'codeforces';
                    const percent = getProgress(skill.proficiency_level);
                    return (
                      <div key={skill._id} className="space-y-2 group/item">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center border border-white/10 p-2">
                            <img src={`https://cdn.simpleicons.org/${slug}`} className="w-full h-full object-contain filter brightness-90 group-hover/item:brightness-100 transition-all" alt="" />
                          </div>
                          <span className="text-xs font-bold text-slate-300 group-hover/item:text-white transition-all">{skill.skill_name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full ${theme.bar} rounded-full transition-all duration-1000`} style={{ width: percent }} />
                          </div>
                          <span className={`text-[10px] font-black w-6 text-right ${theme.color}`}>{percent}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}