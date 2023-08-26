import { Router } from "express";
import { deleteAnimalContact } from "~/controllers/admin/adminAnimalContactController";
import { verifyToken } from "~/middlewares/verifyToken";

const router = Router()
router.delete("/:id", verifyToken, deleteAnimalContact)
export default router