import { useState } from 'react';
import { useRouter } from './hooks/useRouter';
import Layout from './components/Layout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Skills from './pages/Skills';
import Certificates from './pages/Certificates';
import CodingProfile from './pages/CodingProfile';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminRegister from './pages/admin/Register';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const { currentPath } = useRouter();
  const [showLoader, setShowLoader] = useState(true);

  const handleLoadComplete = () => {
    setShowLoader(false);
  };

  if (showLoader) {
    return <LoadingScreen onComplete={handleLoadComplete} />;
  }

  if (currentPath === '/openItBaby') {
    return <AdminLogin />;
  }

  if (currentPath === '/mynameisOM') {
    return <AdminRegister />;
  }

  if (currentPath === '/admin/dashboard' || currentPath.startsWith('/admin/dashboard/')) {
    return <AdminDashboard />;
  }

  const renderPage = () => {
    if (currentPath.startsWith('/projects/')) {
      return <Projects />;
    }

    if (currentPath.startsWith('/certificates/')) {
      return <Certificates />;
    }

    switch (currentPath) {
      case '/':
        return <Home />;
      case '/projects':
        return <Projects />;
      case '/skills':
        return <Skills />;
      case '/certificates':
        return <Certificates />;
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
