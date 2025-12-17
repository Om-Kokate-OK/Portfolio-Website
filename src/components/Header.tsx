import { Menu, X, Code2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from '../hooks/useRouter';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentPath, navigate } = useRouter();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/skills', label: 'Skills' },
    { path: '/certificates', label: 'Certificates' },
    { path: '/coding', label: 'Coding Profile' },
    { path: '/contact', label: 'Contact' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => currentPath === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-resend-black/95 backdrop-blur-sm border-b border-resend-gray-800">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={() => handleNavClick('/')}
            className="flex items-center space-x-2 text-white hover:text-resend-indigo-400 transition-colors"
          >
            <Code2 className="w-6 h-6" />
            <span className="font-bold text-lg">Portfolio</span>
          </button>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive(item.path)
                  ? 'bg-resend-indigo-500 text-white'
                  : 'text-resend-gray-300 hover:text-white hover:bg-resend-gray-800'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleNavClick('/admin')}
            className="hidden md:block px-4 py-2 bg-resend-gray-800 text-resend-gray-300 rounded-lg hover:bg-resend-gray-700 transition-colors"
          >
            Admin
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-resend-gray-800">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    handleNavClick(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-lg font-medium text-left transition-all ${isActive(item.path)
                    ? 'bg-resend-indigo-500 text-white'
                    : 'text-resend-gray-300 hover:text-white hover:bg-resend-gray-800'
                    }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  handleNavClick('/admin');
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-3 bg-resend-gray-800 text-resend-gray-300 rounded-lg hover:bg-resend-gray-700 transition-colors text-left"
              >
                Admin
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
