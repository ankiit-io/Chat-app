# Backend overview

The backend is split into three Node/TypeScript services:

## 1. User service
- **Entry point:** `backend/user/src/index.ts`
- **Purpose:** starts the Express server, connects MongoDB, RabbitMQ, and Redis, and mounts the user API under `/api/v1`.
- **Routing:** `backend/user/src/routes/user.ts`
- **Authentication logic:** `backend/user/src/middleware/isAuth.ts`
- **User/auth controller logic:** `backend/user/src/controller/user.ts`

This service handles OTP-based login, OTP verification, profile lookup, name updates, and listing users.

## 2. Chat service
- **Entry point:** `backend/chat/src/index.ts`
- **Purpose:** starts the Express server, connects MongoDB, and mounts chat/message routes under `/api/v1`.
- **Routing:** `backend/chat/src/routes/chat.ts`
- **Authentication logic:** `backend/chat/src/middlewares/isAuth.ts`
- **Messaging and chat controller logic:** `backend/chat/src/controllers/chat.ts`
- **Data models:** `backend/chat/src/models/chat.ts` and `backend/chat/src/models/message.ts`

This service handles creating chats, listing chats, sending messages (including image uploads), and fetching messages for a chat.

## 3. Mail service
- **Entry point:** `backend/mail/src/index.ts`
- **Purpose:** starts the mail worker process and begins consuming OTP email jobs.
- **Queue consumer:** `backend/mail/src/consumer.ts`

This service is not the main API server; it supports authentication by sending OTP emails from RabbitMQ jobs published by the user service.
