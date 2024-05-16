import express from "express"
import {
    getFeedPosts,
    getUserPosts,
    likePost,
    addComment,
    getComments,
} from "../controllers/posts.js"
import { verifyToken } from "../middleware/authMiddleware.js"

const router = express.Router()

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

/* COMMENT */
router.post('/:id/comments', addComment);
router.get('/:id/comments', getComments);

export default router;
