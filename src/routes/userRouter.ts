import * as express from 'express';
import { Login, Register } from '~/controllers/userController';
import { auth } from '~/middlewares/verifyToken';

const router = express.Router()
router.post("/login", Login)
router.post("/register", Register)


export default router;