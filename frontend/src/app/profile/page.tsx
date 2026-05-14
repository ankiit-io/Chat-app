"use client";
import { useAppData, user_Service } from '@/context/AppContext';
import { useRouter } from 'next/dist/client/components/navigation';
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';   
import axios from 'axios';
import { toast } from 'react-hot-toast/headless';
import Loading from '@/components/Loading';
import { ArrowLeft } from 'lucide-react';
const ProfilePage = () => {
    const {user,isAuth,loading,setUser} = useAppData();
    const [isEdit, setisEdit] = useState(false);
    const [name, setName] = useState<string | undefined>("");
    const router = useRouter();
    const editHandler =()=>{
        setisEdit(!isEdit);
        setName(user?.name);
    }
    const submitHandler = async(e:any)=>{
    e.preventDefault()
    const token = Cookies.get("token");
    try{
        const {data} = await axios.post(`${user_Service}/api/v1/update/name`,{name},{
            headers:{
                Authorization: `Bearer ${token}`,
            }
        })
        Cookies.set("token",data.token,{
            expires: 15,
            secure: false,
            path: "/",
        });
    toast.success("Name updated successfully");
    setUser(data.user);
    setisEdit(false);
    }
    catch(error:any){
    toast.error(error.response.data.message);
}
    }

    useEffect(()=>{
        if(!isAuth && !loading){
            router.push("/login");
        }
    }, [isAuth, loading, router]);

    if(loading) return <Loading/>
    return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="flex items-center gap-4 mb-8">
           <button className="bg-gray-8k00 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={()=>router.push("/chat")}>
            <ArrowLeft className="w-5 h-5 text-gray-300" />
           </button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
