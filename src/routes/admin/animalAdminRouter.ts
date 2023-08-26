import { Router } from 'express';
import { createAnimalAdmin, getAllAnimals, getAnimalByFamille } from '~/controllers/admin/adminAnimalController';
import { verifyToken } from '~/middlewares/verifyToken';
import multer from 'multer';

const upload = multer()


const router = Router()
router.get("/:id", verifyToken, getAnimalByFamille)
router.get('/', verifyToken, getAllAnimals)
router.post("/", verifyToken, upload.fields([{ name: 'images' }]), createAnimalAdmin)

export default router;