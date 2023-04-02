import * as express from 'express';
import { createBenevole, login, register, resetPassword, updateResetPassword, verifyAdmin, verifyFamille } from '~/controllers/userController';
import { verifyToken } from '~/middlewares/verifyToken';

const router = express.Router()
router.post("/login", login)
router.post("/register", register)
router.post("/reset-password", resetPassword)
router.post("/update-password", updateResetPassword);
router.get("/admin", verifyToken, verifyAdmin);
router.get("/verify-famille", verifyToken, verifyFamille);
router.post("/benevole", createBenevole);
// router.get("/famille-status", verifyToken,)


export default router;