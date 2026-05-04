"use client";
import Loading from '@/components/Loading';
import { useAppData } from '@/context/AppContext';
import { useRouter } from 'next/dist/client/components/navigation';
import React, { useEffect } from 'react'

const app = () => {
  const {loading,isAuth} = useAppData();
  const router = useRouter();

  useEffect(()=>{
    if(!isAuth && !loading) router.push("/login");
  },[isAuth,router,loading]);

  if(loading) return <Loading />
  
  return (
    <div>
      chat app
    </div>
  )
}

export default app
