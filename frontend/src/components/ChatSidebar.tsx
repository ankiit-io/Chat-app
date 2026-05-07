import { chats, user } from '@/context/AppContext';
import React from 'react'


interface chatSidebarProps{
sidebarOpen:boolean;
setSidebarOpen:(open:boolean)=>void;
showAllUsers:boolean;
setShowAllUsers:(show:boolean | ((prevState: boolean) => boolean) )=>void;
users:user | null;
loggedInUser:user | null;
chats:chats[] | null;
selectedUser:string | null;
setSelectedUser:(userId:string | null)=>void;
handleLogout:()=>Promise<void>;
}
const chatSidebar = ({sidebarOpen,setSidebarOpen,showAllUsers,setShowAllUsers,users,loggedInUser,chats,selectedUser,setSelectedUser ,handleLogout}: chatSidebarProps) => {
  return (
    <div>
      ChatSidebar
    </div>
  )
}

export default chatSidebar;
