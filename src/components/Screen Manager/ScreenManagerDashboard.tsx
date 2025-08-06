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
  LogOut
} from 'lucide-react';
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

const TABS = [
  { id: 'all', label: 'Show all' },
  { id: 'screen', label: 'Screen Manager' },
  { id: 'ads', label: 'Ads Manager' },
  { id: 'content', label: 'Content' },
  { id: 'framen', label: 'Doohgle' },
];

const tabDummyContent: Record<string, string[]> = {
  all: [
    'All Content Block 1',
    'All Content Block 2',
    'All Content Block 3',
  ],
  screen: [
    'Screen Manager Content 1',
    'Screen Manager Content 2',
  ],
  ads: [
    'Ads Manager Content 1',
    'Ads Manager Content 2',
  ],
  content: [
    'Content Tab Example 1',
    'Content Tab Example 2',
  ],
  framen: [
    'Doohgle Tab Example 1',
    'Doohgle Tab Example 2',
  ],
};

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');

  return (
    <div className="flex flex-col w-full h-full bg-gray-50">
      {/* Tab Bar */}
      <div className="px-8 pt-6 pb-2 bg-white">
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-6">Select:</span>
          <div className="flex flex-1 justify-evenly">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 mx-2 px-4 py-2 text-sm rounded-full transition-colors font-medium text-center ${
                  activeTab === tab.id
                    ? 'bg-gray-200 text-gray-900'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {tabDummyContent[activeTab].map((content, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow p-8 text-lg text-gray-800">
              {content}
            </div>
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
