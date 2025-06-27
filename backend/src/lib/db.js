import mongoose from 'mongoose';
import { config } from 'dotenv';
config();


// const mongodb_Url = process.env.MongoDbLocal_Url;
const mongodb_Url = process.env.MongoDbOnline_Url;

mongoose.connect(mongodb_Url);

const db = mongoose.connection;
db.on('connected',()=>{
    console.log("database connected successfully");
})

db.on('disconnected',()=>{
    console.log("database disconnected successfully");
})

db.on('error',(err)=>{
    console.log("error in connecting with database",err);
})

export default db;