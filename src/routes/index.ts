import * as express from 'express';
import userRouter from '../routes/userRouter';
const router = express.Router()

router.use("/user", userRouter);

// module.exports = router;
export default router;