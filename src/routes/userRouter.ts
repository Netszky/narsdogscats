import * as express from 'express';
import { createBenevole, login, register, resetPassword, updateResetPassword, verifyRole } from '~/controllers/userController';
import { verifyToken } from '~/middlewares/verifyToken';

const router = express.Router()
router.post("/login", login)
router.post("/register", register)
router.post("/reset-password", resetPassword)
router.post("/update-password", updateResetPassword);
router.get("/role", verifyToken, verifyRole);
router.post("/benevole", createBenevole);


export default router;