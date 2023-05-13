import { Router } from 'express';
import { createContact, deleteContact, getActiveContact, getAllContact } from '~/controllers/contactController';
import { verifyToken } from '~/middlewares/verifyToken';

const router = Router();
router.post("/", createContact)
router.get("/active", verifyToken, getActiveContact)
router.get("/", verifyToken, getAllContact)
router.delete("/:id", verifyToken, deleteContact)

export default router;