import { Router } from 'express';
import { createInformation, getInformations, updateInformations } from '~/controllers/informationsController';
import { verifyToken } from '~/middlewares/verifyToken';

const router = Router()

router.get("/", getInformations)
router.post("/", verifyToken, createInformation)
router.put("/", verifyToken, updateInformations)
export default router;