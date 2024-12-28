import mongoose from "mongoose";
import Channel from "../models/ChannelModel.js";
import USER from "../models/userModel.js";



export const createChannel = async (req, res, next) => {
  try {
    
    const { name, members } = req.body;
    const userId = req.userId;
    // console.log("User ID from token:", userId);
    
    if (!name || !members || members.length === 0) {
      return res.status(400).send("Invalid request payload.");
    }
    // console.log("Payload received:", { name, members });
    
    const admin = await USER.findById(userId);
    // console.log("Admin found:", admin);
    if (!admin) {
      return res.status(400).send("Admin was not found.");
    }
    
    const validMembers = await USER.find({ _id: { $in: members } });
    // console.log("Valid members:", validMembers);
    if (validMembers.length !== members.length) {
      return res.status(400).send("Some members are invalid.");
    }
    
    const newChannel = new Channel({
      name,
      members,
      admin: userId,
    });
    
    await newChannel.save();
    return res.status(201).json({ channel: newChannel });



    
  } catch (err) {
    console.error("Error in createChannel:", err);
    return res.status(500).send("Internal Server Error");
  }
};





export const getUserChannel = async (req, res, next) => {
    try {
      const userId= new mongoose.Types.ObjectId(req.userId);
      
      const channels = await Channel.find({
        $or:[
        {
            admin:userId
        },
        {
            members:userId
        }]
      }).sort({updateAt:-1});

      return res.status(201).json({ channels });
  
     
    } catch (err) {
      console.error("Error in createChannel:", err);
      return res.status(500).send("Internal Server Error");
    }
  };
  
