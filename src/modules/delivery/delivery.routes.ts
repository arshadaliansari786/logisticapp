import { Router } from 'express';
import { DeliveryController } from './controllers/DeliveryController';
import { authMiddleware } from '@common/middleware/authMiddleware';
import multer from 'multer';

const router = Router();
// Cast to `any`: controller methods return the Express Response object for
// chaining, which TS's structural typing doesn't accept as Promise<void> for
// RequestHandler when passed by reference (see Express RequestHandler typing).
const deliveryController = new DeliveryController() as any;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.fieldname === 'signature' ? './uploads/signatures' : './uploads/delivery-images';
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.random().toString(36).substr(2, 9) + '.' + file.mimetype.split('/')[1]);
  },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.get('/:id', deliveryController.getDeliveryById);

router.get('/number/:deliveryNumber', deliveryController.getDeliveryByNumber);

router.put('/:id', upload.fields([{ name: 'deliveryImage', maxCount: 1 }, { name: 'signature', maxCount: 1 }]), deliveryController.updateDelivery);

router.get('/', authMiddleware, deliveryController.getPendingDeliveries);

export default router;
