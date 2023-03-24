import { Router } from 'express';
import { createPartenaire, deletePartenaire, getAllPartenaire, getPartenaire, updatePartenaire } from '~/controllers/partenaireController';
import { verifyToken } from '~/middlewares/verifyToken';

const router = Router();
router.post("/", verifyToken, createPartenaire)
router.get("/", getAllPartenaire)
router.get("/:id", getPartenaire)
router.put("/:id", verifyToken, updatePartenaire)
router.delete("/:id", verifyToken, deletePartenaire)




export default router;