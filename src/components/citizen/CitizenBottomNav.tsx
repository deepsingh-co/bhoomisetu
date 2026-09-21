import React from 'react';
import { Home, Search, Compass, FolderClosed, User } from 'lucide-react';
import { CitizenActiveTab } from '../../types/citizen';

interface CitizenBottomNavProps {
  activeTab: CitizenActiveTab;
  onTabChange: (tab: CitizenActiveTab) => void;
  documentCount?: number;
}

export const CitizenBottomNav: React.FC<CitizenBottomNavProps> = ({
  activeTab,
  onTabChange,
  documentCount = 5,
}) => {
  const navTabs: { id: CitizenActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'map', label: 'Map GIS', icon: Compass },
    { id: 'wallet', label: 'Docs', icon: FolderClosed },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#D8DEE8] shadow-lg px-2 py-1.5 flex items-center justify-around">
      {navTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg relative transition-all ${
              isActive ? 'text-[#123A78]' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#123A78] stroke-[2.5]' : ''}`} />
              {tab.id === 'wallet' && documentCount > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 bg-[#0B7A3B] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {documentCount}
                </span>
              )}
            </div>
            <span className={`text-[10px] mt-0.5 font-medium ${isActive ? 'font-bold text-[#123A78]' : ''}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
