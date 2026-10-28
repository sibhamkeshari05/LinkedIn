import express from "express"
import { logIn, logOut, signUp } from "../controller/auth.controller.js"

let authRouter = express.Router()

authRouter.post("/signup",signUp)
authRouter.post("/login",logIn)
authRouter.get("/logout",logOut)

export default authRouter