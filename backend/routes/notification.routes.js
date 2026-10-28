import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { deleteAllNotification, deleteNotification, getNotification } from "../controller/notification.controller.js";

let notificationRouter= express.Router()

notificationRouter.get("/get",isAuth,getNotification)
notificationRouter.delete("/deleteone/:id",isAuth,deleteNotification)
notificationRouter.delete("/",isAuth,deleteAllNotification)

export default notificationRouter