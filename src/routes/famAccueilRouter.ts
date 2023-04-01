import { Router } from 'express';
import { createFamilleAccueil, getAnimals, validateFamilleAccueil } from '~/controllers/familleAccueilController';
import { verifyToken } from '~/middlewares/verifyToken';

const router = Router();
router.post("/", verifyToken, createFamilleAccueil)
router.put("/validate/:id", verifyToken, validateFamilleAccueil)
router.get("/animals", verifyToken, getAnimals)
// router.post("/animal/:id", createContactAnimal)
// router.get("/", getAllContact)
// router.get("/:id", getContact)
// router.put("/:id", verifyToken, updateContact)
// router.delete("/:id", verifyToken, deleteContact) 

export default router;