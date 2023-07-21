import { Router } from 'express';
import { verifyToken } from '~/middlewares/verifyToken';

const router = Router()

router.get("/")
router.post("/", verifyToken)
router.put("/")
export default router;