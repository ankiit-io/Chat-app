import mongoose , {Document,Schema} from "mongoose";


export interface IChat extends Document {
 
    users: string[];
    latestmessage:{
        text:string;
        sender:string;
    }

    createdAt: Date;
    updatedAt: Date;
    
}

const schema = new Schema<IChat>({
    users:[{type:String,required:true}],
    latestmessage:{
        text:{type:String},
        sender:{type:String}    
    }
},{
    timestamps:true
})

export default mongoose.model<IChat>("Chat",schema);