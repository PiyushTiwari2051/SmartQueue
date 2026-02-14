import { useQueue } from '@/context/QueueContext';
import { useAuth } from '@/hooks/useAuth';
import { DEPARTMENTS, Token } from '@/types/queue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  SkipForward, 
  CheckCircle, 
  Users, 
  Clock, 
  Volume2,
  Ticket,
  ArrowRight,
  LogOut,
  Shield
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function AdminDashboard() {
  const { 
    tokens, 
    counters, 
    callNextToken, 
    completeToken, 
    skipToken, 
    getWaitingTokens,
    speakAnnouncement,
    isSpeaking 
  } = useQueue();
  
  const { user, signOut } = useAuth();
  const [selectedCounter, setSelectedCounter] = useState<number>(1);

  const stats = {
    waiting: tokens.filter(t => t.status === 'waiting').length,
    serving: tokens.filter(t => t.status === 'serving').length,
    completed: tokens.filter(t => t.status === 'completed').length,
    skipped: tokens.filter(t => t.status === 'skipped').length,
  };

  const currentCounter = counters.find(c => c.id === selectedCounter);
  const waitingForCounter = currentCounter 
    ? getWaitingTokens(currentCounter.department) 
    : [];

  const handleCallNext = () => {
    const token = callNextToken(selectedCounter);
    if (token) {
      toast.success(`Called token ${token.displayNumber}`);
    } else {
      toast.info('No tokens waiting for this counter');
    }
  };

  const handleRecall = () => {
    if (currentCounter?.currentToken) {
      const token = currentCounter.currentToken;
      speakAnnouncement(
        `Token ${token.displayNumber}, please proceed to ${currentCounter.name} immediately.`
      );
      toast.info(`Recalling token ${token.displayNumber}`);
    }
  };

  const handleComplete = () => {
    if (currentCounter?.currentToken) {
      completeToken(currentCounter.currentToken.id);
      toast.success('Token marked as completed');
    }
  };

  const handleSkip = () => {
    if (currentCounter?.currentToken) {
      skipToken(currentCounter.currentToken.id);
      toast.warning('Token skipped');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <header className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm text-primary font-medium">Admin Panel</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Queue Management</h1>
          <p className="text-muted-foreground">Manage queues and call tokens</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Logged in as</p>
            <p className="font-medium text-foreground">{user?.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-warning/10 border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.waiting}</p>
                <p className="text-sm text-muted-foreground">Waiting</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.serving}</p>
                <p className="text-sm text-muted-foreground">Serving</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-success/10 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-destructive/10 border-destructive/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-destructive/20 rounded-lg flex items-center justify-center">
                <SkipForward className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.skipped}</p>
                <p className="text-sm text-muted-foreground">Skipped</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Counter Selection & Control */}
        <div className="lg:col-span-2 space-y-6">
          {/* Counter Tabs */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Select Counter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {counters.map((counter) => {
                  const dept = DEPARTMENTS.find(d => d.code === counter.department);
                  return (
                    <button
                      key={counter.id}
                      onClick={() => setSelectedCounter(counter.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedCounter === counter.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <p className="font-semibold">{counter.name}</p>
                      <p className="text-xs text-muted-foreground">{dept?.name}</p>
                      {counter.currentToken && (
                        <Badge variant="secondary" className="mt-2 font-mono">
                          {counter.currentToken.displayNumber}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Current Token & Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="w-5 h-5" />
                {currentCounter?.name} - Current Token
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentCounter?.currentToken ? (
                <div className="bg-primary/5 rounded-2xl p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Now Serving</p>
                  <p className="font-mono text-5xl font-bold text-primary mb-2">
                    {currentCounter.currentToken.displayNumber}
                  </p>
                  <p className="text-foreground font-medium">
                    {currentCounter.currentToken.customerName}
                  </p>
                  {currentCounter.currentToken.calledAt && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Called at {currentCounter.currentToken.calledAt.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-muted/50 rounded-2xl p-6 text-center">
                  <p className="text-muted-foreground">No token being served</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click "Call Next" to serve waiting customers
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Button 
                  onClick={handleCallNext}
                  className="h-14"
                  disabled={waitingForCounter.length === 0}
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Call Next
                </Button>
                
                <Button 
                  onClick={handleRecall}
                  variant="outline"
                  className="h-14"
                  disabled={!currentCounter?.currentToken || isSpeaking}
                >
                  <Volume2 className="w-5 h-5 mr-2" />
                  Recall
                </Button>
                
                <Button 
                  onClick={handleSkip}
                  variant="outline"
                  className="h-14 border-warning text-warning hover:bg-warning hover:text-warning-foreground"
                  disabled={!currentCounter?.currentToken}
                >
                  <SkipForward className="w-5 h-5 mr-2" />
                  Skip
                </Button>
                
                <Button 
                  onClick={handleComplete}
                  variant="outline"
                  className="h-14 border-success text-success hover:bg-success hover:text-success-foreground"
                  disabled={!currentCounter?.currentToken}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Complete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Waiting Queue */}
        <Card className="lg:row-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Waiting Queue
              </span>
              <Badge variant="secondary">{waitingForCounter.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {waitingForCounter.length > 0 ? (
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {waitingForCounter.map((token, idx) => (
                  <div 
                    key={token.id}
                    className={`p-3 rounded-lg border ${
                      idx === 0 
                        ? 'bg-primary/5 border-primary/20' 
                        : 'bg-muted/50 border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`font-mono font-bold ${
                          idx === 0 ? 'text-primary' : 'text-foreground'
                        }`}>
                          {token.displayNumber}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {token.customerName}
                        </span>
                      </div>
                      {idx === 0 && (
                        <Badge variant="default" className="text-xs">Next</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {token.createdAt.toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No tokens waiting</p>
                <p className="text-sm">for this counter</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
