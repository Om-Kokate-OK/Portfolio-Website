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

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader className="animate-spin text-blue-500" /></div>;

  return (
    <div className="min-h-screen py-24 bg-[#050505] text-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-24">
          <h1 className="text-6xl font-black mb-6 tracking-tight">Skills & Tech Stack</h1>
          <p className="text-slate-500 max-w-xl mx-auto text-lg font-light">A comprehensive toolkit of technologies mastered through research and production.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {Object.entries(groupedSkills).map(([category, skills]: any) => {
            const theme = getTheme(category);
            const Icon = theme.icon;
            return (
              <div key={category} className="bg-[#0f0f0f] rounded-[3rem] p-10 border border-white/5 shadow-2xl group/card transition-all hover:border-white/10">
                <div className="flex items-center gap-5 mb-3">
                  <div className="p-4 bg-white/5 rounded-[1.2rem] group-hover/card:bg-white/10 transition-colors">
                    <Icon className={theme.color} size={28} />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">{category}</h2>
                </div>
                <p className="text-slate-600 text-sm mb-12 font-medium ml-2 uppercase tracking-widest">{theme.desc}</p>

                <div className="space-y-9">
                  {skills.sort((a:any, b:any) => a.display_order - b.display_order).map((skill: any) => {
                    const slug = TECH_SLUGS[skill.skill_name] || 'codeforces';
                    const percent = getProgress(skill.proficiency_level);
                    return (
                      <div key={skill._id} className="group/item">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center border border-white/10 p-2.5">
                            <img src={`https://cdn.simpleicons.org/${slug}`} className="w-full h-full object-contain brightness-150 group-hover/item:brightness-200 transition-all" alt="" />
                          </div>
                          <span className="font-bold text-slate-300 group-hover/item:text-white transition-colors">{skill.skill_name}</span>
                        </div>
                        <div className="flex items-center gap-5">
                          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full ${theme.bar} rounded-full transition-all duration-1000 ease-in-out`} style={{ width: percent }} />
                          </div>
                          <span className={`text-[11px] font-black tracking-tighter w-8 text-right ${theme.color}`}>{percent}</span>
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