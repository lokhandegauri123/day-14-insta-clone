const express = require("express")
const identifyUser = require("../middleware/auth.middleware")
const userRouter = express.Router()
const userController = require("../controller/user.controller")

/*
    @route  POST  /api/users/follows/"userId"
    @access  private
 */
userRouter.post("/follows/:username", identifyUser ,userController.followUserController)
userRouter.post("/unfollows/:username", identifyUser , userController.unFollowUserController)
module.exports = userRouter