"use client"

import axios from "axios";
import Cookies from "js-cookie";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
export const user_Service = "http://localhost:5000";
export const chat_Service = "http://localhost:5002";


export interface user{
    _id:string;
    email:string;
    name:string;
}

export interface chat{
    _id:string;
    users:string[];
    latestMessage:{
        text:string;
        sender:string;
    };
    createdAt:string;
    updatedAt:string;
    unseenCount?:number;
}

export interface chats{
    _id:string;
    user:user;
    chat:chat;
}

interface AppContextType{
    user:user | null;
    loading:boolean;
    isAuth:boolean;
    setUser:React.Dispatch<React.SetStateAction<user | null>>;
    setIsAuth:React.Dispatch<React.SetStateAction<boolean>>;
    logout:()=>Promise<void>;
    fetchUsers:()=>Promise<void>;
    fetchChats:()=>Promise<void>;
    chats:chats[] | null;
    users:user | null;
    setChats:React.Dispatch<React.SetStateAction<chats[] | null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps{
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({children})=>{
    const [user,setUser] = useState<user | null>(null);
    const [isAuth,setIsAuth] =useState<boolean>(false);
    const [loading,setLoading] = useState<boolean>(false);


  async function fetchUser() 
  {
    console.log("fetchUser called");
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      console.log("TOKEN:", token); // DEBUG

      if (!token) {
        console.log("No token → skipping /me");
        setLoading(false);
        return;
      }

      const { data } = await axios.get(`${user_Service}/api/v1/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("USER DATA:", data); // DEBUG

      setUser(data);
      setIsAuth(true);
    } catch (error) {
      console.log("FETCH USER ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {   
    Cookies.remove("token");
    setUser(null);
    setIsAuth(false);
    toast.success("Logged out successfully");
  }

const [chats,setChats] = useState<chats[] | null >(null);

  async function fetchChats() {
   const token = Cookies.get("token");
    try {
      const {data} = await axios.get(`${chat_Service}/api/v1/chat/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChats(data.chats);
    } catch (error) {
      console.log("FETCH CHATS ERROR:", error);
    }
  }

  const [users,setUsers] = useState<user | null>(null);
  
  async function fetchUsers() {
    const token = Cookies.get("token");
    try {
      const {data} = await axios.get(`${user_Service}/api/v1/user/all`,{
        headers:{
          Authorization: `Bearer ${token}`,
        }
      });
      setUsers(data);

    } catch (error) {
      console.log(error);
    }
  }
    useEffect(()=>{
        fetchUser();
        fetchChats();
        fetchUsers();
    },[]);


    return <AppContext.Provider value={{user,loading,isAuth,setUser,setIsAuth,logout,fetchUsers,users,fetchChats,chats,setChats}}>{children}
    <Toaster />
    </AppContext.Provider>;
}

export const useAppData = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
      throw new Error("useAppData must be used within a AppProvider");
    }
    return context;
  };