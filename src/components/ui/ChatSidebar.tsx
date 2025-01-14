import React from 'react';
import { Card } from '@/components/ui/card';
import { MessageSquarePlus } from 'lucide-react';

interface ChatSidebarProps {
  onNewChat?: () => void;
  isMobile?: boolean;
  isOpen?: boolean;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  onNewChat,
  isMobile = false,
  isOpen = false
}) => {
  return (
    <div className={`fixed left-0 top-1/2 -translate-y-1/2 transition-all duration-300 z-10
      ${isMobile
        ? `${isOpen ? 'translate-x-0' : '-translate-x-full'}`
        : '-translate-x-[75%] hover:translate-x-0'
      }`}
    >
      <Card className="w-64 h-[80vh] bg-white/50 backdrop-blur-sm shadow-lg relative rounded-r-lg">
        <div className="p-4 space-y-6 h-full">
          {/* Przycisk Nowy chat */}
          <div className="relative overflow-hidden">
            <button
              onClick={onNewChat}
              className="w-full p-3 bg-blue-900 text-white rounded-xl flex items-center justify-between hover:bg-blue-800 transition-colors group"
            >
              <span className="flex-1 text-left pl-2">Nowy chat</span>
              <MessageSquarePlus className="flex-shrink-0 w-5 h-5 ml-2 mr-1" />
            </button>
          </div>

          {/* Linia pozioma */}
          <div className="w-full h-px bg-gray-200" />

          {/* Miejsce na przyszłą historię chatów */}
          <div className="space-y-2">
            {/* Tu będzie można dodać listę poprzednich chatów */}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatSidebar;