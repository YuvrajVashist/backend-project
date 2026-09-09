
import mongoose, { Schema } from "mongoose";

// This plugin helps us handle large amounts of data by dividing the results into smaller pages
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// Used to create and verify JWT tokens
import jwt from "jsonwebtoken";

// Used to hash and compare passwords
import bcrypt from "bcrypt";

// User Schema
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        avatar: {
            type: String,
            required: true
        },

        coverImage: {
            type: String
        },

        // Stores the videos watched by the user
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],

        password: {
            type: String,
            required: [true, "Password is required"]
        },

        refreshToken: {
            type: String
        }
    }, { timestamps: true }
);


// Mongoose middleware that runs before a particular operation happens
userSchema.pre("save", async function (next) {

    // If the password has not been modified, skip hashing
    if (!this.isModified("password")) return next();

    // Hash the password
    // Higher number of salt rounds generally means more processing time
    this.password = await bcrypt.hash(this.password, 10);

    // Continue with the save operation
    next();
});


// Method to check whether the entered password is correct
userSchema.methods.isPasswordCorrect = async function (password) {

    // bcrypt.compare() returns true or false
    // Compare entered password with the hashed password stored in the database
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    // jwt.sigh(payload {},secretkey (string), option)
    return jwt.sign(
        {
            //defining payload
            _id: this._id,
            email: this.email,
            userName: this.username
        },
        //secret key
        process.env.ACCESS_TOKENT_SECRET,
        {
            //option
            //expiry object me jata hai
            expiresIn: process.env.ACCESS_TOKENT_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            //defining payload
            _id: this._id
        },
        //secret key
        process.env.REFRESH_TOKEN_SECRET,
        //options
        {
            //expirt object me jata hai
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )

}


// Create and export the User model
export const User = mongoose.model("User", userSchema);

