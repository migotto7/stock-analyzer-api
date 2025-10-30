import { Router } from "express";

import { authLogin, authRegister, authLogout } from "../controllers/authController.js";

const router = Router();

router.post("/login", authLogin);
router.post("/register", authRegister);
router.post("/logout", authLogout);

export default router;