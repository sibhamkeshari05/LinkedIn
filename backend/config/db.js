import mongoose from "mongoose" 

const ConnectDB= async ()=>{
    try {
        mongoose.connect(process.env.MONGODB_URL)
        console.log("DB Connected");
        
    } catch (error) {
        console.log("DB Connection Error");
    }
}

export default ConnectDB