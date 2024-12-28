import { useAppStore } from '@/store';
import { HOST } from '@/utiles/constants';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import {MdFolderZip} from 'react-icons/md';
import {IoMdArrowRoundDown} from 'react-icons/io';
import { apiClient } from '@/lib/api-client';
import { IoCloseSharp } from 'react-icons/io5';
import { useState } from 'react';


const MessageContainer = () => {
  const scrollRef = useRef();
  const { selectedChatType, selectedChatData, selectedChatMessages, setisDownloading,setfileDownLoadProgress } = useAppStore();


  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
   
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChatMessages]);



  const handledownLoadFile = async (url) => {
    try {
      setisDownloading(true);
      setfileDownLoadProgress(0);
      // Fetch the file using your API client
      const res = await apiClient.get(`http://localhost:8787/${url}`, {
        responseType: "blob",
        onDownloadProgress:(progressEvent)=>{
          const {loaded,total} = progressEvent;
          const percentComplated = Math.round((loaded * 100)/ total);
          setfileDownLoadProgress(percentComplated); 
        } // Ensures the response is treated as a binary file
      });
  
      // Create a blob URL
      const urlBlob = window.URL.createObjectURL(new Blob([res.data]));
  
      // Create an anchor element for downloading
      const link = document.createElement("a");
      link.href = urlBlob; // Set the href to the blob URL
      link.download = url.split("/").pop(); // Extract and set the file name from the URL
  
      // Append, click, and remove the  link to trigger the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Revoke the blob URL to free memory
      window.URL.revokeObjectURL(urlBlob);
      setisDownloading(false);
      setfileDownLoadProgress(0);

    } catch (error) {
      console.error("File download failed:", error);
    }
  };
  



  const renderMessages = () => {
    let lastDate = null;
 
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format('YYYY-MM-DD');
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={message.id || index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format('LL')}
            </div>
          )}
          {selectedChatType === 'Contact' && renderDMMessage(message)}
        </div>
      );
    });
  };

  const checkIfImage = (filePath) =>{
    const imageRegexWithQuery = /\.(jpg|jpeg|png|gif|bmp|webp|svg)(\?.*)?$/i;
    // const ImageRegex = /\.(jpg|jpeg|gif|bmp|tiff|webp|svg|ico|heic|heif)$/i;
    return imageRegexWithQuery.test(filePath);
  };

  


  const renderDMMessage = (message) => {
    const isSentByContact = message.sender === selectedChatData._id;

    return (
      <div className={`${isSentByContact ? 'text-left' : 'text-right'}`} key={message.id}>
        {message.messageType === 'text' && (
          <div
            className={`${
              isSentByContact
                ? 'bg-[#2a2b33]/5 text-white/80 border-white/20'
                : 'bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50'
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}

        {
          message.messageType === "file" &&   <div
          className={`${
            isSentByContact
              ? 'bg-[#2a2b33]/5 text-white/80 border-white/20'
              : 'bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50'
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
         
          {
            
          checkIfImage(message.fileUrl) ? <div className='cursor-pointer'
          onClick={()=>{
            setImageURL(message.fileUrl);
            setShowImage(true);
          }}
          >
            {/* `http://localhost:8787/${userInfo.image}` */}
            <img src={`http://localhost:8787/${message.fileUrl}`} height={300} alt="sorry" />

          </div> : <div className='flex justify-center items-center gap-4'><span className='text-white/80 text-3xl bg-black/20 rounded-full p-3'>
          <MdFolderZip />
          </span>
          <span>
            {/* Safely handle undefined fileUrl */}
            {/* {message.fileUrl.split('/').pop()} */}
            {message.fileUrl ? message.fileUrl.split('/').pop() : 'Unknown File'}
            </span>
            <span className='bg-black/20 p-3 text-2xl rounded-full cursor-pointer transition-all duration-300'
            onClick={()=>handledownLoadFile(message.fileUrl)}
            >
              <IoMdArrowRoundDown /></span>
          </div>
           }
        </div>
        }
        <div className="text-xs text-gray-600">
          {moment(message.timestamp).format('LT')}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} />

      {
        showImage && <div className='fixed z-[1000] top-0 left-0 w-[100vw] h-[100vh] flex justify-center items-center backdrop-blur-lg flex-col'>
          <div>
          <img src={`http://localhost:8787/${imageURL}`} className='h-[80vh] w-full bg-cover' alt="sorry" />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button className='bg-black/20 p-3 text-2xl hover:bg-black/50 cursor-pointer transition-all duration-300' onClick={()=> handledownLoadFile(imageURL)}>
            <IoMdArrowRoundDown />
            </button>

            <button className='bg-black/20 p-3 text-2xl hover:bg-black/50 cursor-pointer transition-all duration-300' onClick={
              ()=>{
                setShowImage(false);
                setImageURL(null);
              }
            }>
            <IoCloseSharp />
            </button>
          </div>
        </div>
      }
    </div>
  );
};

export default MessageContainer;
