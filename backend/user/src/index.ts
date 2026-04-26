import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import  {createClient} from "redis";
import userRoutes from "./routes/user.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";
import cors from "cors";

dotenv.config();
const app = express();

connectDB();
connectRabbitMQ();

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
    throw new Error("REDIS_URL is not set");
}


export const redisClient = createClient({
        url: redisUrl,
});

redisClient
.connect()
.then(() => {
    console.log("Connected to Redis");
})
.catch((error) => {
    console.error("Failed to connect to Redis", error);
    process.exit(1);
});

app.use(express.json());
app.use(cors());
app.use("/api/v1",userRoutes)

const port = process.env.PORT ?? "5000";

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});