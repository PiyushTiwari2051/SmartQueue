import { Link, useLocation } from 'react-router-dom';
import { Ticket, Monitor, Settings, Home } from 'lucide-react';

export function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/token', label: 'Get Token', icon: Ticket },
    { path: '/display', label: 'Display', icon: Monitor },
    { path: '/admin', label: 'Admin', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 lg:top-0 lg:bottom-auto lg:border-b lg:border-t-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-around lg:justify-start lg:gap-1 h-16">
          {/* Logo for desktop */}
          <div className="hidden lg:flex items-center gap-2 mr-8">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <Ticket className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">QueueSmart</span>
          </div>
          
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col lg:flex-row items-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 rounded-lg transition-all ${
                  isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs lg:text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
