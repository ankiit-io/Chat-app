import { Menu, UserCircle } from "lucide-react";
import React from "react";
import { User } from "@/context/AppContext";

interface ChatHeaderProps {
  user: User | null;
  setSidebarOpen: (open: boolean) => void;
  isTyping: boolean;
  onlineUsers: string[];
}

const ChatHeader = ({ user, setSidebarOpen, isTyping,onlineUsers }: ChatHeaderProps) => {
 const isOnlineUser = user && onlineUsers.includes(user._id) ;
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
      {/*Chat header */}
      <div className="mb-6 bg-gray-800 rounded-lg border-gray-700 p-6">
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center">
                  <UserCircle className="w-8 h-8 text-gray-400" />
                </div>
                {/* Online Indicator */}
                {isOnlineUser && (
                  <span className="absolute -right-0.5 -bottom-0.5 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900">
                    <span className="absolute animate-ping inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  </span>
                )}
              </div>
              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col ">
                  <h2 className="text-2xl font-bold text-white truncate">
                    {user.name}
                  </h2>

                  {/* Typing Indicator */}
                  <div className="flex items-center gap-2">
                    {
                      isTyping ? <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <span className="text-gray-400">Typing...</span>
                        </div>:
                      <div className="flex items-center gap-2 text-sm">
                        <div className={`w-2 h-2 rounded-full ${isOnlineUser ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className={`text-sm ${isOnlineUser ? 'text-green-500' : 'text-gray-400'}`}>
                          {isOnlineUser ? "Online" : "Offline"}
                        </span>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center">
                <UserCircle className="w-8 h-8 text-gray-400" />
              </div>
              <div className="">
                <h2 className="text-2xl font-bold text-white">Select a chat</h2>
                <p className="text-sm text-gray-500 mt-1">
                  choose a chat from the sidebat to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatHeader;
