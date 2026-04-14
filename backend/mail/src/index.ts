import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Mail service is running on port ${port}`);
});