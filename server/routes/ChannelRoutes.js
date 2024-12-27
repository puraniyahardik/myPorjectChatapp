import {Router} from "express";
import {verifyToken} from"../middlewares/userAuth.js"
import { createChannel, getUserChannel } from "../controller/ChannelController.js";

const channelRouter = Router();

channelRouter.post("/createchannel",verifyToken,createChannel);
channelRouter.get("/getuserchannels",verifyToken,getUserChannel);


export default channelRouter;
