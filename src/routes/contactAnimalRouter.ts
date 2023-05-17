import { Router } from 'express';
import { createContactAnimal, deleteAnimalContact } from '~/controllers/contactAnimalController';
import { verifyToken } from '~/middlewares/verifyToken';


const router = Router();
router.post("/:id", createContactAnimal)
router.delete("/:id", verifyToken, deleteAnimalContact)

export default router;