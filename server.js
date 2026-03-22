require("dotenv").config()
const express = require("express")

const app = require("./src/app")
const connectDb = require("./src/config/database")
const cookieParser = require("cookie-parser")
const authRouter = require("./src/routes/auth.route")
const postRouter = require("./src/routes/post.route")
app.use(express.json());
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/posts",postRouter)
connectDb()
app.listen(3000,()=>{
    console.log("server runnning on port no 3000")
})