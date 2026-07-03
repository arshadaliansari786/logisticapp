import { Router } from 'express';
import { AttendanceController } from './controllers/AttendanceController';
import { authMiddleware } from '@common/middleware/authMiddleware';
import multer from 'multer';
import path from 'path';

const router = Router();
// Cast to `any`: controller methods return the Express Response object for
// chaining, which TS's structural typing doesn't accept as Promise<void> for
// RequestHandler when passed by reference (see Express RequestHandler typing).
const attendanceController = new AttendanceController() as any;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/attendance-selfies');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.random().toString(36).substr(2, 9) + path.extname(file.originalname));
  },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/check-in', authMiddleware, upload.single('selfie'), attendanceController.checkIn);

router.post('/check-out', authMiddleware, attendanceController.checkOut);

router.get('/history', authMiddleware, attendanceController.getHistory);

router.get('/status/today', authMiddleware, attendanceController.getTodayStatus);

export default router;
