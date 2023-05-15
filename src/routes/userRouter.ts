import * as express from 'express';
import { login, refreshToken, register, resetPassword, updateResetPassword, verifyAdmin, verifyResetToken } from '~/controllers/userController';
import { verifyToken } from '~/middlewares/verifyToken';

const router = express.Router()
router.post("/login", login)
router.post("/register", register)
router.post("/reset-password", resetPassword)
router.post("/update-password", verifyToken, updateResetPassword);
router.get("/admin", verifyToken, verifyAdmin);
router.get("/reset-token", verifyToken, verifyResetToken)
router.get('/refresh', verifyToken, refreshToken)


export default router;