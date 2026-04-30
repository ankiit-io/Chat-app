import mongoose, { Document, Schema } from "mongoose";
const schema = new Schema({
    users: [{ type: String, required: true }],
    latestmessage: {
        text: { type: String },
        sender: { type: String }
    }
}, {
    timestamps: true
});
export default mongoose.model("Chat", schema);
//# sourceMappingURL=chat.js.map