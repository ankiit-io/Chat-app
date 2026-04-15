import { publishToQueue } from "../config/rabbitmq.js";
import tryCatch from "../config/tryCatch.js";
import { redisClient } from "../index.js";

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
