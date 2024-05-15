import express from "express"
import {
    getFeedPosts,
    getUserPosts,
    likePost
} from "../controllers/posts.js"
import { verifyToken } from "../middleware/authMiddleware.js"

const router = express.Router()

// verifyToken has not been added
/* READ */
router.get("/", getFeedPosts);
router.get("/:userId/posts", getUserPosts);

/* UPDATE */
router.patch("/:id/like", likePost);

export default router;
