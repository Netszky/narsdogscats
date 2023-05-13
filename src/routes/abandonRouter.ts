import { Router } from 'express';
import { createAbandon, deleteAbandon, getAllAbandon } from '~/controllers/abandonAnimalController';
import { verifyToken } from '~/middlewares/verifyToken';


const router = Router();
router.post("/", createAbandon)
router.get("/", verifyToken, getAllAbandon)
router.delete("/:id", verifyToken, deleteAbandon)

export default router;