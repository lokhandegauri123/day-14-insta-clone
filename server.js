require("dotenv").config()
const app = require("./src/app")
const connectDb = require("./src/config/database")
const express = require("express")
const cookieParser = require("cookie-parser")
const authRouter = require("./src/routes/auth.route")

app.use(express.json());
app.use(cookieParser())
app.use("/api/auth",authRouter)

connectDb()
app.listen(3000,()=>{
    console.log("server runnning on port no 3000")
})