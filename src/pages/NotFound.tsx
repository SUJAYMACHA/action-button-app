
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 animate-fadeIn">
      <div className="glass-card p-8 max-w-md text-center space-y-6">
        <h1 className="text-5xl font-bold text-glow text-accent animate-pulse">404</h1>
        <p className="text-xl text-white mb-6">This page doesn't exist in this dimension</p>
        <Button asChild className="bg-accent hover:bg-accent/90 neon-glow neon-blue">
          <a href="/" className="inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to reality
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
