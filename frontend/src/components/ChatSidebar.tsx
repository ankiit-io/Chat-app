import { chats, user } from "@/context/AppContext";
import {
  MessageCircle,
  X,
  Plus,
  Search,
  UserCircle,
  CornerUpLeft,
  CornerDownRight,
  LogOut,
} from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
interface chatSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  showAllUsers: boolean;
  setShowAllUsers: (show: boolean | ((prevState: boolean) => boolean)) => void;
  users: user[] | null;
  loggedInUser: user | null;
  chats: chats[] | null;
  selectedUser: string | null;
  setSelectedUser: (userId: string | null) => void;
  handleLogout: () => Promise<void>;
  createChat: (u:user) => void;
}

const ChatSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  showAllUsers,
  setShowAllUsers,
  users,
  loggedInUser,
  chats,
  selectedUser,
  setSelectedUser,
  handleLogout,
  createChat,
}: chatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  
  return (
    <aside
      className={`fixed z-20 sm:static top-0 left-0 h-screen w-80 bg-gray-900 border-r border-gray-700 transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0 transition-transform duration-300 flex flex-col`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="sm:hidden flex justify-end mb-2">
          <button
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6 text-gray-300" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>

            <h2 className="text-xl font-bold text-white">
              {showAllUsers ? "New Chat" : "Messages"}
            </h2>
          </div>

          <button
            className={`p-2.5 rounded-lg transition-colors duration-200 ${
              showAllUsers
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
            onClick={() => setShowAllUsers((prev) => !prev)}
          >
            {showAllUsers ? (
              <X className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden px-4 py-3">
        {showAllUsers ? (
          <div className="space-y-4 h-full flex flex-col">
            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full bg-gray-800 border border-gray-700 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* User List */}
            <div className="space-y-2 overflow-y-auto h-full pb-4">
              {users
                ?.filter(
                  (u) =>
                    u._id !== loggedInUser?._id &&
                    u.name.toLowerCase().includes(searchQuery.toLowerCase()),
                )
                .map((u) => (
                  <button
                    key={u._id}
                    onClick={() => createChat(u)}
                    className="w-full text-left p-4 rounded-xl border border-gray-700 hover:border-gray-600 hover:bg-gray-800 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                        <UserCircle className="w-7 h-7 text-gray-300" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="block text-sm font-medium text-white truncate">
                          {u.name}
                        </span>

                        <p className="text-xs text-gray-400 mt-1">
                          Start a conversation
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        ) : chats && chats.length > 0 ? (
          <div className="space-y-2 overflow-y-auto h-full pb-4">
            {chats.map((chat) => {
              const latestMessage = chat.chat.latestMessage;
              const isSelected = selectedUser === chat.chat._id;
              const isSentByMe = latestMessage?.sender === loggedInUser?._id;

              const unseenCount = chat.chat.unseenCount || 0;

              return (
                <button
                  key={chat.chat._id}
                  onClick={() => {
                    setSelectedUser(chat.chat._id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                    isSelected
                      ? "bg-blue-600/20 border-blue-500"
                      : "border-gray-700 hover:border-gray-600 hover:bg-gray-800"
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                      <UserCircle className="w-7 h-7 text-gray-300" />
                    </div>
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`font-semibold truncate ${
                          isSelected ? "text-white" : "text-gray-200"
                        }`}
                      >
                        {chat.user.name}
                      </span>

                      {unseenCount > 0 && (
                        <div className="bg-red-600 text-white text-xs font-bold rounded-full min-w-[22px] h-[22px] px-1.5 flex items-center justify-center">
                          {unseenCount > 99 ? "99+" : unseenCount}
                        </div>
                      )}
                    </div>

                    {/* Latest Message */}
                    {latestMessage && (
                      <div className="flex items-center gap-2">
                        {isSentByMe ? (
                          <CornerUpLeft
                            size={14}
                            className="text-blue-400 shrink-0"
                          />
                        ) : (
                          <CornerDownRight
                            size={14}
                            className="text-green-400 shrink-0"
                          />
                        )}

                        <span className="text-sm text-gray-400 truncate flex-1">
                          {latestMessage.text || "Sent an image 📷"}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center ">
            <div className="p-4 bg-gray-800 rounded-full mb-4">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <p className="font-medium text-gray-400">No chats found</p>
            <p className="text-sm text-gray-500 mt-1">
              Start a new conversation
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 space-y-2">
        <Link
          href={`/profile`}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200"
        >
          <div className="p-1.5 bg-gray-700 rounded-lg">
            <UserCircle className="w-4 h-4 text-gray-300" />
          </div>
          <span className="font-medium text-gray-300">Profile</span>
        </Link>
        <button
          onClick={handleLogout}
          className="group w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 text-red-500 hover:text-white transition-colors duration-200"
        >
          <div className="p-1.5 bg-red-500 group-hover:bg-gray-700 rounded-lg transition-colors duration-200">
            <LogOut className="w-4 h-4 text-gray-200" />
          </div>

          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default ChatSidebar;
