import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/index.js'
import { Contact } from 'lucide-react';
import React, { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ContactsContainer from './components/contact-container';
import EmptyChatContainer from './components/empty-chat-container';
import ChatContainer from './components/chat-contanier';


function Chat() {
  const { 
    userInfo, 
    selectedChatType,
    isUploading,
    isDownloading,
    fileUploadProgess,
    fileDownLoadProgress

   } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profileSetup) {
      // Redirect to /Profile if profile is not set up
      toast("Please complete your profile setup to continue!");
      navigate("/Profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className='flex h-[100vh] text-white overflow-hidden'>

      {
        isUploading && <div className='h-[100vh] w-[100vw] top-0 fixed left-0 bg-black/50 flex items-center justify-center gap-5 backdrop-blur-lg'>
          <h5 className='text-5xl animate-pulse'>Uploading File</h5>
          {fileUploadProgess}%
        </div>
      }


      
{
        isDownloading && <div className='h-[100vh] w-[100vw] top-0 fixed left-0 bg-black/50 flex items-center justify-center gap-5 backdrop-blur-lg'>
          <h5 className='text-5xl animate-pulse'>Downloading File</h5>
          {fileDownLoadProgress}%
        </div>
      }
      
      
      <ContactsContainer/>
      {
        selectedChatType===undefined ?(
          <EmptyChatContainer/>
        ):(
          <ChatContainer/>
        )
      }
      

    </div>
  )
}

export default Chat
