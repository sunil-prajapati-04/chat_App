import User from '../models/user.model.js';
import {genToken} from '../lib/utlis.js';
import cloudinary from '../lib/cloudinary.js';

export const signup = async(req,res)=>{
    try {
        const userData = req.body;
        const userPassword = userData.password;
        const userEmail = userData.email;
        const user = await User.findOne({email:userEmail});
        if(!userEmail || !userPassword || !userData.fullName){
             return res.status(400).json({message:"All fields are required"});
        }
        if(user){
            return res.status(400).json({message:"Email already Exists"});
        }
        if(userPassword.length<6){
            return res.status(400).json({message:"Password must be at least 6 characters"});
        }
        
        const newUser = new User(userData);
        const respon = await newUser.save();
        console.log(respon);
        res.status(200).json({message:"Registered Sucessfully",respon});
    } catch (error) {
        console.log("error in signup controller:", error);
        res.status(500).json({message:"internal server error"})
    }
}

export const login = async(req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user || !(await user.comparePassword(password))){
            return res.status(400).json({message:"invalid password or email"});
        }
        const payload = {
            id:user.id,
            username:user.fullName
        }
        const token = await genToken(payload);
        res.cookie('jwtToken',token,{
            maxAge:7 * 24 * 60 * 60 * 1000,
            httpOnly:true,
            sameSite:"strict",
            secure:false
        })
        console.log("token is :", token);
        
        res.status(200).json(user)
    } catch (error) {
        console.log("error in login controller:", error);
         res.status(500).json({message:"internal server error"})
    }
}

export const logout = async(req,res)=>{
    try {
        res.clearCookie('jwtToken',{
             httpOnly: true,
            secure: true,
            sameSite: "strict"
        })
         res.status(200).json({message:"Logout successfully"})
    } catch (error) {
        console.log("error in logout controller:", error);
        res.status(500).json({message:"internal server error"})
    }
}

export const updateProfile = async (req,res)=>{
    try {
        const {profilePic} = req.body;
        const userId = req.user.id;
        
        if(!profilePic){
            return res.status(404).json({message:"Profile Pic is required"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url},{new:true})

        res.status(200).json({message:"profile updated sucessfully",updatedUser});
    } catch (error) {
        console.log("error in updateProfile controller:", error);
        res.status(500).json({message:"internal server error"})
    }
}

export const myProfile = (req,res)=>{
    try {
        const user = req.user;
        res.status(200).json(user);
    } catch (error) {
        console.log("error in myProfile controller:", error);
        res.status(500).json({message:"internal server error"})
    }
}


