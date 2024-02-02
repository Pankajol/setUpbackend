import mongoose,{Schema} from "mongoose"

const subscriptionSchema = new Schema({
    subscriber: {
        type:Schema.Types.ObjectId,//one who is subscribing
        ref:"User"
    },
    channel: {
        type:Schema.Types.ObjectId,//one whom is 'subsciber' is subscribing
        ref:"User"
    }
},{timestamps: true})

export const Subsciption = mongoose.model("Subsciption",subscriptionSchema)