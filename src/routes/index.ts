import * as express from 'express';
import userRouter from '../routes/userRouter';
import animalRouter from '../routes/animalRouter';
const router = express.Router()

router.use("/user", userRouter);
router.use("/animal", animalRouter)

export default router;