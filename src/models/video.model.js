import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFile:{
            type:string,//cloudinary url
            required:true,
        },
        thumbnail:{
            typr:string,
            required:true,
        },
        title:{
            typr:string,
            required:true,
        },
        description:{
            typr:string,
            required:true,
        },
        time:{
            typr:Number, // cloudinary
            required:true,
        },
        views:{
            typr:Number,
            default :0,
           
        },
        isPublished:{
            typr: Boolean,
            default:true
        },
        owner:{
            type:Schema.Type.ObjectId,
            ref:"User"
        }

    },
    {
        timestamps:true
    }
    )

videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video",videoSchema)