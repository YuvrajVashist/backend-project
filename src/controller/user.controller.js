import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js";

const generateAccessAndRefreshToken = async(userId)=>{
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken
        const refreshToken = user.generateRefreshToken
        //we give access token to the user
        user.refreshToken = refreshToken

        //just save the password to the db
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}
    } catch(error){
        throw new ApiError(500,"something went wrong in generating the access and refresh token")
    }
}
const registerUser = asyncHandler(async (req, res) => {
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
    const { fullName, email, username, password } = req.body
    console.log("email", email);

    //2
    if (fullName === "") {
        throw new ApiError(400, "fullname is required")
    }

    if (email === "") {
        throw new ApiError(400, "email is required")
    }

    if (username === "") {
        throw new ApiError(400, "username is required")
    }

    if (password === "") {
        throw new ApiError(400, "password is required")
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
    // const existedUser = await User.findOne({
    //     $or: [ {username},{email}]
    // })

    // if(existedUser){
    //     throw new ApiError(409,"User already existed")
    // }

    const normalizedUsername = username.toLowerCase().trim();
    const normalizedEmail = email.toLowerCase().trim();

    const existingByUsername = await User.findOne({
        username: normalizedUsername
    });

    const existingByEmail = await User.findOne({
        email: normalizedEmail
    });

    console.log("Username received:", normalizedUsername);
    console.log("Email received:", normalizedEmail);
    console.log("User with same username:", existingByUsername);
    console.log("User with same email:", existingByEmail);

    if (existingByUsername || existingByEmail) {
        throw new ApiError(409, "Username or email already exists");
    }
    //4
    const avatarLocalPath = req.files?.avatar?.[0]?.path
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "select avatar")
    }

    //5
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null

    if (!avatar) {
        throw new ApiError(400, "avatar not uploaded")
    }

    //6
    const user = await User.create({
        fullName,
        email,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        password,
        username: username.toLowerCase()
    })

    //7 first checking the user registered or not
    //jo chiz nhi leni uske aage - lga do
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    //8
    if (!createdUser) {
        throw new ApiError(500, "server ki glti hai")
    }

    //9
    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    /*
    1. req body se data leke aao
    2. username or email
    3. find the user
    4. if user find check the password
    5. access and refresh token
    6. send cookies
    */

    //1
    const { email, username, password } = req.body

    //2
    if (!username || !email) {
        throw new ApiError(400, "username or email required")
    }

    //3
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) {
        throw new ApiError(404, "user doesnot exist")
    }

    //4
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(404, "password incorrect")
    }

    //5
    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    //to send data to cookies
    const options = {
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
                user:loggedInUser,accessToken,refreshToken
            },
            "User LoggedIn successfully"
    )
    )
})

//procedure to logout the user
const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        }
    )

    const options = {
        httpOnly:true,
        secure:true
    }
    
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200),{},{"User Logged Out"})
})

export { registerUser, loginUser, logoutUser }