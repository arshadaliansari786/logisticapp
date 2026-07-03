import { Router } from 'express';
import { PickupController } from './controllers/PickupController';
import { authMiddleware } from '@common/middleware/authMiddleware';
import multer from 'multer';
import path from 'path';

const router = Router();
// Cast to `any`: controller methods return the Express Response object for
// chaining, which TS's structural typing doesn't accept as Promise<void> for
// RequestHandler when passed by reference (see Express RequestHandler typing).
const pickupController = new PickupController() as any;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/pickup-images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.random().toString(36).substr(2, 9) + path.extname(file.originalname));
  },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

/**
 * @swagger
 * /api/pickups:
 *   post:
 *     summary: Create a new pickup
 *     tags: [Pickups]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               customerName:
 *                 type: string
 *               mobileNumber:
 *                 type: string
 *               pickupAddress:
 *                 type: string
 *               deliveryAddress:
 *                 type: string
 *               materialType:
 *                 type: string
 *               weight:
 *                 type: number
 *               deliveryDate:
 *                 type: string
 *               remarks:
 *                 type: string
 *               pickupImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Pickup created successfully
 */
router.post('/', authMiddleware, upload.single('pickupImage'), pickupController.createPickup);

/**
 * @swagger
 * /api/pickups:
 *   get:
 *     summary: Get pickups list
 *     tags: [Pickups]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pickups list retrieved
 */
router.get('/', authMiddleware, pickupController.getPickupsList);

/**
 * @swagger
 * /api/pickups/{id}:
 *   get:
 *     summary: Get pickup by ID
 *     tags: [Pickups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pickup retrieved successfully
 */
router.get('/:id', pickupController.getPickupById);

/**
 * @swagger
 * /api/pickups/number/{pickupNumber}:
 *   get:
 *     summary: Get pickup by pickup number
 *     tags: [Pickups]
 *     parameters:
 *       - in: path
 *         name: pickupNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pickup retrieved successfully
 */
router.get('/number/:pickupNumber', pickupController.getPickupByNumber);

/**
 * @swagger
 * /api/pickups/{id}:
 *   put:
 *     summary: Update pickup
 *     tags: [Pickups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               remarks:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pickup updated successfully
 */
router.put('/:id', pickupController.updatePickup);

/**
 * @swagger
 * /api/pickups/{id}:
 *   delete:
 *     summary: Delete pickup
 *     tags: [Pickups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pickup deleted successfully
 */
router.delete('/:id', pickupController.deletePickup);

/**
 * @swagger
 * /api/pickups/stats/dashboard:
 *   get:
 *     summary: Get dashboard stats
 *     tags: [Pickups]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats retrieved
 */
router.get('/stats/dashboard', authMiddleware, pickupController.getDashboardStats);

export default router;
