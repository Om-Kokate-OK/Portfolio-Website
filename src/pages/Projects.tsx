import { useEffect, useState } from 'react';
import { Github, ExternalLink, X, ChevronLeft, ChevronRight, Terminal, Server } from 'lucide-react';
import { api } from '../lib/api';
import { useRouter } from '../hooks/useRouter';

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

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { currentPath } = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        setProjects(response.data);

        const pathParts = currentPath.split('/');
        if (pathParts.length === 3 && pathParts[1] === 'projects') {
          const projectId = pathParts[2];
          const project = response.data.find((p: Project) => p._id === projectId);
          if (project) {
            setSelectedProject(project);
          }
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [currentPath]);

  const nextImage = () => {
    if (selectedProject && selectedProject.image_urls.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === selectedProject.image_urls.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedProject && selectedProject.image_urls.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedProject.image_urls.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 bg-slate-950 relative overflow-hidden">
      {/* Background Cyber Art */}
      <div className="absolute inset-0 cyber-grid opacity-[0.06] pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5 shadow-neon-cyan/5 mx-auto">
            <Server size={14} className="text-cyan-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Production Ready Assets</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
            Systems Directory
          </h1>
          <p className="text-slate-400 font-light max-w-2xl mx-auto text-lg leading-relaxed">
            A comprehensive catalog of my structural software implementations, system layouts, and full-stack solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project._id}
              className="group bg-white/[0.02] hover:bg-white/[0.05] rounded-3xl overflow-hidden border border-white/5 hover:border-cyan-500/30 shadow-2xl transition-all duration-500 cursor-pointer flex flex-col justify-between"
              onClick={() => {
                setSelectedProject(project);
                setCurrentImageIndex(0);
              }}
            >
              <div>
                {project.image_urls.length > 0 ? (
                  <div className="aspect-video overflow-hidden bg-slate-950 p-3">
                    <img
                      src={project.image_urls[0]}
                      alt={project.title}
                      className="w-full h-full object-cover rounded-2xl filter brightness-90 group-hover:scale-[1.03] group-hover:brightness-100 transition-all duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-slate-900/50 flex items-center justify-center border-b border-white/5">
                    <span className="text-slate-600 text-xs font-bold uppercase tracking-widest">No preview available</span>
                  </div>
                )}
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-black tracking-tight text-white group-hover:text-cyan-400 transition-all">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">{project.short_description}</p>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.slice(0, 3).map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white/[0.04] border border-white/5 text-slate-400 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech_stack.length > 3 && (
                    <span className="px-3 py-1 bg-white/[0.04] border border-white/5 text-slate-500 rounded-lg text-[10px] font-bold">
                      +{project.tech_stack.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-xs font-black text-cyan-400 uppercase tracking-widest group-hover:translate-x-1 transition-transform">Explore System →</span>
                  <div className="flex items-center space-x-4 text-slate-500">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-white transition-colors"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {project.live_demo_url && (
                      <a
                        href={project.live_demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl max-w-xl mx-auto">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">No implementations configured yet.</p>
          </div>
        )}
      </div>

      {/* Cyber Glass Slideshow Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-slate-950 border border-white/10 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="sticky top-0 bg-slate-950/80 backdrop-blur-md border-b border-white/5 p-6 flex justify-between items-center z-10">
              <div className="flex items-center space-x-3">
                <Terminal size={18} className="text-cyan-400" />
                <h2 className="text-2xl font-black uppercase tracking-tight text-white">{selectedProject.title}</h2>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {selectedProject.image_urls.length > 0 && (
                <div className="relative rounded-2xl overflow-hidden bg-slate-900/60 p-3 border border-white/5">
                  <img
                    src={selectedProject.image_urls[currentImageIndex]}
                    alt={`${selectedProject.title} - ${currentImageIndex + 1}`}
                    className="w-full aspect-video object-contain rounded-xl"
                  />
                  {selectedProject.image_urls.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-black/80 border border-white/10 rounded-full transition-all text-slate-300 hover:text-white"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-black/80 border border-white/10 rounded-full transition-all text-slate-300 hover:text-white"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
                        {selectedProject.image_urls.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex
                              ? 'bg-cyan-400 w-5'
                              : 'bg-white/40 hover:bg-white/60'
                              }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {selectedProject.tech_stack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-white/[0.03] border border-white/5 text-cyan-400 rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                {selectedProject.github_url && (
                  <a
                    href={selectedProject.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-6 py-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/10 rounded-xl transition-all text-xs font-black uppercase tracking-wider text-slate-300 hover:text-white"
                  >
                    <Github className="w-4 h-4 text-cyan-400" />
                    <span>View Repository</span>
                  </a>
                )}
                {selectedProject.live_demo_url && (
                  <a
                    href={selectedProject.live_demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-xl transition-all text-xs font-black uppercase tracking-wider text-white shadow-neon-cyan/20"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Launch Live Demo</span>
                  </a>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-t border-white/5 pt-8">
                <div className="lg:col-span-2 space-y-3">
                  <h3 className="text-lg font-black uppercase tracking-wider text-cyan-400">System Description</h3>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line text-sm font-light">
                    {selectedProject.detailed_description || selectedProject.short_description}
                  </p>
                </div>

                {selectedProject.my_contribution && (
                  <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 space-y-3">
                    <h3 className="text-lg font-black uppercase tracking-wider text-cyan-400">Contributions</h3>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-line text-sm font-light">
                      {selectedProject.my_contribution}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
