import { Menu } from "lucide-react";
import React from "react";
import { User } from "@/context/AppContext";

interface ChatHeaderProps {
  user: User | null;
  setSidebarOpen: (open: boolean) => void;
  isTyping: boolean;
}

const ChatHeader = ({ user, setSidebarOpen, isTyping }: ChatHeaderProps) => {
  return (
    <>
      {/* Menu Toggle Button */}
      <div className="sm:hidden fixed top-4 left-4 z-50">
        <button
          className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-5 h-5 text-gray-200" />
        </button>
      </div>
    </>
  );
};

export default ChatHeader;
