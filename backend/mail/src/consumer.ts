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
               const transporter = nodemailer.createTransport({
                host: "smtp@gmail.com",
                port: 465,
                auth:{
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                }
                
               })
               await transporter.sendMail({
                from: process.env.EMAIL_USER,
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