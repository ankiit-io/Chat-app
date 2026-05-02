"use client";
import axios from "axios";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const LoginPage = () => {
  const [email, setEmail] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post("http://localhost:5000/api/v1/login", {
        email,
      });
      alert(data.message);
      router.push(`/verify?email=${email}`);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 border border-gr rounded-lg p-8">
          <div className="text-center m-8">
            <div
              className="mx-auto w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-6
                "
            >
              <Mail size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Welcome to Chatify
            </h1>
            <p className="text-gray-300 text-lg">Enter Email to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-4 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5" />{" "} Sending Otp to your mail </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>send verification code</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
