import dotenv from "dotenv"

import connectDB from "./db/index.js";
dotenv.config({
  path:'./env'
})

connectDB()
.then(()=>{
  app.on("error",(error)=>{
    console.log("Error",error);
    throw error
  })
})
.then(()=>{
  app.listen(process.env.PORT || 8000,()=>{
    console.log(`SERVER IS RUNNING AT PORT ${process.env.PORT}`);
  })
})
.catch((err)=>{
  console.log("mongo db connection fialed !!! ",err);
})



















/*
import mongoose from "mongoose";
import express from "express";
import {DB_NAME} from "./constants.js";
const app = express()
( async () =>{
    try {
      await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
      app.on("error",(error)=>{
        console.log("ERROR",error);
        throw error
      })
      app.listen(process.env.PORT,()=>{
        console.log(`App is listening on port ${process.env.PORT}`);
      })
    } catch (error) {
        console.error("error",error)
        throw err
    }
})()

*/