import jwtToken from 'jsonwebtoken';
import { config } from 'dotenv';
import User from '../models/user.model.js';

config();

const secrectKey = process.env.SECRECT_KEY;

export const jwtMiddleWare = async(req,res,next)=>{
    try {
        const token = req.cookies?.jwtToken;
        if(!token){
            return res.status(400).json("Token not found, Please login again");
        }
        jwtToken.verify(token,secrectKey,async(err,decoded)=>{
            if(err){
                 if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ error: "Token expired, please login again" });
                } else if (err.name === 'JsonWebTokenError') {
                    return res.status(401).json({ error: "Invalid token format" });
                } else {
                    return res.status(401).json({ error: "Token verification failed" });
                }
            }else{
                const user = await User.findById(decoded.id).select("-password");
                if(!user){
                    return res.status(400).json({message:"user not found"});
                }
                req.user = user;
                next();
            }
        })
    } catch (error) {
        console.log("error in jwtMiddleware: ",error);
        res.status(500).json("unauthorized")
    }
}

