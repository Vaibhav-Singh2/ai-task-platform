import { Router } from "express";

import { login, logout, me, register } from "@/controllers/auth.js";
import { isAuthenticated } from "@/middlewares/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", isAuthenticated, me);
router.post("/logout", isAuthenticated, logout);

export default router;
