"use client";
import ChatSidebar from '@/components/ChatSidebar';
import Loading from '@/components/Loading';
import { useAppData,user } from '@/context/AppContext';
import { useRouter } from 'next/dist/client/components/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast/headless';
import Cookies from "js-cookie";
import axios from 'axios';
import ChatHeader from '@/components/ChatHeader';
import { chat_Service , user_Service } from '@/context/AppContext';
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


  async function fetchChat(chatId:string){
    const token = Cookies.get("token");

    try{
      const {data} = await axios.get(`${chat_Service}/api/v1/message/${selectedUser}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(data.messages);
      setUser(data.user);
      await fetchChats();
    }
    catch(error){
      toast.error("Failed to fetch chat");
    }
     
  }
  async function createChat(u:user){

   try {
  const token = Cookies.get("token");
  

  const { data } = await axios.post(
    `${user_Service}/api/v1/chat/new`,
    {
      userId: loggedInUser?._id,
      otherUserId: u._id,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  setSelectedUser(data.chat._id);
  setShowAllUsers(false);
  await fetchChats();
}
    catch(error){
      toast.error("Failed to create chat");
    }
  
  }

  useEffect(()=>{
    if(selectedUser) {
       fetchChats();
    }
  }, [selectedUser]);

  if(loading) return <Loading />
  
  return (
    <div className='flex min-h-screen text-white relative overflow-hidden bg-gray-900 '>
       <ChatSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} selectedUser={selectedUser} setSelectedUser={setSelectedUser} users={users} loggedInUser={loggedInUser} chats={chats} showAllUsers={showAllUsers} setShowAllUsers={setShowAllUsers} handleLogout={logout} 
       createChat={createChat}
       /> 
       <div className="flex-1 flex flex-col justify-between p-4 backdrop:blur-xl bg-white/5 border-1 border-white/10 ">
        <ChatHeader user={user} setSidebarOpen={setSidebarOpen} isTyping={isTyping}/>
        </div>
    </div>
  )
}

export default app
