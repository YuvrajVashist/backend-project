require('dotenv').config({path:'./env'})

import mongoose from "mongoose";
import {DB_NAME} from '../constants'
import connecDB from "./db";
import e from "express";


connecDB()

.then(()=>{
    const server = app.listen(process.env.PORT || 8000,()=>{
        console.log(`server is runnig on ${process.env.PORT}`)
    })

    //we use app.on when server is returning something
    server.on('error',(err)=>{
        console.log("the error is: ",err)
    })
})


.catch((err) =>{
    console.log("error",err)
})