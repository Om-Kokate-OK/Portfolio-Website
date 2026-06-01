import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [percent, setPercent] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [shouldFadeOut, setShouldFadeOut] = useState(false);

  const logs = [
    'INIT // SYSTEM_BOOT_SEQUENCE_ALPHA',
    'LOAD // ESTABLISHING RAFT CONSENSUS PIPELINE',
    'LOAD // SHARDING MONGO_DB COORDINATES // localhost:27017',
    'LOAD // SECURING AUTH FLOATING TOKENS // ACTIVE',
    'LOAD // CACHING ASSETS AND GEOMETRIC BRUTALIST BORDERS',
    'LOAD // TELEMETRY SYNC FOR "OM SACHIN KOKATE"',
    'LOAD // INGESTING PORTFOLIO PRODUCTION RESUMES // COMPLETED',
    'LOAD // COMPILING SHADER BASES // GLSL_CORE',
    'SYNC // RENDER PIPELINE FULLY ALIGNED',
    'READY // WELCOME TO OM KOKATE\'S EXPERIENCE // READY'
  ];

  useEffect(() => {
    // Dynamic ticker for percentages (0 to 100)
    const ticker = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(ticker);
          setTimeout(() => {
            setShouldFadeOut(true);
            setTimeout(onComplete, 800); // Allow fade out animation to finish
          }, 400);
          return 100;
        }
        
        // Random incremental tick
        const next = prev + Math.floor(Math.random() * 8) + 3;
        return next > 100 ? 100 : next;
      });
    }, 70);

    return () => clearInterval(ticker);
  }, [onComplete]);

  useEffect(() => {
    // Progress logs depending on the percentage
    const targetIndex = Math.min(
      Math.floor((percent / 100) * logs.length),
      logs.length - 1
    );
    if (targetIndex > logIndex) {
      setLogIndex(targetIndex);
    }
  }, [percent, logIndex]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#000000] text-white font-mono-labels select-none flex flex-col justify-between p-6 sm:p-12 transition-all duration-700 ease-in-out ${
        shouldFadeOut ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top wireframe details */}
      <div className="flex justify-between items-start text-[10px] uppercase tracking-widest text-[#888888] border-b border-white/10 pb-6">
        <div className="flex flex-col space-y-1">
          <span>SECURE PROTOCOL // SH-2026</span>
          <span className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>SHARD-SYNC_ACTIVE</span>
          </span>
        </div>
        <div className="text-right flex flex-col space-y-1">
          <span>PORTFOLIO LOAD FRAMEWORK V1.0.0</span>
          <span>SYS_TEMP: NOMINAL</span>
        </div>
      </div>

      {/* Middle: Oversized percentage count & system logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center my-auto">
        <div className="lg:col-span-2">
          {/* Stark Brutalist Percentage Ticker */}
          <div className="text-[12rem] sm:text-[18rem] md:text-[22rem] font-black tracking-tighter leading-none select-none text-white tabular-nums flex items-baseline">
            <span>{percent < 10 ? `0${percent}` : percent}</span>
            <span className="text-sm font-light text-[#888888] tracking-widest uppercase ml-4">
              % loaded
            </span>
          </div>

          {/* Simple Stark Progress Bar */}
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-6 relative max-w-xl">
            <div
              className="h-full bg-white transition-all duration-70ms ease-out"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </div>

        {/* Live System Logging Stream */}
        <div className="border border-white/10 rounded-2xl p-6 bg-white/[0.01] space-y-4 h-[220px] flex flex-col justify-end overflow-hidden">
          <div className="text-[10px] uppercase tracking-widest text-[#888888] mb-2 border-b border-white/5 pb-2">
            // Real-Time System Telemetry
          </div>
          <div className="space-y-2 flex-grow overflow-y-auto flex flex-col justify-end text-left text-[11px] leading-relaxed text-slate-400">
            {logs.slice(0, logIndex + 1).map((log, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <span className="text-white shrink-0">&gt;</span>
                <span className={idx === logIndex ? 'text-white font-bold' : ''}>
                  {log}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom coordinate indicators */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-[#888888] border-t border-white/10 pt-6 space-y-2 sm:space-y-0">
        <span>© {new Date().getFullYear()} OM KOKATE // SYSTEMS ENGINEERING</span>
        <div className="flex items-center space-x-4">
          <span>LATENCY: ~14ms</span>
          <span>EST_SYNC: {Math.round(percent * 0.15)}/15 MB</span>
        </div>
      </div>
    </div>
  );
}
