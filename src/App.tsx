import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Check if user was previously logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('userEmail');
    if (savedUser) {
      setUserEmail(savedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (email: string) => {
    setUserEmail(email);
    setIsLoggedIn(true);
    localStorage.setItem('userEmail', email);
  };

  const handleLogout = () => {
    setUserEmail(null);
    setIsLoggedIn(false);
    localStorage.removeItem('userEmail');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      {isLoggedIn ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
