import Post from "../models/post.model.js"
import uploadOnCloud from "../config/cloudinary.js"
import { io } from "../index.js"
import Notification from "../models/notification.model.js"

export const createPost = async(req,res,newPost)=>{
    try {
        let {description}=req.body
        if(req.file){
            
            let image= await uploadOnCloud(req.file.path)

             newPost =await Post.create({
                auther: req.userId,
                description ,
                image
            })
        }else{
             newPost =await Post.create({
                auther: req.userId,
                description
            })
        }

        return res.status(201).json(newPost)
    } catch (error) {
        console.log(error);
        
    }
}

export const getPost = async (req,res)=>{
    try {
        const post = await Post.find()
        .populate("auther","firstName lastName profileImg headline userName")
        .populate("comment.user","firstName lastName profileImg headline")
        .sort({createdAt:-1})
        return res.status(200).json(post)
    } catch (error) {
        return res.status(500).json({message:"getPost error"})
    }
}

export const like = async(req,res)=>{
    try {
        let postId = req.params.id
        let userId = req.userId
        let post = await Post.findById(postId)
        if(!post){
            return res.status(400).json({message:"Post not found..."})
        }
        
        if(post.like.includes(userId)){
           post.like = post.like.filter((id)=>id!=userId)
        }else{
            post.like.push(userId)
            if(post.auther!=userId){
                let notification=await Notification.create({
                    receiver:post.auther,
                    type:"like",
                    relatedUser:userId,
                    relatedPost:postId
                })
            } 
        }

        await post.save()

        io.emit("likeUpdated",{postId,likes:post.like})
        
        return res.status(200).json(post)

    } catch (error) {
        return res.status(400).json({message:"Like error..."})
    }
}

export const comment = async (req,res)=>{
    try {
        let postId = req.params.id
        let userId = req.userId
        let {content}=req.body

        let post = await Post.findByIdAndUpdate(postId,{
            $push:{comment:{content,user:userId}}
        },{new:true})
        .populate("comment.user","firstName lastName profileImg headline")

        let notification=await Notification.create({
            receiver:post.auther,
            type:"comment",
            relatedUser:userId,
            relatedPost:postId
        })

        io.emit("commentAdded",{postId,comm:post.comment})
        
        return res.status(200).json(post)
    } catch (error) {
        return res.status(400).json({message:"Comment error...",error: error.message})
    }
}