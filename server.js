require("dotenv").config()
const express = require("express")
const app = require("./src/app")
const connectDb = require("./src/config/database")
const cookieParser = require("cookie-parser")

app.use(express.json());
app.use(cookieParser())

// router required
const authRouter = require("./src/routes/auth.route")
const postRouter = require("./src/routes/post.route")
const userRouter = require("./src/routes/user.route")

// router used
app.use("/api/auth",authRouter)
app.use("/api/posts",postRouter)
app.use("/api/users",userRouter)


connectDb()
app.listen(3000,()=>{
    console.log("server runnning on port no 3000")
})