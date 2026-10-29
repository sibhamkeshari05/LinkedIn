import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signUp = async (req,res)=>{
    try {
        let {firstName,lastName,userName,email,password}= req.body

        let existEmail = await User.findOne({email})
        if(existEmail){
            res.status(400).json({message:"email already exist !"})
        }

        let existUsername = await User.findOne({userName})
        if(existUsername){
            res.status(400).json({message:"Username already exist !"})
        }

        if (password.length<8) {
            res.status(400).json({message:"Password must contain 8 characters"})   
        }

        let hassedPassword = await bcrypt.hash(password,10)
        const user = await User.create({
            firstName,
            lastName,
            userName,
            email,
            password : hassedPassword
        })

        let token = await genToken(user._id)
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:7*24*60*60*1000,
            sameSite:"none",
            secure:true
        })

        console.log("User Created...");
        return res.status(201).json(user)

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Signup error"})
    }
}


export const logIn = async (req,res)=>{
    try {
        let {email,password} = req.body

        let notUser = await User.findOne({email})
        if(!notUser){
            res.status(400).json({message:"User Not Found...!"})
        }

        const isMatch = await bcrypt.compare(password,notUser.password)
        if (!isMatch) {
            res.status(400).json({message:"Wrong Password"})
        }
        
        let token = await genToken(notUser._id)
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:7*24*60*60*1000,
            sameSite:"none",
            secure:true
            path:"/"
        })

        console.log("User login...");
        return res.status(200).json(notUser)
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Login error"})
    }
}


export const logOut = async (req,res)=>{
    try {
        res.clearCookie("token")
        return res.status(200).json({message:"Logout Successful..."})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Logout error"})
    }
}
