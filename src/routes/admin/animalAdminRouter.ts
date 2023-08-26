import { Router } from 'express';
import { changeAnimalStatus, createAnimalAdmin, deleteAnimal, getAllAnimals, getAnimalByFamille } from '~/controllers/admin/adminAnimalController';
import { verifyToken } from '~/middlewares/verifyToken';
import multer from 'multer';

const upload = multer()


const router = Router()
router.get("/:id", verifyToken, getAnimalByFamille)
router.get('/', verifyToken, getAllAnimals)
router.post("/", verifyToken, upload.fields([{ name: 'images' }]), createAnimalAdmin)
router.put("/status/:id", verifyToken, changeAnimalStatus)
router.delete("/:id", verifyToken, deleteAnimal);

export default router;