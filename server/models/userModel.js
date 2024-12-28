import mongoose from "mongoose";
import pkg from "bcryptjs";
const {genSalt,hash} = pkg;
// const bcrypt = require('bcryptjs');
const UserModel=mongoose.Schema({
    Email:{
        type:String,
        required:[true,"Email Is Required!"],
        
    },
    Password:{
        type:String,
        required:[true,"Password Is Required!"],
    },
    firstName:{
        type:String,
        required:false,
    },
    lastName:{
        type:String,
        required:false,
    },
    image:{
        type:String,
        required:false,
    },
    color:{
        type:String,
        required:false,
        
    },
    profileSetup:{
        type:Boolean,
        default:false,
    },
});

UserModel.pre("save", async function save(next) {
    const salt = await genSalt(); // Generate the salt
    console.log(salt);
    console.log(this.Password);
    this.Password = await hash(this.Password, salt); // Hash the password
    next();
});

   

const USER=mongoose.model("Users",UserModel);

export default USER;