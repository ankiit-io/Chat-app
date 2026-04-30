import mongoose, { Document } from "mongoose";
export interface IChat extends Document {
    users: string[];
    latestmessage: {
        text: string;
        sender: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IChat, {}, {}, {}, mongoose.Document<unknown, {}, IChat, {}, mongoose.DefaultSchemaOptions> & IChat & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IChat>;
export default _default;
//# sourceMappingURL=chat.d.ts.map