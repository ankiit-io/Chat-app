import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

let channel : amqp.Channel;

export const connectRabbitMQ = async () => {
    try {
        
        const connection = await amqp.connect({
            protocol: "amqp",
            hostname: process.env.RABBITMQ_HOST,
            port: 5672,
            username: process.env.RABBITMQ_USER,
            password: process.env.RABBITMQ_PASS,
    });
        channel = await connection.createChannel();
        console.log("🐇 Connected to RabbitMQ");
    

    } catch (error) {
        console.error("Failed to connect to RabbitMQ", error);
        process.exit(1);
    }
}

export const publishToQueue = async (queueName: string, message: any) => {
    if (!channel) {
        console.error("RabbitMQ channel is not initialized");
        return;
    }
    try {
        await channel.assertQueue(queueName, { durable: true });
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
            persistent: true,
        });
        console.log(`Message published to queue ${queueName}`);    
    } catch (error) {
        console.error("Failed to publish message to RabbitMQ", error);
    }
    }