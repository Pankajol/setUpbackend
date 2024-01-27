import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
const app = express()
// for middlewers
app.use(cors({
    option:process.env.CORS_ORIGIN,
    credentials:TRUE
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())




export {app}