import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Code2,
  Trophy,
  User,
  Mail,
  LogOut,
  Menu,
  X,
  Award,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from '../../hooks/useRouter';
import ProfileManager from './components/ProfileManager';
import ProjectsManager from './components/ProjectsManager';
import SkillsManager from './components/SkillsManager';
import CertificatesManager from './components/CertificatesManager';
import CodingMetricsManager from './components/CodingMetricsManager';
import MessagesManager from './components/MessagesManager';

type AdminSection = 'profile' | 'projects' | 'skills' | 'certificates' | 'coding' | 'messages';

export default function AdminDashboard() {
  const { user, signOut, loading } = useAuth();
  const { navigate } = useRouter();
  const [activeSection, setActiveSection] = useState<AdminSection>('profile');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/openItBaby');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/openItBaby');
  };

  const menuItems = [
    { id: 'profile' as AdminSection, label: 'Profile', icon: User },
    { id: 'projects' as AdminSection, label: 'Projects', icon: FolderKanban },
    { id: 'skills' as AdminSection, label: 'Skills', icon: Code2 },
    { id: 'certificates' as AdminSection, label: 'Certificates', icon: Award },
    { id: 'coding' as AdminSection, label: 'Coding Metrics', icon: Trophy },
    { id: 'messages' as AdminSection, label: 'Messages', icon: Mail },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileManager />;
      case 'projects':
        return <ProjectsManager />;
      case 'skills':
        return <SkillsManager />;
      case 'certificates':
        return <CertificatesManager />;
      case 'coding':
        return <CodingMetricsManager />;
      case 'messages':
        return <MessagesManager />;
      default:
        return <ProfileManager />;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white overflow-hidden select-none">
      <div className="flex h-screen">
        
        {/* Sidebar */}
        <aside
          className={`${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-black border-r border-white/10 transition-transform duration-300 flex flex-col justify-between`}
        >
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                  <h2 className="text-lg font-black uppercase tracking-tighter text-white">SYS_DASHBOARD</h2>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="lg:hidden text-[#888888] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[10px] font-mono-labels uppercase tracking-widest text-[#888888] mt-2">
                Node: {user.username}
              </p>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto font-mono-labels text-xs uppercase tracking-widest text-[#888888]">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      activeSection === item.id
                        ? 'bg-white text-black font-black'
                        : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>/ {item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-white/10 space-y-2 font-mono-labels text-xs uppercase tracking-widest">
              <button
                onClick={() => {
                  navigate('/');
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 text-[#888888] hover:bg-white/5 hover:text-white rounded-xl transition-all text-left"
              >
                / View Portfolio
              </button>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>/ Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Content Region */}
        <main className="flex-grow flex flex-col overflow-hidden">
          
          {/* Mobile header */}
          <header className="bg-black border-b border-white/10 p-4 lg:hidden flex justify-between items-center">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-white p-2 hover:bg-white/5 rounded-xl transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono-labels uppercase tracking-widest text-[#888888]">
              SYS_DASHBOARD
            </span>
          </header>

          {/* Active section viewport */}
          <div className="flex-1 overflow-y-auto p-8 relative">
            {/* Background grid wireframe for dashboard body */}
            <div className="absolute inset-0 grid grid-cols-3 pointer-events-none opacity-20">
              <div className="border-r border-white/5"></div>
              <div className="border-r border-white/5"></div>
              <div></div>
            </div>

            <div className="relative z-10">{renderContent()}</div>
          </div>
        </main>

      </div>
    </div>
  );
}
