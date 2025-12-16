import { useEffect, useState } from 'react';
import { ArrowRight, Github, Linkedin, FileDown, ExternalLink } from 'lucide-react';
import { api } from '../lib/api';
import { useRouter } from '../hooks/useRouter';

interface Profile {
  _id: string;
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
  display_order: number;
}

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { navigate } = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, projectsRes] = await Promise.all([
          api.get('/profile'),
          api.get('/projects?featured=true'),
        ]);

        setProfile(profileRes.data);
        setFeaturedProjects(projectsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-resend-black via-resend-gray-900 to-resend-gray-950">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-resend-indigo-400 to-resend-teal-400 bg-clip-text text-transparent">
                {profile?.full_name || 'Your Name'}
              </h1>
              <p className="text-2xl sm:text-3xl text-resend-gray-300 mb-8">
                {profile?.headline || 'Software Engineer | Full-Stack Developer'}
              </p>
              {profile?.location && (
                <p className="text-lg text-gray-400 mb-8">{profile.location}</p>
              )}

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
                {profile?.github_url && (
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-6 py-3 bg-resend-gray-800 hover:bg-resend-gray-700 rounded-lg transition-colors"
                  >
                    <Github className="w-5 h-5" />
                    <span>GitHub</span>
                  </a>
                )}
                {profile?.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-6 py-3 bg-resend-gray-800 hover:bg-resend-gray-700 rounded-lg transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {profile?.resume_url && (
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-6 py-3 bg-resend-indigo-500 hover:bg-resend-indigo-600 rounded-lg transition-colors"
                  >
                    <FileDown className="w-5 h-5" />
                    <span>Resume</span>
                  </a>
                )}
              </div>

              <button
                onClick={() => navigate('/projects')}
                className="group flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-resend-indigo-500 to-resend-teal-500 hover:from-resend-indigo-600 hover:to-resend-teal-600 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 mx-auto lg:mx-0"
              >
                <span>View My Work</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {profile?.profile_image_url && (
              <div className="flex-shrink-0">
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                  <div className="absolute inset-0 bg-gradient-to-r from-resend-indigo-500 to-resend-teal-500 rounded-full blur-2xl opacity-30"></div>
                  <img
                    src={profile.profile_image_url}
                    alt={profile.full_name}
                    className="relative w-full h-full object-cover rounded-full border-4 border-resend-gray-700"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 bg-resend-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">About Me</h2>
            <p className="text-lg text-resend-gray-300 leading-relaxed whitespace-pre-line">
              {profile?.about_me || 'Add your about me section in the admin panel.'}
            </p>
          </div>
        </div>
      </section>

      {featuredProjects.length > 0 && (
        <section className="py-20 bg-resend-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <div
                  key={project._id}
                  className="group bg-resend-gray-900 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border border-resend-gray-800 hover:border-resend-indigo-500"
                >
                  {project.image_urls.length > 0 && (
                    <div className="aspect-video overflow-hidden bg-resend-gray-800">
                      <img
                        src={project.image_urls[0]}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-resend-indigo-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-resend-gray-300 mb-4 line-clamp-3">
                      {project.short_description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech_stack.slice(0, 3).map((tech: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-resend-indigo-500/20 text-resend-indigo-300 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-resend-gray-400 hover:text-resend-indigo-400 transition-colors"
                        >
                          <Github size={16} />
                          Code
                        </a>
                      )}
                      {project.live_demo_url && (
                        <a
                          href={project.live_demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-resend-gray-400 hover:text-resend-teal-400 transition-colors"
                        >
                          <ExternalLink size={16} />
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <button
                onClick={() => navigate('/projects')}
                className="inline-flex items-center gap-2 px-8 py-3 bg-resend-indigo-500 hover:bg-resend-indigo-600 text-white rounded-lg transition-colors"
              >
                View All Projects
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
