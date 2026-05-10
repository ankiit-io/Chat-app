"use client";
import ChatSidebar from '@/components/ChatSidebar';
import Loading from '@/components/Loading';
import { useAppData,user } from '@/context/AppContext';
import { useRouter } from 'next/dist/client/components/navigation';
import React, { useEffect, useState } from 'react'

export interface Message{
  _id:string;
  chatId:string;
  sender:string;
  text?:string;
  image?:{
    url:string;
    public_id:string;
  }
  messageType:"text" | "image";
  seen:boolean;
  seenAt?:string;
  createdAt:string;
  updatedAt:string;
}

const app = () => {
  const {loading,isAuth,logout,chats,user:loggedInUser,users,fetchChats,fetchUsers,setChats} = useAppData();
  const [selectedUser,setSelectedUser] =useState<string | null>(null);
  const [message,setMessage]= useState("");
  const [sidebarOpen,setSidebarOpen] =useState(false);
  const [messages,setMessages] = useState<Message[] | null>(null)
  const [user,setUser] = useState<user | null>(null)
  const [showAllUsers,setShowAllUsers] = useState(false);
  const [isTyping,setIsTyping] = useState(false); 
  const [typingTimeout,setTypingTimeout] = useState<NodeJS.Timeout | null>(null); 
  const router = useRouter();

  useEffect(()=>{
    if(!isAuth && !loading) router.push("/login");
  },[isAuth,router,loading]);

  if(loading) return <Loading />
  
  return (
    <div className='flex min-h-screen text-white relative overflow-hidden bg-gray-900 '>
       <ChatSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} selectedUser={selectedUser} setSelectedUser={setSelectedUser} users={users} loggedInUser={loggedInUser} chats={chats} showAllUsers={showAllUsers} setShowAllUsers={setShowAllUsers} handleLogout={logout} /> 
    </div>
  )
}

export default app
