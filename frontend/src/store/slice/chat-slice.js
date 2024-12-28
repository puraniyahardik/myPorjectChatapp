
export const createChatSlice = (set, get) => ({

  //getter 
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [], 
    directMessageContacts:[],
    isUploading:false,
    isDownloading:false,
    fileUploadProgess:0,
    fileDownLoadProgress:0,
    channels:[],
 
    



    //setter
    setChannels:(channels)=> set({channels}),
    setIsUploading:(isUploading) => set({isUploading}),
    setisDownloading:(isDownloading) => set({isDownloading}),
    setfileUploadProgess:(fileUploadProgess) => set({fileUploadProgess}),
    setfileDownLoadProgress:(fileDownLoadProgress) => set({fileDownLoadProgress}),

    
    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
    setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),
    setDirectMessageContacts:(directMessageContacts)=>set({directMessageContacts}),

    closeChat: () => set({
      selectedChatType: undefined,
      selectedChatData: undefined,
      selectedChatMessages: [],
    }),

    addChannel:(channel)=>{
      const channels = get().channels;
      set({channels:[channel,...channels]});
    },
  
    addMessage: (message) => {
      const selectedChatMessages = get().selectedChatMessages;
      set({ 
        selectedChatMessages: [...selectedChatMessages, { 
          ...message, 
          recipient: message.recipient._id,
          sender: message.sender._id
        }]
      });
    },
  });
  