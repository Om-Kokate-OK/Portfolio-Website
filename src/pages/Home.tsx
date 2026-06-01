import { useEffect, useState, useRef } from 'react';
import {
  ArrowUpRight,
  FileDown,
  Copy,
  Check,
  MessageSquare,
  Server,
  Layout,
  Database,
  ExternalLink,
  Calendar,
  Code2,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { api } from '../lib/api';

interface WorkHistoryItem {
  role: string;
  company: string;
  duration: string;
}

interface TestimonialItem {
  quote: string;
  client: string;
  title: string;
  date: string;
}

interface ServiceItem {
  title: string;
  icon: string;
  description: string;
  skills: string[];
}

interface Profile {
  full_name: string;
  headline: string;
  about_me: string;
  email: string;
  phone?: string;
  location?: string;
  profile_image_url?: string;
  resume_url?: string;
  linkedin_url?: string;
  github_url?: string;
  work_history?: WorkHistoryItem[];
  testimonials?: TestimonialItem[];
  services?: ServiceItem[];
}

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
}

interface Skill {
  _id: string;
  skill_name: string;
  category: string;
  proficiency_level: string;
}

interface Certificate {
  _id: string;
  title: string;
  issuer: string;
  date_issued: string;
  description?: string;
  credential_url?: string;
}

const TECH_SLUGS: Record<string, string> = {
  'C++': 'cplusplus', 'Python': 'python', 'Java': 'java', 'JavaScript': 'javascript', 'TypeScript': 'typescript', 'Go': 'go',
  'HTML5': 'html5', 'CSS3': 'css3', 'React.js': 'react', 'Next.js': 'nextdotjs', 'Tailwind CSS': 'tailwindcss',
  'Node.js': 'nodedotjs', 'Express.js': 'express', 'NestJS': 'nestjs', 'Django': 'django', 'FastAPI': 'fastapi',
  'Android (Java)': 'android', 'Flutter': 'flutter', 'MySQL': 'mysql', 'PostgreSQL': 'postgresql', 'MongoDB': 'mongodb',
  'Firebase Firestore': 'firebase', 'Firebase Realtime DB': 'firebase', 'MongoDB Atlas': 'mongodb', 'AWS': 'amazonaws',
  'Vercel': 'vercel', 'TensorFlow': 'tensorflow', 'PyTorch': 'pytorch', 'Scikit-learn': 'scikitlearn', 'OpenCV': 'opencv',
  'Git': 'git', 'Docker': 'docker', 'Linux': 'linux', 'Postman': 'postman', 'GitHub Actions': 'githubactions',
  'Nginx': 'nginx', 'IoT': 'arduino', 'ESP32 / ESP8266': 'espressif', 'C Programming': 'c', 'C#': 'csharp', 'PHP': 'php',
  'Internet of Things (IoT)': 'arduino', 'Google Firebase': 'firebase', 'GitHub': 'github', 'SQL': 'sqlite'
};

const getTheme = (cat: string) => {
  const themes: any = {
    'Programming Languages': { color: 'text-amber-400', bar: 'bg-amber-500', desc: 'Core logic & development' },
    'Frontend': { color: 'text-blue-400', bar: 'bg-blue-500', desc: 'UI & User Experience' },
    'Backend': { color: 'text-emerald-400', bar: 'bg-emerald-500', desc: 'Logic & API Systems' },
    'Databases & Cloud': { color: 'text-cyan-400', bar: 'bg-cyan-500', desc: 'Data & Infrastructure' },
    'AI & ML': { color: 'text-purple-400', bar: 'bg-purple-500', desc: 'Intelligence & Modeling' },
    'Mobile Development': { color: 'text-pink-400', bar: 'bg-pink-500', desc: 'Mobile Applications' },
    'Tools & Infrastructure': { color: 'text-slate-400', bar: 'bg-slate-500', desc: 'DevOps & Tooling' },
  };
  return themes[cat] || { color: 'text-gray-400', bar: 'bg-gray-500', desc: 'Technical Skills' };
};

const getProgress = (level?: string) => ({ 'Expert': '95%', 'Advanced': '85%', 'Intermediate': '70%', 'Beginner': '50%' }[level || ''] || '70%');

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Testimonial active slide state
  const [activeSlide, setActiveSlide] = useState(0);

  // Carousel & Immersive Specification Catalog Specs Drawer state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -450, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 450, behavior: 'smooth' });
    }
  };

  const handleEnquire = (projectTitle: string) => {
    setSelectedProject(null);
    setContactMessage(`Hello Om, I am interested in your system "${projectTitle}". Let's sync up and coordinate custom development!`);
    
    setTimeout(() => {
      const element = document.getElementById('contact-view');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      
      const nameInput = document.getElementById('contact-name-input');
      if (nameInput) {
        nameInput.focus();
      }
    }, 400);
  };

  const testimonials = [
    {
      quote: "Om is a rare software engineer who combines deep systems expertise with clean, premium design sensibilities. He built AetherDB's replica sync engine flawlessly.",
      client: "Sarah Jenkins",
      title: "Lead Architect at CoreSystems",
      date: "Dec 2025"
    },
    {
      quote: "Working with Om on the EcoSphere green dashboard was stellar. Real-time updates operate at sub-millisecond rates and visually looks state-of-the-art.",
      client: "Marcus Aurelius",
      title: "Director of IoT, GreenFuture",
      date: "Oct 2025"
    },
    {
      quote: "Skyline whiteboard synchronization felt like magic. Om resolved complicated vector overlaps easily using YJS sync protocols.",
      client: "Dianne Chen",
      title: "VP of Product, MultiSync",
      date: "Jan 2026"
    }
  ];

  const testimonialsToDisplay = profile?.testimonials && profile.testimonials.length > 0
    ? profile.testimonials
    : testimonials;

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layout':
        return <Layout className="w-5 h-5 text-[#888888] group-hover:text-white transition-colors" />;
      case 'Server':
        return <Server className="w-5 h-5 text-[#888888] group-hover:text-white transition-colors" />;
      case 'Database':
        return <Database className="w-5 h-5 text-[#888888] group-hover:text-white transition-colors" />;
      default:
        return <Layout className="w-5 h-5 text-[#888888] group-hover:text-white transition-colors" />;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, projectsRes, skillsRes, certificatesRes] = await Promise.all([
          api.get('/profile').catch(() => ({ data: null })),
          api.get('/projects').catch(() => ({ data: [] })),
          api.get('/skills').catch(() => ({ data: [] })),
          api.get('/certificates').catch(() => ({ data: [] })),
        ]);

        if (profileRes.data) setProfile(profileRes.data);
        setProjects(projectsRes.data || []);
        setSkills(skillsRes.data || []);
        setCertificates(certificatesRes.data || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile?.email || 'omkokate5325@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await api.post('/contact', {
        name: contactName,
        email: contactEmail,
        message: contactMessage
      });
      setFormSuccess(true);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setTimeout(() => setFormSuccess(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center font-mono-labels text-xs uppercase tracking-widest">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mr-4"></div>
        <span>Syncing layout baseline...</span>
      </div>
    );
  }

  const nameSplit = (profile?.full_name || 'OM KOKATE').toUpperCase().split(' ');
  const firstName = nameSplit[0] || 'OM';
  const lastName = nameSplit.slice(1).join(' ') || 'KOKATE';

  // Dynamic Skill Category Mapping from MongoDB
  const frontendPills = skills
    .filter(s => s.category === 'Frontend' || s.category === 'Mobile Development')
    .map(s => s.skill_name);
  const displayFrontend = frontendPills.length > 0
    ? frontendPills
    : ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'];

  const backendPills = skills
    .filter(s => s.category === 'Programming Languages' || s.category === 'Backend')
    .map(s => s.skill_name);
  const displayBackend = backendPills.length > 0
    ? backendPills
    : ['Node.js', 'Go', 'Express', 'gRPC', 'MQTT WebSockets'];

  const infraPills = skills
    .filter(s => s.category === 'Databases & Cloud' || s.category === 'Tools & Infrastructure')
    .map(s => s.skill_name);
  const displayInfra = infraPills.length > 0
    ? infraPills
    : ['AWS Cloud', 'Docker', 'Kubernetes', 'MongoDB', 'GitHub Actions'];

  return (
    <div className="bg-[#000000] text-white relative min-h-screen border-x border-white/10 max-w-[1600px] mx-auto select-none overflow-x-hidden" id="hero-view">
      
      {/* PHASE 2: TYPOGRAPHY-HEAVY HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col justify-between border-b border-white/10">
        
        {/* Wireframe grids backing the hero */}
        <div className="absolute inset-0 grid grid-cols-4 pointer-events-none">
          <div className="border-r border-white/5"></div>
          <div className="border-r border-white/5"></div>
          <div className="border-r border-white/5"></div>
          <div></div>
        </div>

        <div className="w-full flex-grow flex items-center justify-center px-6 sm:px-12 relative z-10 py-16">
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            
            {/* Massive kinetic headings */}
            <div className="lg:col-span-2 space-y-4">
              <h1 className="text-7xl sm:text-9xl md:text-[11rem] leading-[0.8] font-black tracking-tighter text-white uppercase select-none">
                <span className="block">{firstName}</span>
                <span className="block bg-gradient-to-r from-white via-white to-[#888888] bg-clip-text text-transparent">{lastName}</span>
              </h1>
              
              {/* Monospace Metadata subtitle */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-8 pt-8 font-mono-labels text-xs uppercase tracking-widest text-[#888888]">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span>{profile?.headline || 'Award Winning Software Engineer'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#888888]"></span>
                  <span>Full-Stack Architect & Founder</span>
                </div>
              </div>
            </div>

            {/* Real-time Dynamic Profile Photo Card */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[340px] aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 bg-slate-900 shadow-2xl p-1 group">
                {profile?.profile_image_url ? (
                  <img
                    src={profile.profile_image_url}
                    alt={profile.full_name || 'Om Sachin Kokate'}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://pin.it/1dUsleJI8';
                    }}
                    className="w-full h-full object-cover rounded-[1.8rem] opacity-80 brightness-90 filter contrast-[1.05] grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-[#111] rounded-[1.8rem] flex items-center justify-center border border-white/5">
                    <Code2 size={48} className="text-slate-700 animate-pulse" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent flex flex-col justify-end p-6">
                  <span className="text-[10px] font-mono-labels uppercase tracking-widest text-[#888888] mb-1">System Environment</span>
                  <span className="text-xs uppercase font-bold text-white tracking-wider flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Direct-Query Raft Cons.</span>
                  </span>
                  <span className="text-[10px] font-mono-labels uppercase tracking-widest text-slate-400 mt-1.5 flex items-center space-x-2">
                    <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                    <span>{skills.length} Capabilities Verified</span>
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Framer motion infinite scrolling marquee */}
        <div className="w-full bg-white text-black py-5 border-t border-white/10 overflow-hidden font-mono-labels text-xs font-black uppercase tracking-widest relative z-10 flex">
          <div className="animate-marquee flex space-x-12 shrink-0">
            <span>4+ Years of Professional Experience // 15+ High-Performance Systems // Zero-Latency Engineering // Open-Source Dev //</span>
            <span>4+ Years of Professional Experience // 15+ High-Performance Systems // Zero-Latency Engineering // Open-Source Dev //</span>
          </div>
          <div className="animate-marquee flex space-x-12 shrink-0" aria-hidden="true">
            <span>4+ Years of Professional Experience // 15+ High-Performance Systems // Zero-Latency Engineering // Open-Source Dev //</span>
            <span>4+ Years of Professional Experience // 15+ High-Performance Systems // Zero-Latency Engineering // Open-Source Dev //</span>
          </div>
        </div>

      </section>

      {/* PHASE 3: SERVICES GRID (WHAT I DO BEST) */}
      <section className="relative py-28 border-b border-white/10" id="services-view">
        <div className="px-6 sm:px-12 max-w-[1600px] mx-auto">
          
          <div className="mb-16">
            <span className="text-xs font-mono-labels uppercase tracking-widest text-[#888888]">/ Services, Skills, Abilities</span>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white mt-3">What I Do Best</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border border-white/10 rounded-2xl overflow-hidden bg-white/[0.01]">
            {profile?.services && profile.services.length > 0 ? (
              profile.services.map((service, idx) => (
                <div
                  key={idx}
                  className={`p-8 sm:p-10 border-b md:border-b-0 ${
                    idx < (profile?.services?.length || 0) - 1 ? 'md:border-r border-white/10' : ''
                  } hover:bg-white/[0.02] transition-colors group`}
                >
                  <span className="font-mono-labels text-[#888888] text-xs">
                    {String(idx + 1).padStart(2, '0')}.
                  </span>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white mt-4 flex items-center justify-between">
                    <span>{service.title}</span>
                    {getServiceIcon(service.icon)}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mt-6 font-light">
                    {service.description}
                  </p>
                  
                  {service.skills && service.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-12">
                      {service.skills.map(tech => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono-labels uppercase tracking-wider text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <>
                {/* Column 1: Frontend Architecture */}
                <div className="p-8 sm:p-10 border-b md:border-b-0 md:border-r border-white/10 hover:bg-white/[0.02] transition-colors group">
                  <span className="font-mono-labels text-[#888888] text-xs">01.</span>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white mt-4 flex items-center justify-between">
                    <span>Frontend Architecture</span>
                    <Layout className="w-5 h-5 text-[#888888] group-hover:text-white transition-colors" />
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mt-6 font-light">
                    Crafting outstanding single-page systems and user interfaces that respond instantly. Balancing extreme performance benchmarks with gorgeous dark visual aesthetics.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 pt-12">
                    {displayFrontend.map(tech => (
                      <span key={tech} className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono-labels uppercase tracking-wider text-slate-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Column 2: Backend & Distributed Systems */}
                <div className="p-8 sm:p-10 border-b md:border-b-0 md:border-r border-white/10 hover:bg-white/[0.02] transition-colors group">
                  <span className="font-mono-labels text-[#888888] text-xs">02.</span>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white mt-4 flex items-center justify-between">
                    <span>Backend Systems</span>
                    <Server className="w-5 h-5 text-[#888888] group-hover:text-white transition-colors" />
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mt-6 font-light">
                    Building zero-latency micro-services and concurrent pipelines. Experienced in Raft consensus structures, LSM-tree key-value lookups, and strong linear consistency.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 pt-12">
                    {displayBackend.map(tech => (
                      <span key={tech} className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono-labels uppercase tracking-wider text-slate-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Column 3: Cloud & Databases */}
                <div className="p-8 sm:p-10 hover:bg-white/[0.02] transition-colors group">
                  <span className="font-mono-labels text-[#888888] text-xs">03.</span>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white mt-4 flex items-center justify-between">
                    <span>Cloud & Infrastructure</span>
                    <Database className="w-5 h-5 text-[#888888] group-hover:text-white transition-colors" />
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mt-6 font-light">
                    Scaling dockerized cluster deployments under zero-downtime environments. Automating high-fidelity CI/CD loops and monitoring distributed database workloads.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 pt-12">
                    {displayInfra.map(tech => (
                      <span key={tech} className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono-labels uppercase tracking-wider text-slate-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </section>

      {/* PHASE 3.5: DYNAMIC SKILLS SHARD DIRECTORY */}
      <section className="relative py-28 border-b border-white/10" id="skills-view">
        <div className="px-6 sm:px-12 max-w-[1600px] mx-auto">
          
          <div className="mb-16">
            <span className="text-xs font-mono-labels uppercase tracking-widest text-[#888888]">/ Technical Shards</span>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white mt-3">Capabilities Directory</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(
              skills.reduce((acc: any, skill: any) => {
                if (!acc[skill.category]) acc[skill.category] = [];
                acc[skill.category].push(skill);
                return acc;
              }, {})
            ).map(([category, catSkills]: any) => {
              const theme = getTheme(category);
              return (
                <div key={category} className="bg-white/[0.01] border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-300 group/card">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold uppercase tracking-tight text-white">{category}</h3>
                    <p className="text-[9px] font-mono-labels uppercase tracking-widest text-slate-500 mt-1">{theme.desc}</p>
                  </div>

                  <div className="space-y-6">
                    {catSkills.map((skill: any) => {
                      const slug = TECH_SLUGS[skill.skill_name] || TECH_SLUGS[skill.skill_name.replace(' Programming', '')] || 'codeforces';
                      const percent = getProgress(skill.proficiency_level);
                      return (
                        <div key={skill._id} className="space-y-2 group/skill-item">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center border border-white/10 p-2">
                                <img src={`https://cdn.simpleicons.org/${slug}`} className="w-full h-full object-contain filter brightness-90 group-hover/skill-item:brightness-100 transition-all" alt="" />
                              </div>
                              <span className="text-xs font-bold text-slate-300 group-hover/skill-item:text-white transition-all uppercase tracking-wider">{skill.skill_name}</span>
                            </div>
                            <span className={`text-[10px] font-mono-labels font-black ${theme.color}`}>{percent}</span>
                          </div>
                          
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full ${theme.bar} rounded-full transition-all duration-1000`} style={{ width: percent }}></div>
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
      </section>

      {/* PHASE 4: SOCIAL PROOF / AWARDS & RECOGNITION TIMELINE */}
      <section className="relative py-28 border-b border-white/10" id="timeline-view">
        <div className="px-6 sm:px-12 max-w-[1600px] mx-auto">
          
          <div className="mb-16">
            <span className="text-xs font-mono-labels uppercase tracking-widest text-[#888888]">/ International Credibility</span>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white mt-3">Credentials & Achievements</h2>
          </div>

          <div className="flex flex-col border border-white/10 rounded-2xl bg-white/[0.01] divide-y divide-white/10">
            {certificates.map((cert, idx) => (
              <div key={cert._id} className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between hover:bg-white/[0.02] transition-colors group">
                
                {/* Cert title and Issuer */}
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <span className="font-mono-labels text-xs text-[#888888]">{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}.</span>
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                      {cert.title}
                    </h3>
                    <p className="text-sm font-light text-slate-400 mt-1">{cert.description || 'Verified Professional'}</p>
                  </div>
                </div>

                {/* Date and Platform badge */}
                <div className="flex items-center justify-between md:justify-end space-x-8">
                  <div className="flex items-center space-x-2 text-xs font-mono-labels text-[#888888]">
                    <Calendar size={14} />
                    <span>{new Date(cert.date_issued).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
                  </div>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono-labels uppercase text-slate-300">
                    {cert.issuer}
                  </span>
                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 border border-white/10 rounded-full hover:bg-white hover:text-black transition-colors"
                    >
                      <ArrowUpRight size={14} />
                    </a>
                  )}
                </div>

              </div>
            ))}

            {certificates.length === 0 && (
              <div className="p-12 text-center text-slate-500 font-mono-labels uppercase tracking-widest text-xs">
                No credentials listed currently.
              </div>
            )}
          </div>

        </div>
      </section>

      {/* PHASE 5: SELECTED WORK SHOWCASE */}
      <section className="relative py-28 border-b border-white/10" id="portfolio-view">
        <div className="px-6 sm:px-12 max-w-[1600px] mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div className="max-w-2xl">
              <span className="text-xs font-mono-labels uppercase tracking-widest text-[#888888]">/ Portfolio Projects</span>
              <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white mt-3">Selected Systems</h2>
              <p className="text-slate-400 font-light mt-4 text-sm leading-relaxed">
                A showcase of state-of-the-art web architectures, key-value storage databases, green monitoring dashboards, and real-time multiplayer canvasing tools.
              </p>
            </div>
            <button
              onClick={() => handleCopyEmail()}
              className="mt-6 md:mt-0 flex items-center space-x-2 px-6 py-3 bg-white hover:bg-slate-200 text-black rounded-xl font-mono-labels text-xs uppercase font-black transition-all active:scale-95 border border-transparent shadow-2xl"
            >
              <span>Query Custom Development</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          {/* Horizontal Projects Carousel Track */}
          <div className="relative">
            {/* Scroll Navigation Arrows */}
            <div className="absolute -top-24 right-0 flex space-x-3 z-20">
              <button
                onClick={scrollLeft}
                className="p-3 border border-white/10 hover:border-white rounded-full bg-[#0b0b0b] hover:bg-white hover:text-black transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={scrollRight}
                className="p-3 border border-white/10 hover:border-white rounded-full bg-[#0b0b0b] hover:bg-white hover:text-black transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div
              ref={carouselRef}
              className="flex overflow-x-auto space-x-8 pb-10 scrollbar-hide snap-x snap-mandatory overflow-y-hidden"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {projects.map((project) => (
                <div
                  key={project._id}
                  onClick={() => setSelectedProject(project)}
                  className="snap-start shrink-0 w-[300px] sm:w-[450px] group relative flex flex-col justify-between border border-white/10 rounded-3xl overflow-hidden bg-white/[0.01] hover:border-white/25 hover:bg-white/[0.02] transition-all duration-300 cursor-pointer"
                >
                  {/* Video/Image Placeholder */}
                  <div className="aspect-video bg-slate-950 p-4 relative overflow-hidden border-b border-white/10">
                    {project.image_urls.length > 0 ? (
                      <img
                        src={project.image_urls[0]}
                        alt={project.title}
                        className="w-full h-full object-cover rounded-2xl brightness-90 group-hover:scale-[1.02] group-hover:brightness-100 transition-all duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#111] rounded-2xl flex items-center justify-center border border-white/5">
                        <Code2 size={48} className="text-slate-700 animate-pulse" />
                      </div>
                    )}
                    {/* Floating Tech stack pill absolute */}
                    <div className="absolute top-6 left-6 flex flex-wrap gap-1.5">
                      {project.tech_stack.slice(0, 2).map((tech) => (
                        <span key={tech} className="px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-white rounded-md text-[9px] font-mono-labels uppercase tracking-wider">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-8 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-2xl font-black uppercase tracking-tight text-white group-hover:text-cyan-400 transition-all">
                          {project.title}
                        </h3>
                        <p className="text-slate-400 font-light text-sm mt-2 leading-relaxed line-clamp-2">
                          {project.short_description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-6 text-slate-500 font-mono-labels text-xs uppercase">
                      <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">Explore Spec Catalog →</span>
                      <div className="flex items-center space-x-4">
                        {project.github_url && (
                          <span className="hover:text-white transition-colors p-1">
                            <GithubIcon size={18} />
                          </span>
                        )}
                        {project.live_demo_url && (
                          <span className="hover:text-white transition-colors p-1">
                            <ExternalLink size={16} />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Immersive Brutalist Catalog Specification Modal Overlay */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[9999] p-4 select-none animate-fadeIn">
          <div className="bg-[#0b0b0b] border border-white/10 rounded-[2rem] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-8 space-y-8 relative">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="space-y-2 border-b border-white/10 pb-6">
              <span className="text-[10px] font-mono-labels uppercase tracking-widest text-[#888888]">/ System Specification Catalog</span>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white">{selectedProject.title}</h2>
            </div>

            {/* Specifications Matrix Table */}
            <div className="border border-white/10 rounded-2xl bg-white/[0.01] overflow-hidden divide-y divide-white/10 font-mono-labels text-xs uppercase tracking-wider">
              <div className="grid grid-cols-3 p-4">
                <span className="text-slate-500 font-bold col-span-1">/ Shard ID</span>
                <span className="text-white col-span-2">{selectedProject._id}</span>
              </div>
              <div className="grid grid-cols-3 p-4">
                <span className="text-slate-500 font-bold col-span-1">/ Technology Stack</span>
                <div className="col-span-2 flex flex-wrap gap-1.5">
                  {selectedProject.tech_stack.map(tech => (
                    <span key={tech} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              {selectedProject.my_contribution && (
                <div className="grid grid-cols-3 p-4">
                  <span className="text-slate-500 font-bold col-span-1">/ Contributions</span>
                  <span className="text-slate-300 col-span-2 normal-case font-sans font-light leading-relaxed">{selectedProject.my_contribution}</span>
                </div>
              )}
              <div className="grid grid-cols-3 p-4">
                <span className="text-slate-500 font-bold col-span-1">/ Description</span>
                <span className="text-slate-300 col-span-2 normal-case font-sans font-light leading-relaxed whitespace-pre-line">
                  {selectedProject.detailed_description || selectedProject.short_description}
                </span>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10 justify-between items-center">
              <div className="flex space-x-3">
                {selectedProject.github_url && (
                  <a
                    href={selectedProject.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-5 py-3 border border-white/10 hover:border-white rounded-xl text-xs font-mono-labels font-bold uppercase transition-all"
                  >
                    <span>View Repository</span>
                    <ArrowUpRight size={12} />
                  </a>
                )}
                {selectedProject.live_demo_url && (
                  <a
                    href={selectedProject.live_demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-5 py-3 bg-white hover:bg-slate-200 text-black rounded-xl text-xs font-mono-labels font-black uppercase transition-all"
                  >
                    <span>Launch Live Demo</span>
                    <ArrowUpRight size={12} />
                  </a>
                )}
              </div>
              
              <button
                onClick={() => handleEnquire(selectedProject.title)}
                className="px-6 py-3 border border-[#888888]/20 hover:border-white text-white bg-white/5 hover:bg-white hover:text-black font-mono-labels text-xs uppercase font-black tracking-widest rounded-xl transition-all"
              >
                Enquire about this System
              </button>
            </div>

          </div>
        </div>
      )}

      {/* PHASE 6: EXPERIENCE/CAREER HISTORY TABLE */}
      <section className="relative py-28 border-b border-white/10">
        <div className="px-6 sm:px-12 max-w-[1600px] mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <span className="text-xs font-mono-labels uppercase tracking-widest text-[#888888]">/ Career</span>
              <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white mt-3">Work History</h2>
            </div>
            {profile?.resume_url && (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 md:mt-0 flex items-center space-x-2 px-6 py-3 border border-white/20 hover:border-white text-white rounded-xl font-mono-labels text-xs uppercase font-bold transition-all active:scale-95"
              >
                <FileDown size={14} />
                <span>Download CV / Resume</span>
              </a>
            )}
          </div>

          <div className="flex flex-col border border-white/10 rounded-2xl bg-white/[0.01] divide-y divide-white/10">
            {profile?.work_history && profile.work_history.length > 0 ? (
              profile.work_history.map((job, idx) => (
                <div
                  key={idx}
                  className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 items-center justify-between hover:bg-white/[0.02] transition-colors group"
                >
                  <div className="flex items-center space-x-4 mb-2 md:mb-0">
                    <span className="font-mono-labels text-[#888888] text-xs">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <span className="text-lg font-bold text-white uppercase group-hover:text-cyan-400 transition-colors">
                      {job.role}
                    </span>
                  </div>
                  <div className="text-slate-400 text-sm mb-4 md:mb-0 font-light">
                    {job.company}
                  </div>
                  <div className="md:text-right font-mono-labels text-xs text-[#888888]">
                    {job.duration}
                  </div>
                </div>
              ))
            ) : (
              <>
                {/* Career Row 1 */}
                <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 items-center justify-between hover:bg-white/[0.02] transition-colors group">
                  <div className="flex items-center space-x-4 mb-2 md:mb-0">
                    <span className="font-mono-labels text-[#888888] text-xs">01.</span>
                    <span className="text-lg font-bold text-white uppercase group-hover:text-cyan-400 transition-colors">Founder & Lead Engineer</span>
                  </div>
                  <div className="text-slate-400 text-sm mb-4 md:mb-0 font-light">Om-Kokate Devs</div>
                  <div className="md:text-right font-mono-labels text-xs text-[#888888]">2025 – Present</div>
                </div>

                {/* Career Row 2 */}
                <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 items-center justify-between hover:bg-white/[0.02] transition-colors group">
                  <div className="flex items-center space-x-4 mb-2 md:mb-0">
                    <span className="font-mono-labels text-[#888888] text-xs">02.</span>
                    <span className="text-lg font-bold text-white uppercase group-hover:text-cyan-400 transition-colors">Distributed Systems Developer</span>
                  </div>
                  <div className="text-slate-400 text-sm mb-4 md:mb-0 font-light">TechLabs LLC</div>
                  <div className="md:text-right font-mono-labels text-xs text-[#888888]">2024 – 2025</div>
                </div>

                {/* Career Row 3 */}
                <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 items-center justify-between hover:bg-white/[0.02] transition-colors group">
                  <div className="flex items-center space-x-4 mb-2 md:mb-0">
                    <span className="font-mono-labels text-[#888888] text-xs">03.</span>
                    <span className="text-lg font-bold text-white uppercase group-hover:text-cyan-400 transition-colors">Full-Stack Intern</span>
                  </div>
                  <div className="text-slate-400 text-sm mb-4 md:mb-0 font-light">Global Technologies</div>
                  <div className="md:text-right font-mono-labels text-xs text-[#888888]">2023 – 2024</div>
                </div>
              </>
            )}
          </div>

        </div>
      </section>

      {/* PHASE 7: INFINITE TESTIMONIAL SLIDER & FOOTER */}
      <section className="relative py-28 border-b border-white/10">
        <div className="px-6 sm:px-12 max-w-[1600px] mx-auto">
          
          <div className="mb-16">
            <span className="text-xs font-mono-labels uppercase tracking-widest text-[#888888]">/ Community Trust</span>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white mt-3">What Clients Say</h2>
          </div>

          {/* Testimonial horizontal display */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonialsToDisplay.map((t, idx) => (
              <div
                key={idx}
                className={`p-8 border rounded-3xl bg-white/[0.01] transition-all duration-500 space-y-6 flex flex-col justify-between ${
                  activeSlide === idx
                    ? 'border-white/30 bg-white/[0.03] scale-[1.02]'
                    : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/20'
                }`}
                onClick={() => setActiveSlide(idx)}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <MessageSquare size={16} className="text-[#888888]" />
                    <span className="text-[10px] font-mono-labels text-[#888888]">{t.date}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-light text-sm">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm uppercase">{t.client}</h4>
                    <p className="text-[#888888] text-xs mt-0.5">{t.title}</p>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* HIGH-IMPACT BRUTALIST FOOTER */}
      <footer className="relative py-28 bg-black" id="contact-view">
        <div className="absolute inset-0 cyber-grid-dense opacity-[0.03] pointer-events-none"></div>

        <div className="px-6 sm:px-12 max-w-[1600px] mx-auto relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            <div className="space-y-8">
              <span className="text-xs font-mono-labels uppercase tracking-widest text-[#888888]">/ Contact, Sync, Network</span>
              <h2 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-none text-white">
                HELLO, IT'S ME - <br/> CONTACT ME
              </h2>
              
              <p className="text-slate-400 text-sm leading-relaxed max-w-md font-light">
                Do you have a database scale problem, real-time sync requirement, or custom UI mockup? Drop me a direct coordinate sync!
              </p>

              {/* Monospace contact fields */}
              <div className="space-y-4 font-mono-labels text-xs uppercase tracking-widest text-[#888888] pt-4">
                <div className="flex items-center space-x-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span>E-mail: <button onClick={handleCopyEmail} className="text-white hover:underline lowercase">{profile?.email || 'omkokate5325@gmail.com'}</button></span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span>Phone: <span className="text-white">{profile?.phone || '+91 98765 43210'}</span></span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span>Loc: <span className="text-white">{profile?.location || 'Mumbai, India'}</span></span>
                </div>
              </div>

              {/* Quick Action buttons */}
              <div className="flex flex-wrap gap-4 pt-6">
                <button
                  onClick={() => handleCopyEmail()}
                  className="flex items-center space-x-2 px-6 py-3.5 bg-white hover:bg-slate-200 text-black text-xs font-black uppercase tracking-wider rounded-xl transition-all"
                >
                  {copiedEmail ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedEmail ? 'Copied!' : 'Copy E-mail'}</span>
                </button>
                {profile?.resume_url && (
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-6 py-3.5 border border-white/20 hover:border-white text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                  >
                    <FileDown size={14} />
                    <span>Download CV</span>
                  </a>
                )}
              </div>
            </div>

            {/* Direct coordinate message form */}
            <div className="bg-white/[0.01] border border-white/10 rounded-3xl p-8 space-y-6">
              
              <h3 className="text-xl font-bold uppercase text-white">Direct Message Sync</h3>
              
              {formSuccess && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-xl flex items-center space-x-3 text-emerald-400 text-sm">
                  <Check className="w-5 h-5 flex-shrink-0" />
                  <span>Your message was synced successfully. I will reach out soon!</span>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono-labels uppercase tracking-widest text-[#888888] mb-2 block">Name / Company</label>
                  <input
                    type="text"
                    required
                    id="contact-name-input"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 focus:border-white rounded-xl p-3 text-white outline-none transition-all text-sm font-light"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono-labels uppercase tracking-widest text-[#888888] mb-2 block">Sync Coordinates (E-mail)</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 focus:border-white rounded-xl p-3 text-white outline-none transition-all text-sm font-light"
                    placeholder="name@company.com"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono-labels uppercase tracking-widest text-[#888888] mb-2 block">Project Spec / Message</label>
                  <textarea
                    rows={4}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 focus:border-white rounded-xl p-3 text-white outline-none transition-all text-sm font-light resize-none"
                    placeholder="Describe your project requirement or drop a note..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full py-4 bg-white hover:bg-slate-200 text-black font-black uppercase text-xs tracking-widest rounded-xl transition-all disabled:opacity-50"
                >
                  {formLoading ? 'Syncing...' : 'Sync Coordinates'}
                </button>
              </form>

            </div>

          </div>

          {/* Copyright coordinate bar at the bottom */}
          <div className="mt-28 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs font-mono-labels uppercase tracking-widest text-[#888888] space-y-4 sm:space-y-0">
            <span>{profile?.full_name || 'Om Kokate'} © {new Date().getFullYear()}</span>
            <span>Brutalist Web Layout Framework v1.0.0</span>
          </div>

        </div>
      </footer>

    </div>
  );
}

// Simple Helper component for Github icon vector
function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      height={size}
      viewBox="0 0 16 16"
      width={size}
      className="fill-current"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}
