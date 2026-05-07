"use client"
import { useAppData, user_Service } from '@/context/AppContext';
import axios from 'axios';
import { ArrowRight, ChevronLeft, Loader2, Mail } from 'lucide-react';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Loading from './Loading';
import Cookies from "js-cookie";  
import { toast } from 'react-hot-toast';
const verifyOtp = () => {
    const {isAuth,setIsAuth,setUser,loading:userLoading,fetchChats,fetchUsers} = useAppData();   
    const [loading, setLoading] = React.useState(false);
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const [otp,SetOtp] = useState<string[]>(["","","","","",""]);
    const [error,setError] = useState<string>("");
    const [resendLoading,setResendLoading] = useState<boolean>(false);
    const [timer,SetTimer] = useState<number>(60);
    const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);
    const router = useRouter();


    useEffect(()=>{
        if(timer>0){
            const interval = setInterval(()=>{
                SetTimer((prev)=>prev-1);
            },1000);
            return ()=>clearInterval(interval);
        }
    },[timer]);

    console.log(timer); 



    const handleInputChange = (index:number,value:string):void=>{

        if(value.length>1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        SetOtp(newOtp);
        setError("");
        if(value && index<5){
            inputRefs.current[index+1]?.focus();
        }

    }

    const handleKeyDown = (index:number,e:React.KeyboardEvent<HTMLInputElement>):void=>{
        if(e.key === "Backspace" && !otp[index] && index>0){
            inputRefs.current[index-1]?.focus();
        }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
      e.preventDefault();

      const pastedData = e.clipboardData.getData("text");
      const digits = pastedData.replace(/\D/g, "").slice(0, 6).split("");

      const newOtp = ["", "", "", "", "", ""];

      digits.forEach((digit, index) => {
        newOtp[index] = digit;
      });

      SetOtp(newOtp);

      // move focus properly
      const nextIndex = digits.length < 6 ? digits.length : 5;
      inputRefs.current[nextIndex]?.focus();
    };
    const handleSubmit = async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const otpString = otp.join("");
        if(otpString.length!==6){
            setError("Please enter 6 digit OTP");
            return;
        }
        setError("");
        setLoading(true);
        try {
            const {data} = await axios.post(`${user_Service}/api/v1/verify`,{
                email,
                otp: otpString
            });
            toast.success(data.message);
            
           Cookies.set("token",data.token,{
            expires: 15,
            secure: false,
            path: "/",
           });
           // wait before redirect
           setTimeout(() => {
             window.location.href = "/";
           }, 1500);

           SetOtp(["","","","","",""]); 
           inputRefs.current[0]?.focus();
           setUser(data.user);  
           setIsAuth(true);
           fetchChats();
           fetchUsers(); 
        } catch (error:any) {
           setError(error.response.data.message || "Something went wrong");
        }
        finally{
            setLoading(false);
        }
    }

    const handleResend = async()=>{
        setResendLoading(true);
        setError("");
        
        try {
          const { data } = await axios.post(
            `${user_Service}/api/v1/login`,
            { email },
          );
          toast.success(data.message);
          SetTimer(60);
        } catch (error: any) {
          setError(error.response.data.message || "Something went wrong");
        } finally {
          setResendLoading(false);
        }
    };
    if(userLoading) return <Loading />
    if(isAuth) redirect("/chat");  
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 border border-gr rounded-lg p-8">
          <div className="text-center m-8 relative">
            <button
              className="absolute top-0 left-0 text-gray-400 hover:text-white"
              onClick={() => router.push("/login")}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div
              className="mx-auto w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-6
                "
            >
              <Mail size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Verify Your Email
            </h1>
            <p className="text-gray-300 text-lg">Sent an 6 digit code to</p>
            <p className="text-blue-400 font-medium">{email}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4 text-center">
                Enter 6 digit OTP
              </label>
              <div className="flex justify-center in-checked: space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    className="w-12 h-12 rounded- borde border-gray-600  bg-gray-700 text-center text-xl rounded-lg text-white font-bold focus:outline-none"
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-900 p-3 border-red-700 text-center rounded-lg">
                <p className="text-red-300 text-sm text-center">{error}</p>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5" /> Verifying...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Verify</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gra text-sm mb-4">Didn't receive the code?</p>
            {timer > 0 ? (
              <p className="text-gray-400 text-sm ">
                Resend code in {timer} seconds
              </p>
            ) : (
              <button
                onClick={() => handleResend()}
                className="text-blue-400 hover:text-blue-300 disabled:opacity-50  text-sm font-medium"
                disabled={resendLoading}
              >
                {resendLoading ? "sending..." : "Resend Code"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default verifyOtp
