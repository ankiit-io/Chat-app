import { Loader2, Paperclip, Send, X } from 'lucide-react';
import React, { useState } from 'react'

interface MessageInputProps {
    selectedUser: string | null;
    message: string;
    setMessage: (message: string) => void;
    handleMessageSend: (e:any,imageFile?:File | null) => void;
    handleTyping: () => void;
}
const MessageInput = ({selectedUser,message,setMessage,handleMessageSend,handleTyping}:MessageInputProps) => {
  const[imageFile,setImageFile] = useState<File | null>(null);
  const [isUploading,setIsUploading] = useState(false);
  
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (!message && !imageFile) return;
    setIsUploading(true);
    await handleMessageSend(e, imageFile);
    setIsUploading(false);
    setImageFile(null);
  }
   
  if(!selectedUser){
    return null;
  }

  
  return (
    <form
      className="flex flex-col gap-2 border-t border-gray-700  pt-2"
      onSubmit={handleSubmit}
    >
      {imageFile && (
        <div className="relative w-fit ">
          <img
            src={URL.createObjectURL(imageFile)}
            alt="preview"
            className=" w-24 h-24 object-cover border-gray-600 max-w-xs max-h-60 rounded-lg"
          />
          <button
            type="button"
            className="absolute -top-2 -right-2 bg-gray-600 text-white rounded-full p-1 hover:bg-gray-500 transition-colors duration-200"
            onClick={() => setImageFile(null)}
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <label
          htmlFor="image-upload"
          className="cursor-pointer text-gray-400 hover:text-gray-300 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors duration-200"
        >
          <Paperclip size={18} className="text-gray-300" />
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && file.type.startsWith("image/")) {
                setImageFile(file);
              }
            }}
          />
        </label>
        <input
          type="text"
          placeholder={imageFile ? "Add a caption... " : "Type a message"}
          className="flex-1 placeholder:gray-400 bg-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors duration-200"
          disabled={(!imageFile && !message) || isUploading}
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          ) : (
            <Send size={18} className="w-4 h-4 text-white" />
          )}
        </button>
      </div>
    </form>
  );
}

export default MessageInput
  