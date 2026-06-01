import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useRouter } from '../hooks/useRouter';
import CustomCursor from './CustomCursor';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { currentPath } = useRouter();
  const isHome = currentPath === '/';

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-[#ffffff] flex flex-col selection:bg-white selection:text-black relative">
      <CustomCursor />
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      {!isHome && <Footer />}
    </div>
  );
}
