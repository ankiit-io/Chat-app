import axios from "axios";
import tryCatch from "../config/tryCatch.js";
import type { AuthenticatedRequest } from "../middlewares/isAuth.js";
import Chat from "../models/chat.js";
import { Messages } from "../models/message.js";

export const createChat = tryCatch(async (req:AuthenticatedRequest, res) => {
 
  const userId = req.user;
  const { otherUserId } = req.body;

  if(!otherUserId){
    res.status(400).json({message:"other userid is required"});
    return;
  }

  const existingchat = await Chat.findOne({
    users: { $all: [userId, otherUserId] ,$size: 2 }
  });
    if(existingchat){
    res.json({
        message:"Chat already exists" ,
        chatId:existingchat._id
    });
        return;
    }

    const newChat = await Chat.create({
        users:[userId,otherUserId]
    });

    res.status(201).json({
        message:"New Chat created successfully",
        chatId:newChat._id
    });

});


export const getAllChats = tryCatch(async(req:AuthenticatedRequest, res) => {
  const userId = req.user;
  if(!userId) {
    res.status(400).json({message:"User id missing"});
    return;
  }

  const chats = await Chat.find({ users: userId }).sort({updatedAt: -1});

  const chatsWithUserData = await Promise.all
  (chats.map(async (chat) => {
    const otherUserId = chat.users.find((id) => id !== userId);

    const unseenCount = await Messages.countDocuments({
        chatId: chat._id,
        seen: false,
        sender: { $ne: userId }
    });

    try {
      const {data} = await axios.get(
        `${process.env.USER_SERVICE_URL}/api/v1/users/${otherUserId}`
      );
      return{
        user:data,
        chat:{
          ...chat.toObject(),
          latestMessage : chat.latestmessage || null,
          unseenCount,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        user:{_id:otherUserId, name:"Unknown User"},
        chat: {
          ...chat.toObject(),
          latestMessage: chat.latestmessage || null,
          unseenCount,
        },
      };
    }
  })
);
    res.json({
      chats: chatsWithUserData
    })
})

export const sendMessage = tryCatch(async(req:AuthenticatedRequest, res) => {
  const senderId = req.user;
  const { chatId, text } = req.body;
  const imageFile = req.file;


   if(!senderId){
    res.status(401).json({message:"Unauthorized"});
    return;
  }

  if(!chatId){
    res.status(400).json({message:"Chat id is required"});
    return;
  }

  if(!text && !imageFile){
    res.status(400).json({message:"Message text or image is required"});
    return;
  }
  const chat = await Chat.findById(chatId);
  if(!chat){
    res.status(404).json({message:"Chat not found"});
    return;
  }

  const isUserInChat = chat.users.some(
    (userId) => userId.toString() === senderId.toString()
  );

  if(!isUserInChat){
    res.status(403).json({message:"You are not a participant of this chat"});
    return;
  }

  const otherUserId = chat.users.find((userId) => userId.toString() !== senderId.toString());
  
  if(!otherUserId){
    res.status(401).json({message:"No other User"});
    return;
  }

  //socket setup

  let messageData:any = {
    chatId: chatId,
    sender: senderId,
    seen: false,
    seenAt: undefined,
  };

  if(imageFile){
     messageData.image = {
      url:imageFile.path,
      filename:imageFile.filename,
     };
     messageData.text = text || "";
     messageData.type = "image";
  }
  else{
    messageData.text = text;
    messageData.type = "text";
  }
  const message = new Messages(messageData);
  const savedMessage = await message.save();
  const latestMessageText = imageFile ? "Sent an image 📸" : text;
  
  await Chat.findByIdAndUpdate(chatId, 
    { latestmessage:{
       text: latestMessageText,
       sender: senderId,
    },
    updatedAt: new Date(),
    },
    {new:true}
   );

   //emit to sockets


   res.status(201).json({
    message:savedMessage,
    sender:senderId,
   });
});

export const getMessagesByChat = tryCatch(async(req:AuthenticatedRequest, res) => {
  const userId = req.user;
  const {chatId} = req.params;

  if(!chatId){
    res.status(400).json({ message: "Chat id is required" });
    return;
  }

  if(!userId){
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const chat = await Chat.findById(chatId);
  if(!chat){
    res.status(404).json({ message: "Chat not found" });
    return;
  }
  const isUserInChat = chat.users.some(
    (participantId) => participantId.toString() === userId.toString(),
  );
  if(!isUserInChat){
    res.status(403).json({ message: "You are not a participant of this chat" });
    return;
  }

  const messagesToMarkSeen = await Messages.find({
    chatId: chatId,
    seen: false,
    sender: { $ne: userId }
  });

  await Messages.updateMany({
    chatId: chatId,
    seen: false,
    sender: { $ne: userId }
  }, {
    seen: true,
    seenAt: new Date()
  });

  const messages = await Messages.find({ chatId }).sort({ createdAt: 1 });

  const otherUserId = chat.users.find((id) => id.toString() !== userId.toString());

  try {
    const { data } = await axios.get(
      `${process.env.USER_SERVICE_URL}/api/v1/users/${otherUserId}`
    );
    if(!otherUserId){
      res.status(404).json({ message: "Other user not found" });
      return;
    }

    //socket work

    res.json({
      messages,
      user: data,
    });
  } catch (error) {
    console.log(error);
    res.json({
      messages,
      user: { _id: otherUserId, name: "Unknown User" },
    });
  }

});