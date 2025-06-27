import User       from '../models/user.model.js';
import Message    from '../models/message.model.js';
import cloudinary from '../lib/cloudinary.js';

import { getReceiverSocketId,io } from '../lib/socket.js';

export  const getUserForSidebar = async(req,res)=>{
    try {
        const loggedInUser = req.user.id;
        const filteredUsers  = await User.find({_id: {$ne:loggedInUser} }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("error in getUserForSidebar controller:", error);
        res.status(500).json("internal server error")
    }
}

export  const getMessages = async (req,res)=>{
    try {
        const {id:userToChatId} = req.params;
        const myId = req.user.id;

        const messages = await Message.find({
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ]
        })
        res.status(200).json(messages);
    } catch (error) {
        console.log("error in getMessages controller:", error);
        res.status(500).json("internal server error")
    }
}

export  const sendMessage = async (req,res)=>{
    try {
        const {text,image} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user.id;
        
        let imageUrl;
        if(image){
            // Upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        // console.log("ImageUrl:",imageUrl); 
        

        const newMessages = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
        });
        await newMessages.save();

        //todo: realtime functionality goes here ==> socket.io
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessages);
        }
        
        res.status(200).json(newMessages)
    } catch (error) {
        console.log("error in sendMessage controller:", error);
        res.status(500).json("internal server error")
    }
}

