import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({
    subscriber:{
        type:Schema.Types.ObjectId,//user who is subcribing
        ref:"User"
    },
    channel:{
        type:Schema.Types.ObjectId,//whom subscriber
        ref:"User"

    }
},{timestamps:true})

export const Subsription = mongoose.model("Subscription",subscriptionSchema)

