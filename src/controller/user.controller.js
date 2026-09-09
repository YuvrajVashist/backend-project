import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js";
const registerUser =  asyncHandler ( async (req,res) => {
    /*
    1. get user details
    2. validation
    3. check user exist or not:username,email
    4. check for files(images,avatar),check avatar
    5. upload them to cloudinary,avatar
    6. create user object-- create user in db
    7. remove password and refresh token from response
    8. check for user creation
    9. return response
    */

    //1
    const {fullName,email,username,password} = req.body
    console.log("email",email);

    //2
    if(fullName === ""){
        throw new ApiError(400,"fullname is required")
    }

    if(email === ""){
        throw new ApiError(400,"email is required")
    }

    if(username === ""){
        throw new ApiError(400,"username is required")
    }

    if(password === ""){
        throw new ApiError(400,"password is required")
    }

    /*
     just advance code to check
     if(
         [fullName,email,username,password].some((field)=>field?.trim()==="")
     ){
         throw new ApiError(400,"All fields are required")
     }
    */

    //3
    const existedUser = await User.findOne({
        $or: [ {username},{email}]
    })
    
    if(existedUser){
        throw new ApiError(409,"User already existed")
    }

    //4
    const avatarLocalPath = req.files ?.avatar?.[0]?.path
    const coverImageLocalPath = req.files ?.coverImage?.[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(400,"select avatar")
    }

    //5
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"avatar not uploaded")
    }

    //6
    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        password,
        username:username.toLowerCase()
    })

    //7 first checking the user registered or not
    //jo chiz nhi leni uske aage - lga do
    const createdUser = await user.findByID(user._id).select(
        "-password -refreshToken"
    )

    //8
    if(!createdUser){
        throw new ApiError(500,"server ki glti hai")
    }

    //9
    return res.status(201).json(
        new ApiResponse(200,createdUser,"user registered successfully")
    )

})


export {registerUser}