import { Router } from 'express';
import userRouter from '../routes/userRouter';
import animalRouter from '../routes/animalRouter';
const router = Router()

router.use("/user", userRouter);
router.use("/animal", animalRouter)

export default router;