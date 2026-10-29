import uploadOnCloud from "../config/cloudinary.js"
import User from "../models/user.model.js"

export const getCurrentUSer = async(req,res)=>{
    try {
        let id = req.userId
        const user= await User.findById(id).select("-password")
        
        if(!user){
            return res.status(400).json({message:"User does not found"})
        }
         return res.status(200).json(user)

    } catch (error) {
        console.log(error);
        return res.status(400).json({message:"Get current user error"})
    }
}

export const updateProfile = async (req,res)=>{
    try {
        let {firstName,lastName,userName,headline,location,gender}=req.body
        let skills= req.body.skills?JSON.parse(req.body.skills):[]
        let education= req.body.education?JSON.parse(req.body.education):[]
        let experience= req.body.experience?JSON.parse(req.body.experience):[]

        let profileImg
        let coverImg
        
        
        if(req.files.profileImg){
            profileImg= await uploadOnCloud(req.files.profileImg[0].path)
        }
         if(req.files.coverImg){
            coverImg= await uploadOnCloud(req.files.coverImg[0].path)
        }
        

        let user = await User.findByIdAndUpdate(req.userId,{
            firstName,
            lastName,
            userName,
            headline,
            location,
            gender,
            skills,
            education,
            experience,
            profileImg,
            coverImg

        },{new:true}).select("-password")

        return res.status(200).json(user)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"update prfile error..."})
        
    }
}

export const getProfile = async(req,res)=>{
    try {
        let {userName}= req.params
        let user = await User.findOne({userName}).select("-password")

        if(!user){
            return res.status(400).json({message:"Username does not exist..."})
        }

        return res.status(200).json(user)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"get prfile error..."})
    } 
}

export const search=async(req,res)=>{
    try {
        let {query}=req.query
        if(!query){
            return res.status(400).json({message:"Query is Required.."})
        }

        let users = await User.find({
            $or:[
                {firstName:{$regex:query,$options:"i"}},
                {lastName:{$regex:query,$options:"i"}},
                {userName:{$regex:query,$options:"i"}},
                {skills:{$in:[query]}}
            ]
        })

        return res.status(200).json(users)
    } catch (error) {
         console.log(error);
        return res.status(500).json({message:"search error..."})
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
        // 1. Fetch current user to get their connections
        const currentUser = await User.findById(req.userId).select("connection");
        
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2. Extract the IDs array safely (default to empty array if undefined)
        const userConnections = currentUser.connection || [];

        // 3. Query using primitive IDs ($ne expects an ID, $nin expects an array of IDs)
        let suggestedUsers = await User.find({
            _id: { 
                $ne: req.userId,                  // Exclude current user's ID
                $nin: [...userConnections, req.userId] // Exclude connections + self
            }
        }).select("-password");

        return res.status(200).json(suggestedUsers);
    } catch (error) {
        console.error("Suggested user error:", error); // Log the actual error for debugging
        return res.status(500).json({ message: "suggested user error..." });
    }
}
