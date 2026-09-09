import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()

//allowing which frontend can access our backend
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

//this step is use to set the limit of data sent to server
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true })) 

//jsut to store the images video pdf 
app.use(express.static("public"))
app.use(cookieParser())


//routes
import userRouter from "./routes/user.routes.js"

app.use("/api/v1/user", userRouter)


export default app