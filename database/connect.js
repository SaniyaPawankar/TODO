import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({path: "./config.env"});

async function connect(){
    try{
       await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
       console.log("Connected to MongoDB successfully");
    }catch(err){
       console.log("Unable to connect to MongoDB:", err);
    }
}

connect();