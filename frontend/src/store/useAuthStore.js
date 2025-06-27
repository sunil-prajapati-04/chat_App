import { create } from 'zustand';
import {axiosInstance} from '../lib/axios';
import toast from 'react-hot-toast';
import { LogOut } from 'lucide-react';
import axios from 'axios';
import {io} from 'socket.io-client';

const Base_Url =  import.meta.env.MODE === "development" ? "http://localhost:8080/chat" : "/" 

export const useAuthStore = create((set,get)=>({
    authUser:null,
    isSigningUpIn:false,
    isLoggingIn:false,
    isUpdateProfile:false,
    isCheckingAuth : true,
    onlineUser : [],
    socket:null,

    checkAuth:async ()=>{
        try {
            const res = await axiosInstance.get("/auth/myProfile");
            set({authUser:res.data});
        } catch (error) {
            console.log("error in checkAuth: ",error);
            
            set({authUser:null});
        }finally{
            set({isCheckingAuth:false})
        }
    },

    signup: async (data,navigate)=>{
        set({isSigningUpIn :true});
        // console.log(data);
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            // console.log("ye aa raha hain",res.data);
            toast.success("Account Created Successfully");

            navigate("/Login");
        } catch (error) {
            toast.error(error.response.data.message);
            
        }finally{
            set({isSigningUpIn:false});
        }
    },

    login: async(data)=>{
        set({isLoggingIn:true});
        try {
            const res = await axiosInstance.post("auth/login", data);
            set({authUser:res.data});
            toast.success("Logged In Successfully");
            
        } catch (error) {
            // console.log("error:",error.response.data); //used for error solving
            toast.error(error.response.data.message);
        }finally{
            set({isLoggingIn:false});
        }
    },

    logout:async()=>{
        try {
            const res = await axiosInstance.post("auth/logout");
            set({authUser:null})
            toast.success("Logged Out successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile:async(data)=>{
        set({isUpdatingProfile : true});
        try {
            const res = await axiosInstance.put("/auth/update-profile",data);
            set({authUser:res.data});
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("error in update Profile:",error);
            toast.error(error.response.data.message);
        }finally{
            set({isUpdatingProfile:false});
        }
    },

    connectSocket:()=>{
        const {authUser} =get();
        if(!authUser || get().socket?.connected) return;

        const socket = io(Base_Url,{
            query:{
                userId:authUser._id
            }
        });

        socket.connect();
        set({socket:socket });

        socket.on("getOnlineUser",(userIds)=>{
            set({onlineUser:userIds});
        });
         
    },
    disconnectSocket: () => {
      const socket = get().socket;
      if (socket?.connected) {
       socket.removeAllListeners();
       socket.disconnect();
       }
     set({ socket: null, onlineUser: [] });
    }
    

}));