import express from "express";
import { getAllUserContactChats, uploadFiles } from "../controller/getMessageController.js";
import { verifyToken } from "../middlewares/userAuth.js";
import multer from 'multer';

const getMessageAll=express.Router();


const upload = multer({dest:"uploads/files"});

getMessageAll.post('/ContactChat',verifyToken,getAllUserContactChats)
getMessageAll.post("/uploadfile",
    verifyToken,
    upload.single('file'),
    uploadFiles)

export default getMessageAll;