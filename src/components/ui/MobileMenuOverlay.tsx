import React from 'react';
import { X, MessageSquarePlus } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
}

const MobileMenuOverlay: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  onNewChat,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 animate-in slide-in-from-top duration-300 p-4 bg-black/20 backdrop-blur-sm">
      <div className="h-full flex flex-col bg-white/50 backdrop-blur-sm shadow-lg rounded-2xl relative">
        {/* Header z X */}
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100/50 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 pt-16 overflow-y-auto">
          {/* New Chat Button */}
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full p-3 bg-blue-900 text-white rounded-xl flex items-center justify-between hover:bg-blue-800 transition-colors group"
          >
            <span className="flex-1 text-left pl-2">Nowy chat</span>
            <MessageSquarePlus className="flex-shrink-0 w-5 h-5 ml-2" />
          </button>

          <div className="w-full h-px bg-gray-200 my-4" />

          {/* Historia chatów będzie tutaj */}
          <div className="space-y-2">
            {/* Lista chatów */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenuOverlay;