import express from 'express';
import dotenv, { config } from 'dotenv';
import { connect } from 'mongoose';
import connectDB from './config/db.js';
import chatRoutes from './routes/chat.js';
import cors from 'cors';
import {app,server} from './config/socket.js';
dotenv.config();
connectDB();

const port = process.env.PORT ;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://13.232.91.51:3000"],
    credentials: true,
  }),
);
app.use("/api/v1", chatRoutes);


server.listen(port, () => {
  console.log(`Chat service is running on port ${port}`);
})
