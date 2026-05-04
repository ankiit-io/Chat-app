"use client"

import axios from "axios";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
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

    useEffect(()=>{
        fetchUser();
    },[]);


    return <AppContext.Provider value={{user,loading,isAuth,setUser,setIsAuth}}>{children}
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