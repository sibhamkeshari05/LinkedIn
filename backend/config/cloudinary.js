import { v2 as cloud } from 'cloudinary';
import fs from "fs"
import dotenv from "dotenv"
dotenv.config()

    cloud.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
    
    const uploadOnCloud = async (Path)=>{
        try {
        if(!Path){
            return null 
        }
        const uploadResult = await cloud.uploader.upload(Path,{
            resource_type:"image"
        })
        
        fs.unlinkSync(Path)
        return uploadResult.secure_url   

        }catch (error) {
        if (Path && fs.existsSync(Path)) {
            fs.unlinkSync(Path);
        }

        return null;
        }
    }
export default uploadOnCloud
