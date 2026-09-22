// in this file we are designing a middleware which perform the authorization of user

import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt, { decode } from "jsonwebtoken"

export const verifyJWT = asyncHandler(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken|| req.header("Authorization")?.replace("Bearer ","")
    
        if(!token){
            throw new ApiError(401,"unauthorized request")
        }
    
        //this verify the access token
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refresToken")
    
        if(!user){
            throw new ApiError(401,
                "Invalid access Token"
            )
        }
    
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401,error?.message||"invalid access token")
    }
})