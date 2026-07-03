import { Router } from 'express';
import { ProfileController } from './controllers/ProfileController';
import { authMiddleware } from '@common/middleware/authMiddleware';

const router = Router();
// Cast to `any`: controller methods return the Express Response object for
// chaining, which TS's structural typing doesn't accept as Promise<void> for
// RequestHandler when passed by reference (see Express RequestHandler typing).
const profileController = new ProfileController() as any;

router.get('/', authMiddleware, profileController.getProfile);

router.put('/', authMiddleware, profileController.updateProfile);

router.post('/change-password', authMiddleware, profileController.changePassword);

export default router;
