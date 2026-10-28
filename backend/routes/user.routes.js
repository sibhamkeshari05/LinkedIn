import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { getCurrentUSer, getProfile, getSuggestedUsers, search, updateProfile } from "../controller/user.controllers.js"
import upload from "../middlewares/multer.js"

let userRouter = express.Router()

userRouter.get("/currentuser",isAuth,getCurrentUSer)
userRouter.put("/updateprofile",isAuth,upload.fields([
    {name:"profileImg",maxCount:1},
    {name:"coverImg",maxCount:1}
]),updateProfile)
userRouter.get("/profile/:userName",isAuth,getProfile)
userRouter.get("/search",isAuth,search)
userRouter.get("/suggestedusers",isAuth,getSuggestedUsers)

export default userRouter