import * as express from 'express';
import { createAnimal, deleteAnimal, getAllAnimals, getAllAnimalsID, getAllAnimalsValidated, getAnimal, getAnimalContact, getLatestAnimal, unvalidateAnimal, updateAnimal, validateAnimal } from '~/controllers/animalController';
import { verifyToken } from '~/middlewares/verifyToken';
import multer from 'multer';

const upload = multer()

const router = express.Router();
router.post("/", verifyToken, upload.fields([{ name: 'images' }]), createAnimal)
router.get("/", getAllAnimalsValidated);
router.get("/animals", getAllAnimals)
router.get("/first", getLatestAnimal);
router.get("/ids", getAllAnimalsID)
router.get("/:id", getAnimal);
router.get("/animal-contact/:id", getAnimalContact);
router.delete("/:id", verifyToken, deleteAnimal);
router.put("/:id", verifyToken, updateAnimal);
router.put("/validate/:id", verifyToken, validateAnimal)
router.put("/unvalidate/:id", verifyToken, unvalidateAnimal)



export default router;
