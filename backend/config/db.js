// import mongoose from "mongoose" 

// const ConnectDB= async ()=>{
//     try {
//         await mongoose.connect(process.env.MONGODB_URL)
//         console.log("DB Connected");
        
//     } catch (error) {
//         console.log("DB Connection Error");
//     }
// }

// export default ConnectDB

import mongoose from "mongoose";

const ConnectDB = async () => {
try {
await mongoose.connect(process.env.MONGODB_URL);


    console.log("DB Connected Successfully");

} catch (error) {
    console.log("DB Connection Error:", error.message);
    process.exit(1);
}


};

export default ConnectDB;
