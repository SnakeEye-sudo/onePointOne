import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { motion } from 'motion/react';
import { Lock, Mail, Building2, UserCircle2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface LoginProps {
  onLogin: (email: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication with Employee ID validation
    setTimeout(() => {
      const isValidEmail = email.toLowerCase() === 'krishna.sangam11@gmail.com';
      const isValidEmpId = employeeId.toUpperCase() === '1P1243';
      const isValidPassword = password === 'Krishna@1';

      if (isValidEmail && isValidEmpId && isValidPassword) {
        onLogin(email);
        toast.success('Login Successful! Welcome back, Krishna.');
      } else if (!isValidEmpId) {
        toast.error('Invalid Employee ID. Use 1P1243 for demo.');
      } else {
        toast.error('Invalid email or password. Please try again.');
      }
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 font-sans">
      <div className="absolute top-0 left-0 w-full h-1 bg-blue-600" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[440px]"
      >
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm"
          >
            <Building2 className="w-10 h-10 text-blue-600" />
          </motion.div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 mb-2">1POINT1</h1>
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Secure Employee Gateway</span>
          </div>
        </div>

        <Card className="border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
          <CardHeader className="pb-2 pt-8">
            <CardTitle className="text-xl font-bold text-slate-900">Sign In</CardTitle>
            <CardDescription className="text-slate-500 text-sm">
              Access the Gurgaon Office Employee Portal
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5 pt-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold text-slate-700 uppercase tracking-wide">Work Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@1point1.in"
                    className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/10 transition-all bg-slate-50/50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="empId" className="text-xs font-bold text-slate-700 uppercase tracking-wide">Employee ID</Label>
                <div className="relative group">
                  <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    id="empId"
                    type="text"
                    placeholder="EMPXXXX"
                    className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/10 transition-all bg-slate-50/50"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-xs font-bold text-slate-700 uppercase tracking-wide">Password</Label>
                  <button type="button" className="text-[10px] font-bold text-blue-600 hover:underline">Forgot Password?</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/10 transition-all bg-slate-50/50"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="pb-8 pt-4">
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </div>
                ) : 'Enter Dashboard'}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>Privacy Policy</span>
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
            <span>Terms of Service</span>
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
            <span>Help Desk</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">
            &copy; 2026 1POINT1 SOLUTIONS LTD. GURGAON HUB.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
