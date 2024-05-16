import express from "express"
import {
    getFeedPosts,
    getUserPosts,
    likePost,
    addComment,
    getComments,
    deleteComment,
} from "../controllers/posts.js"
import { verifyToken } from "../middleware/authMiddleware.js"

const router = express.Router()

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

/* COMMENT */
router.post('/:postId/comments', addComment);
router.get('/:postId/comments', getComments);
router.delete('/:postId/comments/:commentId', deleteComment);

export default router;
