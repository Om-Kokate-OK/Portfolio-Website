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
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from '../../hooks/useRouter';
import ProfileManager from './components/ProfileManager';
import ProjectsManager from './components/ProjectsManager';
import SkillsManager from './components/SkillsManager';
import CodingMetricsManager from './components/CodingMetricsManager';
import MessagesManager from './components/MessagesManager';

type AdminSection = 'profile' | 'projects' | 'skills' | 'coding' | 'messages';

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const { navigate } = useRouter();
  const [activeSection, setActiveSection] = useState<AdminSection>('profile');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin');
  };

  const menuItems = [
    { id: 'profile' as AdminSection, label: 'Profile', icon: User },
    { id: 'projects' as AdminSection, label: 'Projects', icon: FolderKanban },
    { id: 'skills' as AdminSection, label: 'Skills', icon: Code2 },
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
    <div className="min-h-screen bg-slate-950">
      <div className="flex h-screen">
        <aside
          className={`${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300`}
        >
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <LayoutDashboard className="w-6 h-6 text-cyan-400" />
                  <h2 className="text-xl font-bold text-white">Admin Panel</h2>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="lg:hidden text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-2">{user.username}</p>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeSection === item.id
                        ? 'bg-cyan-500 text-white'
                        : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-800 space-y-2">
              <button
                onClick={() => {
                  navigate('/');
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 text-gray-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors text-left"
              >
                View Portfolio
              </button>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            <header className="bg-slate-900 border-b border-slate-800 p-4 lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="text-white p-2 hover:bg-slate-800 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6">{renderContent()}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
