const express = require("express")
const postRouter = express.Router();
const postController = require("../controller/post.controller")
const multer = require("multer")
const upload = multer({storage : multer.memoryStorage()})
// const userModel = require("../models/posts.model")
const identifyUser = require("../middleware/auth.middleware")

/**
 * req.body = {caption, img-file}
  
 * /api/posts/ 
 */
postRouter.post("/",upload.single('image'), identifyUser ,postController.createPostController)

postRouter.get("/", identifyUser ,postController.getPostController)

postRouter.get("/details/:postId", identifyUser ,postController.getPostDetailsController)

// POST /api/posts/like/:postId
postRouter.post("/like/:postId", identifyUser , postController.likePostController)

module.exports = postRouter

