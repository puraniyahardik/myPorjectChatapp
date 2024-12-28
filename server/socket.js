



import { Server as SocketIOServer } from "socket.io";
import Message from "./models/messagesModel.js";

const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log(`Client Disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendMessage = async (message) => {
    try {
      const createMessage = await Message.create(message);
      const messageData = await Message.findById(createMessage._id)
        .populate("sender", "id Email firstName lastName image color")
        .populate("recipient", "id Email firstName lastName image color");
        // console.log(message.sender)
        // console.log(message.)
      const senderSocketId = userSocketMap.get(message.sender);
      const recipientSocketId = userSocketMap.get(message.recipient);

      console.log("Sender:",senderSocketId)
      console.log("recipient:",recipientSocketId);
      console.log("text:",messageData);

      if (recipientSocketId)
      {
        io.to(recipientSocketId).emit("recievedMessage", messageData);
        console.log("data Send SuccessFully");
      }
      else
      {
        console.log("data Is Not Send SuccSfully");
      }
      if (senderSocketId){ 
        io.to(senderSocketId).emit("recievedMessage", messageData);
        console.log("data Send SuccessFully");
      }
      else
      {
        console.log("data Is Not Send SuccSfully");
      }

    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User Connected: ${userId} with SocketId: ${socket.id}`);
    }
    socket.on("sendMessage", sendMessage);
    socket.on("disconnect", () => disconnect(socket));
  });
};

export default setupSocket;

