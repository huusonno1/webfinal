import express from "express"
import { login } from "../controllers/auth.js"

const router = express.Router();
// hello
router
    .route("/login")
    .post(login);

export default router;