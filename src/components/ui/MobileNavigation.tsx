import React from 'react';
import { MessageSquarePlus, Settings, User } from 'lucide-react';

interface MobileNavigationProps {
  onToggleSidebar: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  onToggleSidebar
}) => {
  return (
    <div className="bg-white px-6 border-b border-gray-100 py-4">
      <div className="flex justify-between items-center">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <MessageSquarePlus className="w-5 h-5 text-gray-500" />
        </button>

        <div
          className="relative group"
          onClick={() => window.location.reload()}
          style={{ cursor: 'pointer' }}
          onMouseEnter={(e) => e.currentTarget.querySelector('div').style.width = '105%'}
          onMouseLeave={(e) => e.currentTarget.querySelector('div').style.width = '150%'}
        >
          <h1 className="text-xl text-gray-800 tracking-wide">
            <span className="font-bold">omega3</span>
            <span className="font-light">gpt.pl</span>
          </h1>
          <div
            className="h-px bg-gray-200 mt-2 transition-all duration-300"
            style={{
              width: '150%',
              position: 'relative',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <User className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileNavigation;