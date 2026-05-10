# Backend Progress Announcement Ideas (Tailored to this repo)

## 1) **"From OTP to Login: Building Secure Auth with Redis + RabbitMQ"**
**Show in video:**
- `POST /api/v1/login` in `backend/user/src/routes/user.ts` triggering OTP generation.
- Redis-backed OTP + rate limit flow from `backend/user/src/controller/user.ts` (`otp:*` keys, 5-minute OTP, 60-second resend lock).
- RabbitMQ publish in `backend/user/src/config/rabbitmq.ts` and mail consumer in `backend/mail/src/consumer.ts` sending OTP emails.
- `POST /api/v1/verify` returning user + JWT token.

## 2) **"Chat Service Milestone: Real APIs for 1:1 Chats + Inbox Ordering"**
**Show in video:**
- `POST /api/v1/chat/new` and duplicate-chat protection (`$all` + `$size: 2`) in `backend/chat/src/controllers/chat.ts`.
- `GET /api/v1/chat/all` sorted by `updatedAt` with unseen message count per chat.
- Cross-service user enrichment via Axios call to user service (`USER_SERVICE_URL`) and fallback to "Unknown User".

## 3) **"Messages Are Live in Backend: Text, Image Uploads, and Seen Status"**
**Show in video:**
- `POST /api/v1/message` with text and image support via Multer + Cloudinary (`backend/chat/src/middlewares/multer.ts`, `src/config/cloudinary.ts`).
- Message schema fields from `backend/chat/src/models/message.ts` (`messageType`, `image`, `seen`, `seenAt`).
- `GET /api/v1/message/:chatId` flow that marks unread messages as seen for the current user.
- Quick Postman demo: send message from User A, fetch as User B, then re-fetch to show seen updates.
