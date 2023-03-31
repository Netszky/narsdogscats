import { Router } from 'express';
import { createContact, createContactAnimal, getAllContact } from '~/controllers/contactController';
import { verifyToken } from '~/middlewares/verifyToken';

const router = Router();
router.post("/", createContact)
router.post("/animal/:id", createContactAnimal)
router.get("/", getAllContact)
// router.get("/:id", getContact)
// router.put("/:id", verifyToken, updateContact)
// router.delete("/:id", verifyToken, deleteContact) 

export default router;