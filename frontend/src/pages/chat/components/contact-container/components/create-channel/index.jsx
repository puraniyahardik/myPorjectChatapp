import React, { useState,useEffect} from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { FaPlus } from 'react-icons/fa'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger, 
  } from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { apiClient } from '@/lib/api-client'
import { CREATE_CHANNEL_ROUTES, GET_ALL_CONTACTS_ROUTES } from '@/utiles/constants'
import { Button } from '@/components/ui/button'
import MultipleSelector from '@/components/ui/multipleselect'
import { useAppStore } from '@/store'
  

const CreateChannel = () => {


    const {addChannel} = useAppStore();
    const [newChannelModel,setNewChannelModel]=useState(false);
    const [allContact, setAllContact] = useState([]);
    const [selectedContact, setSelectedContact] = useState([]);
    const [channelName, setChannelName] = useState("");

    useEffect(()=>{
      const getData = async () =>{ 
        const res = await apiClient.get(
          // GET_ALL_CONTACTS_ROUTES
           "/api/contacts/getallcontacts"
          ,{
          withCredentials:true,
        });
        console.log("data",{res});
        
        setAllContact(res.data.contacts);
      };

      getData();
      },[]);


      

      const createChannel = async () => {
        try {
          if (channelName.length > 0 && selectedContact.length > 0) {
            const response = await apiClient.post(
              "/api/channel/createchannel",
              {
                name: channelName,
                members: selectedContact.map((contact) => contact.value),
              },
              { withCredentials: true }
            );
      
            if (response.status === 201) {
              setChannelName("");
              setSelectedContact([]);
              setNewChannelModel(false);
              addChannel(response.data.channel);
            }
          }
        } catch (error) {
          console.error("Error creating channel:", error.response?.data || error.message);
        }
      };
      
      

   
  return (
    <>
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger>
                <FaPlus className='text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all dur300'
                onClick={()=>setNewChannelModel(true)}
                />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Create New Channel
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
    <Dialog open={newChannelModel} onOpenChange={setNewChannelModel}>
       
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
            <DialogHeader>
            <DialogTitle>
              Please Fill Up detail for new channel model
            </DialogTitle>
            <DialogDescription>
               
            </DialogDescription>
            </DialogHeader>
            <div>
                <Input
                placeholder="Channle name "
                className="rounded-lg p-6 bg-[#2c2e2b] border-none"
                type="text"
                onChange={(e)=>setChannelName(e.target.value)}
                value={channelName}
               />
            </div>


            <div>
              <MultipleSelector
                className="rounded-lg bg-[#2c2e3b] py-2 border-none text-white"
                defaultOptions={allContact} 
                placeholder="Search Contacts"
                value={selectedContact}
                onChange={setSelectedContact}
                emptyIndicator={
                  <p className='text-center text-lg leading-5 text-gray-600'>result found</p>
                }
                />
            </div>


            <div>
              <Button className="w-full bg-purple-800 transition-all duration-300" onClick={createChannel}>
                Create Channel
              </Button>
            </div>
           
             
        </DialogContent>
    </Dialog>

    </>
  )
}

export default CreateChannel
