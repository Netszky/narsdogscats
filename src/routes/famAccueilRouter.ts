import { Router } from 'express';
import { createFamilleAccueil, getAnimals, getInactiveFamille, validateFamilleAccueil } from '~/controllers/familleAccueilController';
import { verifyToken } from '~/middlewares/verifyToken';

const router = Router();
router.post("/", verifyToken, createFamilleAccueil)
router.put("/validate/:id", verifyToken, validateFamilleAccueil)
router.get("/animals", verifyToken, getAnimals)
router.get("/inactive", verifyToken, getInactiveFamille)


export default router;