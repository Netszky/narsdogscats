import { Router } from 'express';
import userRouter from '../routes/userRouter';
import animalRouter from '../routes/animalRouter';
import partenaireRouter from '../routes/partenaireRouter';
import contactRouter from '../routes/contactRouter';
import evenementRouter from '../routes/evenementRouter';
import familleAccueilRouter from '../routes/famAccueilRouter';
const router = Router()

router.use("/user", userRouter);
router.use("/animal", animalRouter);
router.use("/partenaire", partenaireRouter);
router.use("/evenement", evenementRouter);
router.use("/contact", contactRouter);
router.use("/famille", familleAccueilRouter)

export default router;