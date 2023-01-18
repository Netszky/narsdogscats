import * as express from 'express';
import { createAnimal, deleteAnimal, getAllAnimals, getAnimal, updateAnimal } from '~/controllers/animalController';
import { verifyToken } from '~/middlewares/verifyToken';

const router = express.Router();
router.post("/", verifyToken, createAnimal)
router.get("/", getAllAnimals);
router.get("/:id", getAnimal);
router.delete("/:id", verifyToken, deleteAnimal);
router.put("/:id", verifyToken, updateAnimal);



export default router;