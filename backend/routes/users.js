import express from "express"
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// verifyToken has not been added
// READ
router.get("/:id", getUser);
router.get("/:id/friends", getUserFriends);

// UPDATE
router.patch("/:id/:friendId", addRemoveFriend);

export default router;