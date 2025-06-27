import {Server} from 'socket.io';
import http from 'http';
import express from 'express';


export const app = express();

export const server = http.createServer(app);

export const io = new Server(server,{
    cors:{
        origin:["http://localhost:5173"]
    }
});

export const getReceiverSocketId = (userId)=>{
    return userSocketMap[userId]
}

const userSocketMap = {}; //{userId:socketId}

io.on("connection",(socket)=>{
    console.log("A new user connected",socket.id);
    
    const userId = socket.handshake.query.userId;
    // console.log(userId);
    
    if(userId)  userSocketMap[userId] = socket.id;
    // console.log(userSocketMap);
    
    io.emit("getOnlineUser",Object.keys(userSocketMap));

    socket.on("disconnect",()=>{
        console.log("A user disconnected",socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUser", Object.keys(userSocketMap));
    });
});

