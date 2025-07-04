import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import {ChatHeader} from '../components/ChatHeader';
import MessageSkeleton from './skeleton/MessageSkeleton';
import MessageInput from './MessageInput';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utlis';

const ChatContainer = () => {

  const {message, getMessages, isMessagesLoading, selectedUser,subscribeToMessage,unsubscribeFromMessages} = useChatStore();

  const {authUser} = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(()=>{
    getMessages(selectedUser._id);

    subscribeToMessage();

    return () => unsubscribeFromMessages();

  },[selectedUser._id, getMessages, subscribeToMessage,unsubscribeFromMessages]);

   useEffect(() => {
    if (messageEndRef.current && message) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);



  if(isMessagesLoading){
    return (
     <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />
      <MessageSkeleton />
      <MessageInput />
     </div>
  )};

return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />

    <div className='flex-1 overflow-y-auto p-4 space-y-4'>
      {message.map((message)=>(
        <div 
        key={message._id}
        className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
        ref={messageEndRef}
        >
          <div className='chat-image avatar'>
            <div className='size-10 rounded-full border'>
              <img 
              src={message.senderId === authUser._id ? authUser.profilePic : selectedUser.profilePic} 
              alt="profile Pic" 
              />
            </div>
          </div>
          <div className='chat-header mb-1'>
            <time className='text-xs opacity-50 ml-1'>
              {formatMessageTime(message.createdAt)}
            </time>
          </div>
          <div className='chat-bubble flex flex-col'>
            {message.image && (
              <img 
              src={message.image}
              alt='Attachment'
              className='sm:max-w-[200px] rounded-md mb-2'
              />
            )}
            {message.text && <p>{message.text}</p>}
          </div>
        </div>
      ))}
    </div>

    <MessageInput />
    </div>
  )
}

export default ChatContainer