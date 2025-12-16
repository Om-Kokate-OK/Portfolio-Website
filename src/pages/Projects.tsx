import { useEffect, useState } from 'react';
import { Github, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react';
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
            My Projects
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A showcase of my development work, featuring web applications, tools, and experiments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project._id}
              className="group bg-slate-900 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border border-slate-800 hover:border-cyan-500 cursor-pointer"
              onClick={() => {
                setSelectedProject(project);
                setCurrentImageIndex(0);
              }}
            >
              {project.image_urls.length > 0 ? (
                <div className="aspect-video overflow-hidden bg-slate-800">
                  <img
                    src={project.image_urls[0]}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <span className="text-gray-600 text-lg">No preview</span>
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 group-hover:text-cyan-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 mb-4 line-clamp-3">{project.short_description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech_stack.slice(0, 3).map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-slate-800 text-cyan-400 text-sm rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech_stack.length > 3 && (
                    <span className="px-3 py-1 bg-slate-800 text-gray-400 text-sm rounded-full">
                      +{project.tech_stack.length - 3}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-gray-400 hover:text-cyan-400 transition-colors"
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
                      className="text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                  <span className="ml-auto text-cyan-400 font-medium">View Details →</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No projects yet. Add your first project in the admin panel.</p>
          </div>
        )}
      </div>

      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-slate-800">
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {selectedProject.image_urls.length > 0 && (
                <div className="relative mb-6 rounded-xl overflow-hidden bg-slate-800">
                  <img
                    src={selectedProject.image_urls[currentImageIndex]}
                    alt={`${selectedProject.title} - ${currentImageIndex + 1}`}
                    className="w-full aspect-video object-contain"
                  />
                  {selectedProject.image_urls.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {selectedProject.image_urls.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex
                              ? 'bg-cyan-400 w-8'
                              : 'bg-white/50 hover:bg-white/70'
                              }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-6">
                {selectedProject.tech_stack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-slate-800 text-cyan-400 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center space-x-4 mb-8">
                {selectedProject.github_url && (
                  <a
                    href={selectedProject.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Github className="w-5 h-5" />
                    <span>View Code</span>
                  </a>
                )}
                {selectedProject.live_demo_url && (
                  <a
                    href={selectedProject.live_demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-3 text-cyan-400">Description</h3>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {selectedProject.detailed_description || selectedProject.short_description}
                  </p>
                </div>

                {selectedProject.my_contribution && (
                  <div className="border-t border-slate-800 pt-6">
                    <h3 className="text-xl font-bold mb-3 text-cyan-400">My Contribution</h3>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">
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
