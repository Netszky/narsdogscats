import * as express from 'express';
import { addFamilleUser, createBenevole, login, register, resetPassword, updateResetPassword, verifyAdmin, verifyFamille, verifyResetToken } from '~/controllers/userController';
import { verifyToken } from '~/middlewares/verifyToken';

const router = express.Router()
router.post("/login", login)
router.post("/register", register)
router.post("/reset-password", resetPassword)
router.post("/update-password", verifyToken, updateResetPassword);
router.get("/admin", verifyToken, verifyAdmin);
router.get("/verify-famille", verifyToken, verifyFamille);
router.post("/benevole/new", createBenevole);
router.post("/benevole", verifyToken, addFamilleUser)
router.get("/reset-token", verifyToken, verifyResetToken)


export default router;