import { Router } from 'express';
import { createFamilleAccueil, deactivateFamille, deleteFamille, findFamilleStatus, getAllFamilleAccueil, getAnimals, getFamillesCapacity, getInactiveFamille, updateFamille, validateFamille, verifyFamille } from '~/controllers/familleAccueilController';
import { verifyToken } from '~/middlewares/verifyToken';

const router = Router();
router.post("/", verifyToken, createFamilleAccueil)
router.put("/validate/:id", verifyToken, validateFamille)
router.put("/unvalidate/:id", verifyToken, deactivateFamille)
router.get("/animals", verifyToken, getAnimals)
router.get("/inactive", verifyToken, getInactiveFamille)
router.get('/', verifyToken, getAllFamilleAccueil)
router.put('/:id', verifyToken, updateFamille)
router.delete("/:id", verifyToken, deleteFamille)
router.get("/status", verifyToken, findFamilleStatus)
router.get("/capacity", getFamillesCapacity)
router.get("/verify-famille", verifyToken, verifyFamille)


export default router;