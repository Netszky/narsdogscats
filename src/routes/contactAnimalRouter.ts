import { Router } from 'express';
import { createContactAnimal, deleteAnimalContact } from '~/controllers/contactAnimalController';
import { verifyToken } from '~/middlewares/verifyToken';


const router = Router();
router.post("/", createContactAnimal)
router.delete("/:id", verifyToken, deleteAnimalContact)

export default router;