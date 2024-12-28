

import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAppStore } from "@/store/index.js";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
        // const {selectedChatData} = useAppStore().getState();
        // const {} = useAppStore().getState();
  const { userInfo,selectedChatData,selectedChatType,addMessage} = useAppStore();
  
  useEffect(() => {
    if (userInfo) {
      socket.current = io("http://localhost:3000", {
        withCredentials: true,
        query: { userId: userInfo.id },
      });
      socket.current.on("connect",()=>{
        console.log("Connected to server");
      })

      const HandledRecieveMessage=(messageData)=>{
        // const {selectedChatData} = useAppStore().getState();
        // if (!selectedChatData?.contact) return; // Avoid errors if contact data is undefined
        console.log({messageData})
        addMessage(messageData);
        
      }
      
  
      socket.current.on("recievedMessage", HandledRecieveMessage);
        // const { } = useAppStore().getState();
       
      
  
      return () => {
        socket.current?.off("receiveMessage", HandledRecieveMessage); // Remove the listener
        socket.current?.disconnect(); // Close socket connection
      };
    }
  }, [userInfo]);
  

  return <SocketContext.Provider value={socket.current}>{children}</SocketContext.Provider>;
};
