import * as express from 'express';
import { createAnimal, deleteAnimal, getAllAnimals, getAnimal, getAnimalContact, getLatestAnimal, updateAnimal } from '~/controllers/animalController';
import { verifyToken } from '~/middlewares/verifyToken';
import multer from 'multer';

const upload = multer()

const router = express.Router();
router.post("/", verifyToken, upload.fields([{ name: 'images' }]), createAnimal)
router.get("/", getAllAnimals);
router.get("/first", getLatestAnimal);
router.get("/:id", getAnimal);
router.get("/animal-contact/:id", getAnimalContact);
router.delete("/:id", verifyToken, deleteAnimal);
router.put("/:id", verifyToken, updateAnimal);



export default router;