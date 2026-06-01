import { useState, useEffect } from 'react';
import { useRouter } from '../hooks/useRouter';

export default function Header() {
  const { navigate } = useRouter();
  const [timeString, setTimeString] = useState('');

  // Dynamic ticking timezone clock for Mumbai (GMT+5:30)
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      const formatter = new Intl.DateTimeFormat([], options);
      setTimeString(formatter.format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNav = (anchorId: string) => {
    // If on sub-page, navigate back to home first, then scroll
    if (window.location.hash && window.location.hash !== '#/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(anchorId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    } else {
      const element = document.getElementById(anchorId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#000000]/90 backdrop-blur-md border-b border-white/10 select-none">
      <div className="max-w-[1600px] mx-auto px-6 h-20 flex justify-between items-center text-white">
        {/* Brand Name on the Left */}
        <button
          onClick={() => handleNav('hero-view')}
          className="font-black text-xl tracking-tighter uppercase text-white hover:opacity-75 transition-opacity"
        >
          OM KOKATE
        </button>

        {/* Dynamic GMT+5:30 Timezone Clock in the Middle */}
        <div className="hidden lg:flex items-center space-x-3 text-xs uppercase tracking-widest text-[#888888] font-mono-labels">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span>MUMBAI, IN (GMT+5:30)</span>
          <span className="text-white border-l border-white/20 pl-3 min-w-[90px]">{timeString}</span>
        </div>

        {/* Brutalist Text-Menu on the Right */}
        <div className="flex items-center space-x-1 sm:space-x-4 font-mono-labels text-[10px] sm:text-xs uppercase tracking-widest text-[#888888]">
          <button
            onClick={() => handleNav('services-view')}
            className="hover:text-white transition-colors py-2 px-1 sm:px-2"
          >
            / Services
          </button>
          <button
            onClick={() => handleNav('timeline-view')}
            className="hover:text-white transition-colors py-2 px-1 sm:px-2"
          >
            / Certificates
          </button>
          <button
            onClick={() => handleNav('portfolio-view')}
            className="hover:text-white transition-colors py-2 px-1 sm:px-2"
          >
            / Works
          </button>
          <button
            onClick={() => handleNav('contact-view')}
            className="hover:text-white transition-colors py-2 px-1 sm:px-2 text-white font-bold"
          >
            / Contact
          </button>
        </div>
      </div>
    </header>
  );
}
