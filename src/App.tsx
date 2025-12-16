import { useRouter } from './hooks/useRouter';
import Layout from './components/Layout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Skills from './pages/Skills';
import CodingProfile from './pages/CodingProfile';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';

function App() {
  const { currentPath } = useRouter();

  if (currentPath === '/admin' || currentPath === '/admin/login') {
    return <AdminLogin />;
  }

  if (currentPath === '/admin/dashboard' || currentPath.startsWith('/admin/dashboard/')) {
    return <AdminDashboard />;
  }

  const renderPage = () => {
    if (currentPath.startsWith('/projects/')) {
      return <Projects />;
    }

    switch (currentPath) {
      case '/':
        return <Home />;
      case '/projects':
        return <Projects />;
      case '/skills':
        return <Skills />;
      case '/coding':
        return <CodingProfile />;
      case '/contact':
        return <Contact />;
      default:
        return <Home />;
    }
  };

  return <Layout>{renderPage()}</Layout>;
}

export default App;
