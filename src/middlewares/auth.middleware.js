import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynhandler.js";
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"


export const verifyJWT = asyncHandler( async (req,_,next) => {
 try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
   
    if(!token){
       throw new ApiError(401,"Unauthorizes request")
    }
   
   const decodeedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
   const user = await User.findById(decodeedToken?._id).select("-password -refreshToken")
   
   if(!user){
       // TOdo discuss about
       throw new ApiError(401,"invalid access token")
   }
   
   req.user = user;
   next()
 } 
 catch (error) {
    throw new ApiError(401,error?.message || "invalid access token")
 }

})