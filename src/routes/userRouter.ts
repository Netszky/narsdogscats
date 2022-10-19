import * as express from 'express';
import { Login } from '~/controllers/userController';
import { auth } from '~/middlewares/verifyToken';

const router = express.Router()
router.get("/login", auth, Login)

export default router;