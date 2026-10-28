import Notification from "../models/notification.model.js"

export const getNotification=async(req,res)=>{
    try {

        let notification = await Notification.find({receiver:req.userId})
        .populate("relatedUser","firstName lastName profileImg")
        .populate("relatedPost","image description")

        return res.status(200).json(notification)

    } catch (error) {
        return res.status(500).json({message:`get notification error ${error}`})
    }
}

export const deleteNotification=async(req,res)=>{
    try {

        let {id}=req.params
        let notification = await Notification.findByIdAndDelete({
            _id:id,
            receiver:req.userId
        })

        return res.status(200).json({message:"notifcation deleted succesfully"})

    } catch (error) {
        return res.status(500).json({message:`delete notification error ${error}`})
    }
}

export const deleteAllNotification=async(req,res)=>{
    try {

        let notification = await Notification.deleteMany({
            receiver:req.userId
        })

        return res.status(200).json({message:"All notifcation deleted succesfully"})

    } catch (error) {
        return res.status(500).json({message:`delete all notification error ${error}`})
    }
}