// // import { Schema } from "mongoose";
// import mongoose from "mongoose"

// const messageSchema=new mongoose.Schema({
//     sender:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"Users",
//         required:true,
//     },
//     recipient:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"Users",
//         required:false,
//     },
//     messageType:{
//         type:String,
//         enum:['text','file'],
//         required:true,
//     },
//     // if content is Text then it is Used To Store Text
//     content:{
//         type:String,
//         required:function () {
//             return this.messageType==="text";
//         },
//     },
//     // if Content is File then it is Used to Store Files Like Photos etc
//     fileUrl:{
//         type:String,
//         required:function () {
//             return this.messageType==="file";
//         },
//     },

//     timestamp:{
//         type:Date,
//         default:Date.now,
//     },
// });

// const Message=mongoose.model("Messages",messageSchema);

// export default Message;

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: false },
  messageType: { type: String, enum: ['text', 'file'], required: true },
  content: { 
    type: String, 
    required:  false, 
    validate: {
      validator: function(value) {
        return (this.messageType === 'text' && value) || (this.messageType === 'file' && value);
      },
      message: 'Either content or fileUrl must be present based on messageType.'
    }
  },

  fileUrl: { 
    type: String, 
    required: function () {
      // Ensure `this` refers to the document being validated
      return this.messageType === 'file';
    },
    validate: {
      validator: function(value) {
        // Ensure a value exists when messageType is 'file'
        return this.messageType === 'file' ? Boolean(value) : true;
      },
      message: 'fileUrl is required for messages of type "file".'
    }
  },
  


  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Messages", messageSchema);
export default Message;
