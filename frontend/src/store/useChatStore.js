import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import {useAuthStore} from './useAuthStore';



export const useChatStore = create((set,get)=>({
    message:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,

    getUsers: async ()=>{
        set({isUsersLoading:true});
        try {
            const res = await axiosInstance.get("/msg/users");
            set({users:res.data});
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isUsersLoading:false});
        }
    },

    getMessages:async (userId)=>{
        set({isMessagesLoading:true});
        try {
            const res = await axiosInstance.get(`/msg/${userId}`);
            set({message:res.data});
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isMessagesLoading:false});
        }
    }, 

    sendMessage:async (messageData)=>{
        const {selectedUser, message} = get()
        // console.log(messageData);
        try {
            const res = await axiosInstance.post(`/msg/send/${selectedUser._id}`,messageData);
            set({message:[...message,res.data]})
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    subscribeToMessage:()=>{
        const {selectedUser} = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage",(newMessage)=>{
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if(!isMessageSentFromSelectedUser) return;

            set({
                message:[...get().message,newMessage],
            })
        })
    },

    unsubscribeFromMessages: () => {
       const socket = useAuthStore.getState().socket;
       socket.off("newMessage");
    },
     
    setSelectedUser : (selectedUser) => set({selectedUser}),
}))

