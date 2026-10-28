import express from "express";
import isAuth from "../middlewares/isAuth.js"
import upload from "../middlewares/multer.js"
import { comment, createPost, getPost, like } from "../controller/post.controller.js";

const postRouter=express.Router()

postRouter.post("/create",isAuth,upload.single("image"),createPost)
postRouter.get("/getPost",isAuth,getPost)
postRouter.get("/like/:id",isAuth,like)
postRouter.post("/comment/:id",isAuth,comment)

export default postRouter