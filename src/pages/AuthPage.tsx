import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Loader2, UserPlus, LogIn, Eye, EyeOff } from 'lucide-react';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isRegistering) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (error) {
      // Error is already handled by the auth context
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-md animate-slideUp animation-delay-100">
        <div className="glass-card p-8 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-glow text-accent">
              Action <span className="text-white">Button</span>
            </h1>
            <p className="text-muted-foreground">
              {isRegistering ? 'Create a new account' : 'Sign in to your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Mail size={18} />
                </div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input pl-10"
                  required
                />
              </div>
              
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock size={18} />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={isRegistering ? "Create password (min. 8 characters)" : "Enter password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input pl-10 pr-10"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-accent hover:bg-accent/90 relative overflow-hidden group neon-glow neon-blue" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-accent via-accent/50 to-accent bg-[length:200%] animate-pulse opacity-0 group-hover:opacity-20 transition-opacity"></span>
                  <span className="flex items-center justify-center gap-2">
                    {isRegistering ? (
                      <>
                        <UserPlus size={18} />
                        Create Account
                      </>
                    ) : (
                      <>
                        <LogIn size={18} />
                        Sign In
                      </>
                    )}
                  </span>
                </>
              )}
            </Button>
          </form>
          
          <div className="text-center space-y-4">
            <div className="text-sm text-muted-foreground">
              {isRegistering ? (
                <>Already have an account?</>
              ) : (
                <>Don't have an account?</>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              className="text-accent hover:text-accent/90"
              onClick={toggleMode}
              disabled={isSubmitting}
            >
              {isRegistering ? 'Sign In Instead' : 'Create Account'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
