import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { startSendOtpConsumer } from './consumer.js';

dotenv.config();
startSendOtpConsumer();

const app = express();

const port = process.env.PORT || 5001;
app.listen(port, () => {
    console.log(`Mail service is running on port ${port}`);
});