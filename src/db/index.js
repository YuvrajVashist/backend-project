import mongoose from "mongoose";
import { DB_NAME } from "../../constants.js";
import app from "../app.js";

//we use async becuase dB can be anywhere so first we have to connect the server to dB

const connecDB = async()=>{
    try{
        const connectionInstace = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`\n Mongodb connected HOST ${connectionInstace.connection.host}`)
    }catch(error){
        console.log("MONGODB CONNECTION ERROR: ",error)
        process.exit(1)
    }
}

export default connecDB