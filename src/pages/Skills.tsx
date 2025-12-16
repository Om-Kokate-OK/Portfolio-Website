import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Code2, Database, Globe, Smartphone, Server, Wrench, Zap, Cpu } from 'lucide-react';

interface Skill {
  _id: string;
  skill_name: string;
  category: string;
  proficiency_level?: string;
  years_of_experience?: number;
  display_order: number;
  created_at: string;
}

interface GroupedSkills {
  [category: string]: Skill[];
}

export default function Skills() {
  const [groupedSkills, setGroupedSkills] = useState<GroupedSkills>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await api.get('/skills');

        const grouped = response.data.reduce((acc: GroupedSkills, skill: Skill) => {
          if (!acc[skill.category]) {
            acc[skill.category] = [];
          }
          acc[skill.category].push(skill);
          return acc;
        }, {});

        setGroupedSkills(grouped);
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const getProficiencyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'expert':
        return 'from-cyan-500 to-blue-500';
      case 'advanced':
        return 'from-blue-500 to-indigo-500';
      case 'intermediate':
        return 'from-green-500 to-teal-500';
      case 'beginner':
        return 'from-gray-500 to-slate-500';
      default:
        return 'from-cyan-500 to-blue-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'frontend':
      case 'front-end':
        return Globe;
      case 'backend':
      case 'back-end':
        return Server;
      case 'database':
        return Database;
      case 'mobile':
        return Smartphone;
      case 'devops':
      case 'tools':
        return Wrench;
      case 'programming languages':
      case 'languages':
        return Code2;
      case 'frameworks':
        return Zap;
      default:
        return Cpu;
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
    <div className="min-h-screen py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-8">
            <Code2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Skills & Expertise
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            A comprehensive showcase of my technical skills, frameworks, and tools that power innovative solutions
          </p>
        </div>

        {Object.keys(groupedSkills).length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Code2 className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-300 mb-4">No Skills Added Yet</h3>
            <p className="text-gray-400 text-lg max-w-md mx-auto">
              Skills will appear here once added through the admin panel.
            </p>
          </div>
        ) : (
          <div className="space-y-16 max-w-7xl mx-auto">
            {Object.entries(groupedSkills).map(([category, categorySkills], categoryIndex) => {
              const CategoryIcon = getCategoryIcon(category);
              return (
                <div
                  key={category}
                  className="group"
                  style={{ animationDelay: `${categoryIndex * 0.1}s` }}
                >
                  {/* Category Header */}
                  <div className="flex items-center mb-8">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                      <CategoryIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {category}
                      </h2>
                      <p className="text-gray-400 text-sm">
                        {categorySkills.length} skill{categorySkills.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categorySkills.map((skill, skillIndex) => (
                      <div
                        key={skill._id}
                        className="group/skill bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/10"
                        style={{ animationDelay: `${(categoryIndex * 0.1) + (skillIndex * 0.05)}s` }}
                      >
                        {/* Skill Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-1 group-hover/skill:text-cyan-400 transition-colors">
                              {skill.skill_name}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${skill.proficiency_level === 'Expert'
                                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                  : skill.proficiency_level === 'Advanced'
                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                    : skill.proficiency_level === 'Intermediate'
                                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                }`}>
                                {skill.proficiency_level || 'Beginner'}
                              </span>
                              {skill.years_of_experience && (
                                <span className="text-xs text-gray-500">
                                  {skill.years_of_experience}y exp
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-400">Proficiency</span>
                            <span className="text-sm text-gray-400">
                              {skill.proficiency_level === 'Expert' ? '100%' :
                                skill.proficiency_level === 'Advanced' ? '80%' :
                                  skill.proficiency_level === 'Intermediate' ? '60%' : '40%'}
                            </span>
                          </div>
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${getProficiencyColor(
                                skill.proficiency_level || 'Beginner'
                              )} transition-all duration-1000 ease-out rounded-full group-hover/skill:shadow-lg group-hover/skill:shadow-cyan-500/50`}
                              style={{
                                width: skill.proficiency_level === 'Expert' ? '100%' :
                                  skill.proficiency_level === 'Advanced' ? '80%' :
                                    skill.proficiency_level === 'Intermediate' ? '60%' : '40%'
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* Experience */}
                        {skill.years_of_experience && (
                          <div className="flex items-center text-sm text-gray-400">
                            <Zap className="w-4 h-4 mr-2" />
                            {skill.years_of_experience} {skill.years_of_experience === 1 ? 'year' : 'years'} of hands-on experience
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Proficiency Legend */}
        <div className="mt-24 max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 border border-slate-700">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Proficiency Scale</h2>
              <p className="text-gray-400">Understanding my skill levels</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { level: 'Expert', desc: 'Deep expertise and mastery', color: 'from-cyan-500 to-blue-500', width: '100%' },
                { level: 'Advanced', desc: 'Highly proficient', color: 'from-blue-500 to-indigo-500', width: '80%' },
                { level: 'Intermediate', desc: 'Comfortable working independently', color: 'from-green-500 to-teal-500', width: '60%' },
                { level: 'Beginner', desc: 'Learning and practicing', color: 'from-gray-500 to-slate-500', width: '40%' }
              ].map((item) => (
                <div key={item.level} className="text-center group">
                  <div className="relative mb-4">
                    <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/50`} style={{ width: item.width }}></div>
                    </div>
                  </div>
                  <h3 className="font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{item.level}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
