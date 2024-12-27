import Message from "../models/messagesModel.js";
import {mkdirSync, renameSync} from 'fs'
import path from "path";

export const getAllUserContactChats=async(req,res,next)=>{
   try {
    const User1=req.userId;//your user id
    const User2=req.body.id;//other user id that pass through frontend api call

    if(!User1 || !User2)
    {
        return res.status(400).send("Both User Id Is Required");
    }
    
    const respones=await Message.find({
        $or:[
            {sender:User1,recipient:User2},
            {sender:User2,recipient:User1},
        ],
    }).sort({timestamp:1});

    return res.status(200).json({respones});
   } catch (error) {
    return res.status(500).send("Internal Server Error",error);
   }
   
}

export const uploadFiles=async(req,res,next)=>{
    try {
    

        if (!req.file) {
            return res.status(400).send("file is required");
        }
        const date = Date.now();
        //the misteck was including / from upload path
        const filedir = `uploads/files/${date}`;
        const fileName = `${filedir}/${req.file.originalname}`;
        console.log({fileName});

        mkdirSync(filedir,{recursive:true});
        renameSync(req.file.path,fileName);
 
     return res.status(200).json({filePath:fileName});
     
    } catch (error) {
     return res.status(500).send("Internal Server Error",error);
    }
    
 }







