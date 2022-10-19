import * as express from 'express';
import { Login } from '~/controllers/userController';

const router = express.Router()
router.get("/login", Login)

export default router;