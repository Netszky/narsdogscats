import { Router } from 'express';
import { createEvenement, deleteEvenement, getAllEvenement, getEvenement, updateEvenement } from '~/controllers/evenementController';
import { verifyToken } from '~/middlewares/verifyToken';

const router = Router();
router.post("/", verifyToken, createEvenement)
router.get("/", getAllEvenement)
router.get("/:id", getEvenement)
router.put("/:id", verifyToken, updateEvenement)
router.delete("/:id", verifyToken, deleteEvenement)




export default router;