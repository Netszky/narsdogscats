import { Router } from 'express';
import userRouter from '../routes/userRouter';
import animalRouter from '../routes/animalRouter';
import partenaireRouter from '../routes/partenaireRouter';
import contactRouter from '../routes/contactRouter';
import evenementRouter from '../routes/evenementRouter';
import familleAccueilRouter from '../routes/famAccueilRouter';
import abandonRouter from '../routes/abandonRouter';
import animalContactRouter from '../routes/contactAnimalRouter';
const router = Router()

router.use("/user", userRouter);
router.use("/animal", animalRouter);
router.use("/partenaire", partenaireRouter);
router.use("/evenement", evenementRouter);
router.use("/contact", contactRouter);
router.use("/famille", familleAccueilRouter)
router.use("/abandon", abandonRouter)
router.use("/animal-contact", animalContactRouter)

export default router;