import { Router } from 'express';
import { FileController } from './controllers/FileController';
import { authMiddleware } from '@common/middleware/authMiddleware';
import multer from 'multer';

const router = Router();
// Cast to `any`: controller methods return the Express Response object for
// chaining, which TS's structural typing doesn't accept as Promise<void> for
// RequestHandler when passed by reference (see Express RequestHandler typing).
const fileController = new FileController() as any;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const moduleName = req.body.moduleName || 'generic';
    cb(null, `./uploads/${moduleName}`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.random().toString(36).substr(2, 9) + '.' + file.mimetype.split('/')[1]);
  },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/upload', authMiddleware, upload.single('file'), fileController.uploadFile);

router.get('/entity/:entityId', fileController.getFilesByEntity);

router.delete('/:fileId', fileController.deleteFile);

router.get('/download/:fileId', fileController.downloadFile);

export default router;
