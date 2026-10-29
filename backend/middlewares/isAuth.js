import jwt from "jsonwebtoken"

const isAuth = async(req,res,next)=>{
    try {

        let {token} = req.cookies
        if(!token){
            return res.status(400).json({message:"User doesn't have token"})
        }

        let verifyToken= await jwt.verify(token,process.env.JWT_SECRET)

        if(!verifyToken){
            return res.status(400).json({message:"User doesn't have valid token"})
        }
        req.userId = verifyToken.userId
        next()
    } catch (error) {
        console.log(error);
        
         return res.status(500).json({message:"is Auth error"})
    }
}

// const isAuth = async (req, res, next) => {
//     try {
//         const token = req.cookies?.token;

//         console.log("Token exists:", !!token);

//         if (!token) {
//             return res.status(400).json({
//                 message: "User doesn't have token"
//             });
//         }

//         const verifyToken = jwt.verify(
//             token,
//             process.env.JWT_SECRET
//         );

//         console.log("Verified token:", verifyToken);

//         req.userId = verifyToken.userId;

//         console.log("Authenticated userId:", req.userId);

//         next();

//     } catch (error) {
//         console.log("JWT Error:", error.message);

//         return res.status(401).json({
//             message: "Token verification failed",
//             error: error.message
//         });
//     }
// };

export default isAuth