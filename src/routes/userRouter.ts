import { Router } from 'express';
import { refreshToken, resetPassword, updateResetPassword, verifyAdmin, verifyResetToken } from '~/controllers/userController';
import { verifyToken } from '~/middlewares/verifyToken';

const router = Router()

router.post("/reset-password", resetPassword)
router.post("/update-password", verifyToken, updateResetPassword);
router.get("/admin", verifyToken, verifyAdmin);
router.get("/reset-token", verifyToken, verifyResetToken)
router.get('/refresh', verifyToken, refreshToken)


export default router;