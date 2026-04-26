import e from "express";
import { publishToQueue } from "../config/rabbitmq.js";
import tryCatch from "../config/tryCatch.js";
import { redisClient } from "../index.js";
import { User } from "../model/User.js";
import { generateToken } from "../config/generateToken.js";
import type { AuthenticatedRequest } from "../middleware/isAuth.js";

export const loginUser = tryCatch(async (req, res) => {
  const { email } = req.body;

  const rateLimitKey = `otp:ratelimit:${email}`;
  const rateLimit = await redisClient.get(rateLimitKey);

  if (rateLimit) {
    res
      .status(429)
      .json({ message: "Too many requests. Please try again later." });
    return;
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await redisClient.setEx(`otp:${email}`, 300, otp);
  await redisClient.setEx(rateLimitKey, 60, "1");

  const message = {
    to: email,
    subject: "Your OTP Code",
    body: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
  };

  await publishToQueue("send-otp", message);

  res.status(200).json({ message: "OTP sent to email" });
});

export const verifyUser = tryCatch(async (req, res) => {
  const { email, otp:enteredOtp } = req.body;

  if (!email || !enteredOtp) {
    res.status(400).json({ message: "Email and OTP are required" });
    return;
  }

  const otpKey = `otp:${email}`;
  const storedOtp = await redisClient.get(otpKey);

  if (!storedOtp ) {
    res.status(400).json({ message: "OTP expired or not found" });
    return;
  }

  if (storedOtp !== enteredOtp) {
    res.status(400).json({ message: "Invalid OTP" });
    return;
  }

  await redisClient.del(otpKey); //we will delete the OTP after successful verification
  
  let user = await User.findOne({ email });
  if (!user) {
    const name = email.slice(0,8);
    user = await User.create({ name, email });

  }
  
  const token = generateToken(user._id);
  res.json({
    message: "OTP verified successfully",
    user,
    token,
  })
});

export const myProfile = tryCatch(async(req:AuthenticatedRequest,res)=>{
    const user = req.user;
    res.json(user);
});

export const updatename = tryCatch(async (req: AuthenticatedRequest, res) => {
  
  const user = await User.findById(req.user);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  user.name = req.body.name || user.name;
  await user.save();

  const token = generateToken(user);

  res.json({
    message: "Name updated successfully",
    user,
    token,
  });
});

export const getAllUsers = tryCatch(async(req:AuthenticatedRequest,res)=>{
  const users = await User.find();
  res.json(users);
});

export const getAUser = tryCatch(async(req:AuthenticatedRequest,res)=>{
  const user = await User.findById(req.params.id);
  if(!user){
    res.status(404).json({message:"User not found"});
    return;
  }
  res.json(user);
});