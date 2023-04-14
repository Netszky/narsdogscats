import { Router } from 'express';
import { createFamilleAccueil, deactivateFamille, deleteFamille, getAllFamilleAccueil, getAnimals, getInactiveFamille, updateFamille, validateFamille } from '~/controllers/familleAccueilController';
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


export default router;