import amqp from "amqplib";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export const startSendOtpConsumer = async () => {
    try {
        const connection = await amqp.connect({
            protocol: "amqp",
            hostname: process.env.RABBITMQ_HOST,
            port: 5672,
            username: process.env.RABBITMQ_USER,
            password: process.env.RABBITMQ_PASS,
        });
    
    const channel = await connection.createChannel();
    const queueName = "send-otp";
    await channel.assertQueue(queueName, { durable: true });
    console.log(`🐇 Waiting for messages in queue: ${queueName}`);

    channel.consume(queueName, async (message) => {
        if (!message) return;

            try {
               const {to,subject,body} = JSON.parse(message.content.toString());
               const smtpUser = process.env.EMAIL_USER ?? process.env.USER;
               const smtpPass = process.env.EMAIL_PASS ?? process.env.PASS;

               if (!smtpUser || !smtpPass) {
                throw new Error("Missing SMTP credentials. Set EMAIL_USER/EMAIL_PASS or USER/PASS in mail .env");
               }

               const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth:{
                    user: smtpUser,
                    pass: smtpPass,
                }
                
               })
               await transporter.sendMail({
                from: smtpUser,
                to,
                subject,
                text: body,
               })
               console.log(`Mail sent to:${to}`)
               channel.ack(message);
            } catch (error) {
                console.error("Error sending OTP", error);
                channel.nack(message, false, false);
            }
        })
    } catch (error) {
       console.error("Failed to connect to RabbitMQ", error);
       process.exit(1); 
    }
}    