import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueue } from '@/context/QueueContext';
import { DEPARTMENTS } from '@/types/queue';
import { Volume2, VolumeX, Clock, Users, ArrowLeft, Maximize2, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function QueueDisplay() {
  const { counters, getWaitingTokens, isSpeaking } = useQueue();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const waitingCounts = DEPARTMENTS.reduce((acc, dept) => {
    acc[dept.code] = getWaitingTokens(dept.code).length;
    return acc;
  }, {} as Record<string, number>);

  const totalWaiting = Object.values(waitingCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 lg:p-10">
      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button 
              asChild 
              variant="ghost" 
              size="icon" 
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <Link to="/">
                <ArrowLeft className="w-6 h-6" />
              </Link>
            </Button>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  QueueSmart
                </h1>
                <p className="text-white/50 text-sm">Live Token Display System</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleFullscreen}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <Maximize2 className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-3 bg-white/5 rounded-full px-4 py-2">
              {isSpeaking ? (
                <Volume2 className="w-5 h-5 text-green-400 animate-pulse" />
              ) : (
                <VolumeX className="w-5 h-5 text-white/40" />
              )}
              <span className="text-sm text-white/60">
                {isSpeaking ? 'Announcing...' : 'Ready'}
              </span>
            </div>
            
            <div className="text-right bg-white/5 rounded-2xl px-5 py-3">
              <div className="flex items-center gap-2 text-3xl font-mono font-bold text-white">
                <Clock className="w-6 h-6 text-primary" />
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <p className="text-xs text-white/50 mt-1">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </header>

        {/* Now Serving - Main Display */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <h2 className="text-lg font-semibold text-white/80 uppercase tracking-wider">Now Serving</h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {counters.map((counter) => {
              const dept = DEPARTMENTS.find(d => d.code === counter.department);
              const hasToken = counter.currentToken !== null;
              
              return (
                <div 
                  key={counter.id}
                  className={`relative overflow-hidden rounded-3xl transition-all duration-500 ${
                    hasToken 
                      ? 'bg-gradient-to-br from-primary via-primary to-primary/80 shadow-2xl shadow-primary/40 scale-[1.02]' 
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  {/* Glow effect for active */}
                  {hasToken && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  )}
                  
                  <div className="relative p-6 lg:p-8 text-center">
                    <div className={`inline-block px-4 py-1 rounded-full text-xs font-semibold mb-3 ${
                      hasToken 
                        ? 'bg-white/20 text-white' 
                        : 'bg-white/5 text-white/50'
                    }`}>
                      {counter.name}
                    </div>
                    
                    <p className={`text-xs mb-4 ${
                      hasToken ? 'text-white/80' : 'text-white/40'
                    }`}>
                      {dept?.name}
                    </p>
                    
                    {hasToken ? (
                      <div className="animate-slide-in">
                        <p className="font-mono text-5xl lg:text-7xl font-black text-white tracking-wider mb-3 drop-shadow-lg">
                          {counter.currentToken?.displayNumber}
                        </p>
                        <p className="text-sm text-white/90 font-medium truncate max-w-[180px] mx-auto">
                          {counter.currentToken?.customerName}
                        </p>
                      </div>
                    ) : (
                      <div className="py-6">
                        <p className="text-5xl lg:text-6xl text-white/20 font-mono font-bold">---</p>
                        <p className="text-sm text-white/30 mt-3">Waiting for next</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Queue Stats */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 lg:p-8 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Users className="w-6 h-6 text-primary" />
              Waiting Queue
            </h2>
            <div className="flex items-center gap-3 bg-primary/20 rounded-full px-5 py-2">
              <span className="font-mono text-2xl font-bold text-primary">{totalWaiting}</span>
              <span className="text-sm text-white/60">Total Waiting</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {DEPARTMENTS.map((dept) => {
              const waiting = waitingCounts[dept.code];
              const nextTokens = getWaitingTokens(dept.code).slice(0, 5);
              
              const deptColors: Record<string, string> = {
                'A': 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
                'B': 'from-green-500/20 to-green-600/20 border-green-500/30',
                'C': 'from-amber-500/20 to-amber-600/20 border-amber-500/30',
                'D': 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
              };

              const badgeColors: Record<string, string> = {
                'A': 'bg-blue-500 text-white',
                'B': 'bg-green-500 text-white',
                'C': 'bg-amber-500 text-white',
                'D': 'bg-purple-500 text-white',
              };
              
              return (
                <div 
                  key={dept.code}
                  className={`bg-gradient-to-br ${deptColors[dept.code]} rounded-2xl p-5 border`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-xl ${badgeColors[dept.code]}`}>
                      {dept.code}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{dept.name}</p>
                      <p className="text-sm text-white/60">{waiting} waiting</p>
                    </div>
                  </div>
                  
                  {nextTokens.length > 0 ? (
                    <div className="space-y-2">
                      {nextTokens.map((token, idx) => (
                        <div 
                          key={token.id}
                          className={`flex items-center gap-3 p-2 rounded-lg ${
                            idx === 0 
                              ? 'bg-white/10 border border-white/20' 
                              : 'bg-white/5'
                          }`}
                        >
                          <span className={`font-mono font-bold ${
                            idx === 0 ? 'text-white' : 'text-white/60'
                          }`}>
                            {token.displayNumber}
                          </span>
                          {idx === 0 && (
                            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full text-white font-medium">
                              NEXT
                            </span>
                          )}
                        </div>
                      ))}
                      {waiting > 5 && (
                        <p className="text-xs text-white/40 text-center pt-1">
                          +{waiting - 5} more in queue
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-white/5 rounded-xl">
                      <p className="text-sm text-white/40">No tokens waiting</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 rounded-full px-6 py-3 text-white/50 text-sm">
            <Volume2 className="w-4 h-4" />
            <span>Please listen for voice announcements when your token is called</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
