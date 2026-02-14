import { useState } from 'react';
import { useQueue } from '@/context/QueueContext';
import { useMemo } from 'react';
import { Department, DEPARTMENTS, Token } from '@/types/queue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Ticket, User, Phone, Printer, CheckCircle, Clock, CalendarClock } from 'lucide-react';

export function TokenGenerator() {
  const { generateToken, getTokenPosition, getEstimatedTime, averageServiceTime } = useQueue();
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [generatedToken, setGeneratedToken] = useState<Token | null>(null);

  const handleGenerateToken = () => {
    if (!selectedDept || !customerName.trim()) return;
    
    const token = generateToken(selectedDept, customerName.trim(), phone.trim() || undefined);
    setGeneratedToken(token);
  };

  const handleNewToken = () => {
    setGeneratedToken(null);
    setSelectedDept(null);
    setCustomerName('');
    setPhone('');
  };

  const handlePrint = () => {
    window.print();
  };

  if (generatedToken) {
    const dept = DEPARTMENTS.find(d => d.code === generatedToken.department);
    const position = getTokenPosition(generatedToken.id);
    const estimatedTime = getEstimatedTime(generatedToken.id);
    const waitMinutes = Math.max(0, (position - 1) * averageServiceTime);

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md animate-slide-up shadow-2xl border-2 border-primary/20">
          <CardHeader className="text-center bg-primary/5 rounded-t-lg">
            <div className="mx-auto w-16 h-16 bg-success rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-success-foreground" />
            </div>
            <CardTitle className="text-2xl">Token Generated!</CardTitle>
            <CardDescription>Please keep this token safe</CardDescription>
          </CardHeader>
          <CardContent className="p-8 text-center space-y-6">
            <div className="bg-primary/10 rounded-2xl p-8">
              <p className="text-sm text-muted-foreground mb-2">Your Token Number</p>
              <p className="font-mono text-5xl font-bold text-primary animate-pulse-glow inline-block px-6 py-2 rounded-xl">
                {generatedToken.displayNumber}
              </p>
            </div>

            {/* Estimated Time Card */}
            <div className="bg-accent rounded-2xl p-5 border border-primary/20">
              <div className="flex items-center justify-center gap-2 mb-3">
                <CalendarClock className="w-5 h-5 text-primary" />
                <p className="text-sm font-semibold text-primary">Your Estimated Time</p>
              </div>
              {estimatedTime ? (
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-foreground">
                    {estimatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Approx. <span className="font-semibold text-foreground">{waitMinutes} min</span> wait 
                    ({position - 1} {(position - 1) === 1 ? 'person' : 'people'} ahead)
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ~{averageServiceTime} min per person
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-2xl font-bold text-primary">You're Next!</p>
                  <p className="text-sm text-muted-foreground">Please proceed to the counter</p>
                </div>
              )}
            </div>
            
            <div className="space-y-3 text-left bg-muted/50 rounded-xl p-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Department:</span>
                <span className="font-semibold">{dept?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-semibold">{generatedToken.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Position in Queue:</span>
                <span className="font-semibold text-primary">{position}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Token Time:
                </span>
                <span className="font-semibold">
                  {generatedToken.createdAt.toLocaleTimeString()}
                </span>
              </div>
              {estimatedTime && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <CalendarClock className="w-3.5 h-3.5" /> Come At:
                  </span>
                  <span className="font-semibold text-primary">
                    {estimatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              Please wait for your token to be called on the display screen
            </p>

            <div className="flex gap-3">
              <Button onClick={handlePrint} variant="outline" className="flex-1">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button onClick={handleNewToken} className="flex-1">
                <Ticket className="w-4 h-4 mr-2" />
                New Token
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center bg-primary/5 rounded-t-lg pb-6">
          <div className="mx-auto w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Ticket className="w-10 h-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold">Get Your Token</CardTitle>
          <CardDescription className="text-lg">
            Select your department and enter your details
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          {/* Department Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Select Department</label>
            <div className="grid grid-cols-2 gap-3">
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept.code}
                  onClick={() => setSelectedDept(dept.code)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    selectedDept === dept.code
                      ? 'border-primary bg-primary/10 shadow-md'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-lg ${
                      selectedDept === dept.code 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {dept.code}
                    </span>
                    <div>
                      <p className="font-semibold text-foreground">{dept.name}</p>
                      <p className="text-xs text-muted-foreground">{dept.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Customer Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                Your Name *
              </label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your full name"
                className="h-12 text-lg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number (Optional)
              </label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="h-12 text-lg"
                type="tel"
              />
            </div>
          </div>

          <Button 
            onClick={handleGenerateToken}
            disabled={!selectedDept || !customerName.trim()}
            className="w-full h-14 text-lg font-semibold shadow-lg"
            size="lg"
          >
            <Ticket className="w-5 h-5 mr-2" />
            Generate Token
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
