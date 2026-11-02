import mongoose, { Schema } from "mongoose"

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

const postSchema = new mongoose.Schema({
    auther:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    description:{
        type:String,
        default:""
    },
    image:{
        type:String
    },
    like:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
    ],
    comment:[commentSchema]
},{timestamps:true})

const Post = mongoose.model("Post",postSchema)

export default Post