import React from 'react';
import { Card } from '@/components/ui/card';
import { MessageSquarePlus } from 'lucide-react';

interface ChatSidebarProps {
  onNewChat?: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ onNewChat }) => {
  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 -translate-x-[85%] hover:translate-x-0 transition-all duration-300 z-10">
      <Card className="w-64 h-[80vh] bg-white/50 backdrop-blur-sm shadow-lg relative rounded-r-lg">
        <div className="p-4 space-y-6 h-full">
          {/* Przycisk Nowy chat */}
          <button
            onClick={onNewChat}
            className="w-full p-3 bg-blue-900 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors"
          >
            <MessageSquarePlus size={20} />
            <span>Nowy chat</span>
          </button>

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
