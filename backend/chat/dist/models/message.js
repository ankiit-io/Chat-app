import mongoose, { Document, Schema, Types } from "mongoose";
const schema = new Schema({
    chatId: {
        type: Schema.Types.ObjectId,
        ref: "Chat",
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: { type: String },
    image: {
        url: { type: String },
        publicId: { type: String },
    },
    messageType: {
        type: String,
        enum: ["text", "image"],
        default: "text",
        required: true
    },
    seen: {
        type: Boolean,
        default: false
    },
    seenAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true
});
export const Messages = mongoose.model("Message", schema);
//# sourceMappingURL=message.js.map