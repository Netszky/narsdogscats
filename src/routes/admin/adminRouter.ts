import { Router } from 'express';
import { verifyToken } from '~/middlewares/verifyToken';
import animalAdminRouter from './animalAdminRouter'
import contactAdminRouter from './contactAdminRouter'
import familleAdminRouter from './familleAdminRouter'
import abandonAdminRouter from './abandonAdminRouter';
import { getAdminDashboard } from '~/controllers/admin/adminDashboardController';
const router = Router()
router.use("/animal", animalAdminRouter)
router.use('/famille', familleAdminRouter)
router.use('/contact', contactAdminRouter)
router.use('/abandon', abandonAdminRouter)
router.get("/dashboard", verifyToken, getAdminDashboard)



export default router;