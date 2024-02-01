import { asyncHandler } from "../utils/asynhandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from "../utils/ApiResponse.js"



// assecc and refresh token methods
const generateAccessAndRefreshTokens = async(userId)=>{
  try {
   const user =  await User.findById(userId)
  const accessToken =  user.generateAccessToken()
  const refreshToken =  user.generateRefreshToken()
  user.refreshToken = refreshToken
  await user.save({validateBeforSave: false})

  return {accessToken,refreshToken}



  } catch (error) {
    throw new ApiError(500,"Something went wrong while generating refresh and access token")
  }
}

const registerUser = asyncHandler(async (req, res) => {
  // get the user datails from fronend
  // check registration page
  // validetion -not empty
  // check if user already exitsts :username,email
  // check for image, avatar
  // upload them to cloudinary,check avatar
  // create user object- create entry in db
  // remove  password,refresh token from response
  // check for user creation
  // return response

  const { username, email, fullName, password } = req.body;
//   console.log("email:", email);

  //    if(fullName === ""){
  //     throw new ApiError(400,"fullname is required")
  //    }
  if (
    [username, email, fullName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all field is required");
  }

  const exitedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (exitedUser) {
    throw new ApiError(409, "username and email already exists");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
//   console.log(avatarLocalPath);
  console.log(res.files);
  
  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar is requried");
  }


  const avatar = await uploadOnCloudinary(avatarLocalPath)
 const coverImage= await uploadOnCloudinary(coverImageLocalPath)

 if(!avatar){
    throw new ApiError(400, "avatar is requried");
 }

 const user =  await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
 })

const createdUser = await User.findById(user._id).select(
    "-password  -refreshToken"
)

if(!createdUser){
    throw new ApiError(500, "Something went wrong while registering the user");
}

return res.status(201).json(
    new ApiResponse(200,createdUser,"User registerd successfully")
)

});

const loginUser = asyncHandler(async (req,res) => {
  // get the data from req.body -> data
  // username or email
  // find the user
  // check password
  // access and refresh token
  // send cookie

  const {email,username,password} = req.body

  if(!username || !email){
    throw new ApiError(400,"username and email is rrquired ")
  }

  const user =  await User.findOne({
    $or :[{username},{email}]
  })

  if(!user){
    throw new ApiError(404,"user not find ")
  }

  const isPasswordValid = await user.isPasswordCorrect(password)
  if(!isPasswordValid){
    throw new ApiError(401,"invalid user credentials ")
  }

 const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

 const loggedIn =  await User.findById(user._id).select("-password -refreshToken")


 const options ={
  httpOnly:true,
  secure:true
 }

 return res
 .status(200)
 .cookie("accessToken",accessToken,options)
 .cookie("refreshToken",refreshToken,options)
 .json(
  new ApiResponse(
    200,
    {
      user:loggedIn,accessToken,refreshToken
    },
    "user logged in successfully"
  )
 )
})


// loggedOut User
const logoutUser = asyncHandler(async(req,res) =>{
await User.findByIdAndUpdate(
  req.user._id,
  {
    $set:{
      refreshToken:undefined
    }
  },
  {
    new:true
  }
)

const options ={
  httpOnly:true,
  secure:true
 }

 return res
 .status(200)
 .clearCookie("accessToken",options)
 .clearCookie("refreshToken",options)
 .json(new ApiResponse(200,{},"User logout "))
})

export { 
  registerUser,
  loginUser,
  logoutUser
};
