import React, { useRef, useState, useEffect } from "react";
import { GrAttachment } from "react-icons/gr"; // Attachment Icon
import { RiEmojiStickerLine } from "react-icons/ri"; // Emoji Picker Icon
import { IoSend } from "react-icons/io5"; // Send Icon
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from "@/store";
import { useSocket } from "@/context/SocketContext";
import { Content } from "@radix-ui/react-dialog";
import { apiClient } from "@/lib/api-client";
import { UPLOAD_FILE_ROUTES } from "@/utiles/constants";

const MessageBar = () => {
  const emojiRef = useRef(null); // Ref for emoji picker

  //for file upload ref
  const InputFileRef = useRef();

  const [message, setMessage] = useState(""); // State for input message
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false); // State for toggling emoji picker
  const {selectedChatType,selectedChatData,userInfo,selectedChatMessages ,setSelectedChatMessages, setIsUploading,setfileUploadProgess} = useAppStore()
  const socket =useSocket()

  useEffect(()=>{
    const getMessage=async()=>{
      try {
        const respones=await apiClient.post('/api/getMessages/ContactChat',
          {id:selectedChatData._id},
          {withCredentials:true}
        );
      
        for (const i in respones.data.respones) {
         
          if(respones.data.respones[i]._id)
            {
              setSelectedChatMessages(respones.data.respones);
            }
        }
        
      } catch (error) {
        console.log(error);
      }
    }

    if(selectedChatData._id)
    {
      if(selectedChatType==="Contact")
      {
        getMessage();
      }
    }else{
      console.log("No User ID");
    }


  },[selectedChatData,selectedChatType,setSelectedChatMessages])

useEffect(() => {
  const handleClickOutside = (event) => {
    if (emojiRef.current && !emojiRef.current.contains(event.target)) {
      setEmojiPickerOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

const handleSendMessage = async () => {
  if (message.trim() === "") {
    console.log("Cannot send empty message!");
    return;
  }
  console.log({selectedChatMessages})
  console.log("Message Sent:", message);
  setMessage(""); 
  let recipientId=selectedChatData._id;
  console.log(recipientId);
  if (selectedChatType === "Contact") {
    socket.emit("sendMessage", {
      sender: userInfo.id,
      content: message,
      recipient: recipientId,
      messageType: "text",
      fileUrl: undefined, 
    }, (error) => {
      if (!error) {
        setMessage(""); 
      } else {
        console.error("Failed to send message:", error);
      }
    });
  }
};


const handleAttachmentClick = () =>{
  if (InputFileRef.current) {
    InputFileRef.current.click();
  }
};

const handleAttachmentChange = async ()=>{
  try {
    const file = event.target.files[0];
    // console.log({file});

    if (file) {
      const formDate = new FormData();
      formDate.append('file',file);
      setIsUploading(true);
      const res = await apiClient.post(
        // UPLOAD_FILE_ROUTES,
        "/api/getMessages/uploadfile",
        formDate,{
        withCredentials:true,
        onUploadProgress:data=>{
          setfileUploadProgess(Math.round((100 * data.loaded)/data.total))
        }
      });

      if (res.status === 200 && res.data) {
        setIsUploading(false); 
        if(selectedChatType === "Contact"){
        socket.emit("sendMessage", {
          sender: userInfo.id,
          content: undefined,
          recipient: selectedChatData._id,
          messageType: "file",
          fileUrl: res.data.filePath, 
        });
      }
        
      }

      
    }else{
      console.log('file was not ');
      
    }
    console.log({file});
    
    
  } catch (error) {
    setIsUploading(false);
    console.log({error});
    
    
  }
};









  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      {/* Input Section */}
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        {/* Attachment Icon */}
        <button
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-2xl" />
          </button>
        <input type="file"
        className="hidden"
        ref={InputFileRef}
        onChange={handleAttachmentChange} />
        

        
         {/* Emoji Picker Section */}
      <div className="relative">
        <button
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
        >
          <RiEmojiStickerLine className="text-2xl" />
        </button>
        {emojiPickerOpen && (
          <div
            ref={emojiRef}
            className="absolute bottom-16 right-0 bg-[#2a2b33] p-3 rounded-lg shadow-lg"
          >
            <p className="text-white text-sm">
            {emojiPickerOpen && (
                    <div ref={emojiRef} className="absolute bottom-16 right-0 bg-[#2a2b33] p-3 rounded-lg shadow-lg">
                        <EmojiPicker theme="dark" onEmojiClick={(emoji) => setMessage((prev) => prev + emoji.emoji)} />
                    </div>
                    )}
            </p>
          </div>
        )}
      </div>
      </div>

     

      {/* Send Button */}
      <button
        className="bg-[#8411ff] rounded-md flex items-center justify-center p-5 focus:border-none hover:bg-[#741bda] focus:bg-[#741bda] focus:outline-none focus:text-white duration-300 transition-all"
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;



