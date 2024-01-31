import { asyncHandler } from "../utils/asynhandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from "../utils/ApiResponse.js"

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
  console.log("email:", email);

  //    if(fullName === ""){
  //     throw new ApiError(400,"fullname is required")
  //    }
  if (
    [username, email, fullName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all field is required");
  }

  const exitedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (exitedUser) {
    throw new ApiError(409, "username and email already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

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

export { registerUser };
