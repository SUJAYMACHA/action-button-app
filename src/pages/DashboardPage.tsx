import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Globe, 
  Mail, 
  FileText, 
  Youtube, 
  LogOut, 
  Calendar, 
  Settings, 
  Music, 
  Github,
  BookOpen,
  Cloud,
  MessageSquare 
} from 'lucide-react';
import ActionButton from '@/components/ActionButton';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface WeatherData {
  temp: number;
  condition: string;
}

interface ActionConfig {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  action: () => void | Promise<void>;
  category?: string;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    action: ActionConfig | null;
  }>({
    isOpen: false,
    action: null,
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchWeatherData();
    
    // Redirect to login if not authenticated
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      logout();
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed. Please try again.');
    }
  };

  const fetchWeatherData = async () => {
    try {
      const apiKey = '0d1tNZJPxuA8NfFrJgAiWX9SfGkwcYTp'; // Demo API key for WeatherAPI
      const response = await axios.get(
        `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=auto:ip`
      );
      
      setWeatherData({
        temp: response.data.current.temp_c,
        condition: response.data.current.condition.text
      });
    } catch (error) {
      console.error('Failed to fetch weather:', error);
      // Use mock data when API fails
      setWeatherData({
        temp: 22,
        condition: 'Partly cloudy'
      });
    }
  };

  const generateReport = async () => {
    setIsLoading('report');
    try {
      // Since we might not have a real backend, simulate a report generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a simple blob with text content (simulating a PDF)
      const content = `
        Analytics Report
        ---------------
        Generated for: ${user?.email}
        Date: ${new Date().toLocaleString()}
        
        Summary:
        - Total Views: 1,234
        - Unique Visitors: 567
        - Average Time on Site: 5m 23s
        - Bounce Rate: 23.45%
      `;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'analytics-report.txt');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Report downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsLoading(null);
    }
  };

  const handleActionClick = (action: ActionConfig) => {
    setConfirmDialog({
      isOpen: true,
      action,
    });
  };

  const executeAction = async () => {
    if (confirmDialog.action) {
      try {
        await confirmDialog.action.action();
      } catch (error) {
        toast.error('Action failed. Please try again.');
      }
    }
    setConfirmDialog({ isOpen: false, action: null });
  };

  const cancelAction = () => {
    setConfirmDialog({ isOpen: false, action: null });
  };

  const actions: ActionConfig[] = [
    {
      id: 'open-google',
      title: 'Search Web',
      description: 'Quick access to Google search',
      icon: <Globe className="h-8 w-8" />,
      color: 'primary',
      action: () => { window.open('https://www.google.com', '_blank'); },
      category: 'web'
    },
    {
      id: 'send-email',
      title: 'Quick Email',
      description: 'Compose a new email instantly',
      icon: <Mail className="h-8 w-8" />,
      color: 'primary',
      action: () => {
        const mailtoLink = `mailto:?subject=${encodeURIComponent('Quick Email')}&body=${encodeURIComponent('Hello,')}`;
        window.open(mailtoLink, '_blank');
      },
      category: 'communication'
    },
    {
      id: 'generate-report',
      title: 'Analytics Report',
      description: 'Generate detailed insights',
      icon: <FileText className="h-8 w-8" />,
      color: 'primary',
      action: generateReport,
      category: 'work'
    },
    {
      id: 'calendar',
      title: 'Schedule',
      description: 'Manage your calendar',
      icon: <Calendar className="h-8 w-8" />,
      color: 'primary',
      action: () => {
        const googleCalendarURL = `https://calendar.google.com/calendar/r/day`;
        window.open(googleCalendarURL, '_blank');
      },
      category: 'work'
    },
    {
      id: 'settings',
      title: 'User Settings',
      description: 'Configure your preferences',
      icon: <Settings className="h-8 w-8" />,
      color: 'primary',
      action: () => {
        navigate('/settings');
      },
      category: 'system'
    },
    {
      id: 'music',
      title: 'Music Player',
      description: 'Listen to your playlist',
      icon: <Music className="h-8 w-8" />,
      color: 'primary',
      action: () => { window.open('https://open.spotify.com', '_blank'); },
      category: 'entertainment'
    },
    {
      id: 'github',
      title: 'GitHub',
      description: 'Check your repositories',
      icon: <Github className="h-8 w-8" />,
      color: 'primary',
      action: () => {
        const username = user?.email?.split('@')[0] || 'github';
        window.open(`https://github.com/${username}?tab=repositories`, '_blank');
      },
      category: 'development'
    },
    {
      id: 'docs',
      title: 'Documentation',
      description: 'Access project docs',
      icon: <BookOpen className="h-8 w-8" />,
      color: 'primary',
      action: () => {
        navigate('/docs');
      },
      category: 'development'
    },
    {
      id: 'weather',
      title: 'Weather',
      description: weatherData 
        ? `${weatherData.temp}°C - ${weatherData.condition}`
        : 'Loading weather...',
      icon: <Cloud className="h-8 w-8" />,
      color: 'primary',
      action: async () => {
        await fetchWeatherData();
        window.open('https://weather.com', '_blank');
      },
      category: 'utilities'
    },
    {
      id: 'chat',
      title: 'Chat',
      description: 'Open messaging center',
      icon: <MessageSquare className="h-8 w-8" />,
      color: 'primary',
      action: () => {
        navigate('/chat');
      },
      category: 'communication'
    }
  ];

  const categories = ['all', ...new Set(actions.map(action => action.category))];
  const filteredActions = selectedCategory === 'all' 
    ? actions 
    : actions.filter(action => action.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header Section */}
        <div className="bg-card rounded-lg p-6 mb-8 shadow-sm border">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Action Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, <span className="font-medium">{user?.email}</span>
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredActions.map((action) => (
            <div 
              key={action.id}
              className="transition-transform hover:scale-[1.02]"
            >
              <ActionButton 
                title={action.title}
                description={action.description}
                icon={action.icon}
                color={action.color}
                onClick={() => handleActionClick(action)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.isOpen} onOpenChange={(open) => !open && cancelAction()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Confirm Action
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {confirmDialog.action?.title.toLowerCase()}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={cancelAction}
            >
              Cancel
            </Button>
            <Button 
              onClick={executeAction}
              disabled={isLoading === 'report'}
            >
              {isLoading === 'report' ? 'Generating...' : 'Continue'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardPage;
