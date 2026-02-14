import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Ticket, 
  Monitor, 
  Settings, 
  Clock, 
  Users, 
  Volume2, 
  Building2,
  Hospital,
  GraduationCap,
  Landmark,
  ArrowRight
} from 'lucide-react';

export function HomePage() {
  const features = [
    {
      icon: Ticket,
      title: 'Smart Token Generation',
      description: 'Quick and easy token generation with department selection',
    },
    {
      icon: Monitor,
      title: 'Live Queue Display',
      description: 'Real-time display showing current and upcoming tokens',
    },
    {
      icon: Volume2,
      title: 'Voice Announcements',
      description: 'Automatic voice calling when tokens are served',
    },
    {
      icon: Clock,
      title: 'Wait Time Tracking',
      description: 'Know your position and estimated waiting time',
    },
  ];

  const useCases = [
    { icon: Hospital, label: 'Hospitals' },
    { icon: Landmark, label: 'Banks' },
    { icon: Building2, label: 'Offices' },
    { icon: GraduationCap, label: 'Colleges' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-24 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Ticket className="w-3 h-3 sm:w-4 sm:h-4" />
              Smart Queue Management
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
              Streamline Your
              <span className="text-primary block">Queue Experience</span>
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
              A professional token management system for hospitals, banks, offices, and more. 
              Reduce wait times, eliminate confusion, and improve customer satisfaction.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
              <Button asChild size="lg" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg shadow-lg w-full sm:w-auto">
                <Link to="/token">
                  <Ticket className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Get Your Token
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg w-full sm:w-auto">
                <Link to="/display">
                  <Monitor className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  View Queue
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-8 sm:py-10 md:py-12 border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">Perfect for</p>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-4 sm:gap-6 lg:gap-12">
            {useCases.map((useCase) => {
              const Icon = useCase.icon;
              return (
                <div key={useCase.label} className="flex items-center justify-center sm:justify-start gap-2 text-foreground">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  <span className="font-medium text-sm sm:text-base">{useCase.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Everything You Need
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              A complete queue management solution with all the features you need
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-4 sm:p-5 md:p-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-base sm:text-lg text-foreground mb-1.5 sm:mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-10 sm:py-12 md:py-16 bg-muted/30 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1.5 sm:mb-2">Quick Access</h2>
            <p className="text-muted-foreground text-sm sm:text-base">Jump to any section of the system</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <Link 
              to="/token"
              className="group bg-card border border-border rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 hover:border-primary/50 transition-all hover:shadow-lg"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Ticket className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm sm:text-base">Token Kiosk</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Get a new token</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </div>
            </Link>
            
            <Link 
              to="/display"
              className="group bg-card border border-border rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 hover:border-primary/50 transition-all hover:shadow-lg"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-foreground rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Monitor className="w-5 h-5 sm:w-6 sm:h-6 text-background" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm sm:text-base">Queue Display</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">View live queue</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </div>
            </Link>
            
            <Link 
              to="/admin"
              className="group bg-card border border-border rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 hover:border-primary/50 transition-all hover:shadow-lg sm:col-span-2 md:col-span-1"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-accent-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm sm:text-base">Admin Panel</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Manage queues</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Copyright Footer */}
      <footer className="py-6 border-t border-border bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} QueueSmart. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Unauthorized reproduction or distribution of this application is strictly prohibited.
          </p>
        </div>
      </footer>

      {/* Footer spacing for mobile nav */}
      <div className="h-20 lg:h-0" />
    </div>
  );
}
