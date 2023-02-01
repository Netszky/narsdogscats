import * as express from 'express';
import { login, register, resetPassword, updateResetPassword } from '~/controllers/userController';

const router = express.Router()
router.post("/login", login)
router.post("/register", register)
router.post("/reset-password", resetPassword)
router.post("/update-password", updateResetPassword);


export default router;