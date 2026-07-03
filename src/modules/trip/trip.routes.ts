import { Router } from 'express';
import { TripController } from './controllers/TripController';
import { authMiddleware } from '@common/middleware/authMiddleware';
import multer from 'multer';
import path from 'path';

const router = Router();
// Cast to `any`: controller methods return the Express Response object for
// chaining, which TS's structural typing doesn't accept as Promise<void> for
// RequestHandler when passed by reference (see Express RequestHandler typing).
const tripController = new TripController() as any;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/meter-images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.random().toString(36).substr(2, 9) + path.extname(file.originalname));
  },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/', authMiddleware, upload.single('openingMeterImage'), tripController.createTrip);

router.put('/:tripId/close', authMiddleware, upload.single('closingMeterImage'), tripController.closeTrip);

router.get('/history', authMiddleware, tripController.getHistory);

router.get('/today', authMiddleware, tripController.getTodayTrip);

router.get('/distance/today', authMiddleware, tripController.getTotalDistance);

export default router;
