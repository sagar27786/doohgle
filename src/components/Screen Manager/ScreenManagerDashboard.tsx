import React, { useState, useRef, useEffect } from 'react';
import { 
  Grid, 
  Search, 
  Tv, 
  Monitor, 
  MapPin, 
  DollarSign, 
  ArrowUp, 
  HelpCircle,
  Settings,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  User,
  Building2,
  LogOut,
  Bell,
  Zap,
  TrendingUp
} from 'lucide-react';
import './animations.css';
interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  hasSubmenu?: boolean;
}

interface TabItem {
  id: string;
  label: string;
}


const UserProfileDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center w-full px-2 py-2 bg-white rounded-lg shadow border border-gray-200 hover:bg-gray-50 transition-all"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
          <span className="text-sm font-medium text-gray-700">S</span>
        </div>
        <span className="flex-1 text-sm font-medium text-gray-900 text-left">Sadashiv T...</span>
        <Settings size={16} className="text-gray-400 ml-2" />
      </button>
      {open && (
        <div className="absolute bottom-12 left-0 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50 flex flex-col py-2 animate-fade-in">
          <button className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-base">
            <User size={20} className="mr-3 text-gray-400" />
            Profile
          </button>
          <button className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-base">
            <Building2 size={20} className="mr-3 text-gray-400" />
            Organisation
          </button>
          <button className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-base">
            <LogOut size={20} className="mr-3 text-gray-400" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

// Components
const Sidebar: React.FC<{
  activeTab: string;
  onTabChange: (tab: string) => void;
  sidebarOpen?: boolean;
}> = ({ activeTab, onTabChange }) => {
  const navigationItems: NavigationItem[] = [
    { id: 'gallery', label: 'Gallery', icon: Grid },
    { id: 'discover', label: 'Discover', icon: Search },
    { id: 'channels', label: 'Channels', icon: Tv },
    { id: 'screens', label: 'Screens', icon: Monitor },
    { id: 'locations', label: 'Locations', icon: MapPin },
    { id: 'earn', label: 'Earn Money', icon: DollarSign, hasSubmenu: true },
    { id: 'upgrade', label: 'Upgrade Plan', icon: ArrowUp },
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <Grid className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">DOOHGLE</h1>
            <p className="text-sm text-gray-500">Screen Manager</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon size={20} />
              <span className="flex-1">{item.label}</span>
              {item.hasSubmenu && (
                <ChevronRight size={16} className="text-gray-400" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Ask AI Button */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all">
          <Sparkles size={16} />
          <span>Ask AI</span>
        </button>
      </div>

      {/* User Profile Dropdown */}
      <div className="p-4 border-t border-gray-200 relative">
        <UserProfileDropdown />
      </div>

      {/* Help & Support */}
      <div className="p-4">
        <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
          <HelpCircle size={16} />
          <span className="text-sm">Help & Support</span>
        </button>
      </div>
    </div>
  );
};

const Header: React.FC<{
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}> = ({ activeFilter, onFilterChange }) => {
  const filters: TabItem[] = [
    { id: 'all', label: 'Show all' },
    { id: 'screen', label: 'Screen Manager' },
    { id: 'ads', label: 'Ads Manager' },
    { id: 'content', label: 'Content' },
    { id: 'framen', label: 'Doohgle' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center space-x-6">
        <span className="text-sm text-gray-500">Select:</span>
        <div className="flex space-x-1">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                activeFilter === filter.id
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Moving Text Animation Components
const ScrollingTextBanner: React.FC = () => {
  const scrollingTexts = [
    "🚀 Manage 1000+ Digital Screens Globally",
    "📊 Real-time Analytics & Performance Tracking", 
    "💰 Maximize Revenue with Smart Ad Placement",
    "⚡ Lightning-fast Content Updates",
    "🌐 Global Network Management",
    "🎯 Targeted Campaign Optimization"
  ];

  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-2 overflow-hidden relative">
      <div className="flex animate-scroll-left">
        <div className="flex space-x-12 whitespace-nowrap">
          {[...scrollingTexts, ...scrollingTexts].map((text, idx) => (
            <span key={idx} className="text-sm font-medium px-4">
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const TypewriterText: React.FC<{ text: string; speed?: number }> = ({ text, speed = 100 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className="inline-block">
      {displayText}
      <span className="animate-pulse text-blue-600">|</span>
    </span>
  );
};

const FloatingNotification: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [currentNotification, setCurrentNotification] = useState(0);
  
  const notifications = [
    { icon: Bell, text: "5 new screens connected", color: "bg-green-500" },
    { icon: TrendingUp, text: "Revenue increased by 23%", color: "bg-blue-500" },
    { icon: Zap, text: "Campaign optimization complete", color: "bg-purple-500" },
    { icon: Monitor, text: "Screen health check passed", color: "bg-green-500" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentNotification(prev => (prev + 1) % notifications.length);
        setVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [notifications.length]);

  const notification = notifications[currentNotification];
  const IconComponent = notification.icon;

  return (
    <div className="fixed top-20 right-6 z-40">
      <div className={`transform transition-all duration-300 ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 ${notification.color} rounded-full flex items-center justify-center animate-pulse`}>
              <IconComponent size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{notification.text}</p>
              <p className="text-xs text-gray-500">Just now</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AnimatedContentLabel: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [delay]);

  return (
    <div className={`transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
      {children}
    </div>
  );
};

const TABS = [
  { id: 'all', label: 'Show all' },
  { id: 'screen', label: 'Screen Manager' },
  { id: 'ads', label: 'Ads Manager' },
  { id: 'content', label: 'Content' },
  { id: 'framen', label: 'Doohgle' },
];

const tabDummyContent: Record<string, { title: string; description: string; stats?: string }[]> = {
  all: [
    {
      title: 'Welcome to Screen Manager Dashboard',
      description: 'Manage your digital screens with powerful tools and real-time analytics.',
      stats: '1,247 Active Screens'
    },
    {
      title: 'Global Network Overview',
      description: 'Monitor performance across all your connected displays worldwide.',
      stats: '98.7% Uptime'
    },
    {
      title: 'Revenue Analytics',
      description: 'Track earnings and optimize your advertising campaigns for maximum ROI.',
      stats: '$124,567 This Month'
    },
  ],
  screen: [
    {
      title: 'Screen Performance Dashboard',
      description: 'Real-time monitoring of all connected digital displays and their health status.',
      stats: '847 Online Screens'
    },
    {
      title: 'Content Management System',
      description: 'Upload, schedule, and manage content across your entire screen network.',
      stats: '2,341 Active Campaigns'
    },
  ],
  ads: [
    {
      title: 'Advertisement Campaign Manager',
      description: 'Create and optimize targeted advertising campaigns for better engagement.',
      stats: '156% CTR Increase'
    },
    {
      title: 'Revenue Optimization Tools',
      description: 'Maximize your advertising revenue with AI-powered placement algorithms.',
      stats: '$45,678 Revenue Today'
    },
  ],
  content: [
    {
      title: 'Content Library Management',
      description: 'Organize and distribute your media content efficiently across all platforms.',
      stats: '12,456 Media Files'
    },
    {
      title: 'Automated Content Scheduling',
      description: 'Set up intelligent content scheduling based on audience patterns.',
      stats: '89% Automation Rate'
    },
  ],
  framen: [
    {
      title: 'Doohgle Network Statistics',
      description: 'Comprehensive analytics and insights from the Doohgle advertising network.',
      stats: '5.2M Daily Impressions'
    },
    {
      title: 'Network Expansion Tools',
      description: 'Grow your digital advertising network with smart expansion recommendations.',
      stats: '23 New Locations'
    },
  ],
};

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');

  return (
    <div className="flex flex-col w-full h-full bg-gray-50">
      {/* Scrolling Text Banner */}
      <ScrollingTextBanner />
      
      {/* Welcome Header with Typewriter Effect */}
      <div className="bg-white px-8 py-6 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            <TypewriterText text="Welcome to DOOHGLE Screen Manager" speed={80} />
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your digital advertising network with powerful analytics and real-time controls
          </p>
        </div>
      </div>
      
      {/* Tab Bar */}
      <div className="px-8 pt-6 pb-2 bg-white">
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-6">Select:</span>
          <div className="flex flex-1 justify-evenly">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 mx-2 px-4 py-2 text-sm rounded-full transition-all duration-300 font-medium text-center transform hover:scale-105 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Tab Content with Animations */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {tabDummyContent[activeTab].map((content, idx) => (
            <AnimatedContentLabel key={`${activeTab}-${idx}`} delay={idx * 200}>
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {content.title}
                  </h2>
                  {content.stats && (
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium animate-pulse">
                      {content.stats}
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {content.description}
                </p>
                <div className="mt-6 flex space-x-4">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                    View Details
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
                    Configure
                  </button>
                </div>
              </div>
            </AnimatedContentLabel>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Screen Manager Dashboard Component
const ScreenManagerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('gallery');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <div className="flex h-screen bg-gray-100 font-sans relative">
      {/* Floating Notifications */}
      <FloatingNotification />
      
      {/* Sidebar with transition */}
      <div
        className={`transition-all duration-300 h-full ${sidebarOpen ? 'w-80' : 'w-0'} overflow-hidden relative`}
        style={{ minWidth: sidebarOpen ? '20rem' : '0' }}
      >
        {/* Toggle button inside sidebar when open */}
        {sidebarOpen && (
          <button
            className="absolute top-6 right-4 z-50 bg-white border border-gray-200 shadow rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 ring-2 ring-white"
            onClick={() => setSidebarOpen(false)}
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="text-gray-500" />
          </button>
        )}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} sidebarOpen={sidebarOpen} />
      </div>
      {/* Toggle button at screen edge when sidebar is closed */}
      {!sidebarOpen && (
        <button
          className="fixed top-6 left-2 z-50 bg-white border border-gray-200 shadow rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300"
          onClick={() => setSidebarOpen(true)}
          aria-label="Expand sidebar"
        >
          <ChevronRight className="text-gray-500" />
        </button>
      )}
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <MainContent />
      </div>
    </div>
  );
};

export default ScreenManagerDashboard;
