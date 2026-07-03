import { Request, Response } from 'express';
import { DeliveryService } from '../services/DeliveryService';
import { asyncHandler } from '@common/middleware/errorMiddleware';

const deliveryService = new DeliveryService();

export class DeliveryController {
  getDeliveryById = asyncHandler(async (req: Request, res: Response) => {
    const delivery = await deliveryService.getDeliveryById(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Delivery retrieved successfully',
      data: delivery,
    });
  });

  getDeliveryByNumber = asyncHandler(async (req: Request, res: Response) => {
    const delivery = await deliveryService.getDeliveryByNumber(req.params.deliveryNumber);

    res.status(200).json({
      success: true,
      message: 'Delivery retrieved successfully',
      data: delivery,
    });
  });

  updateDelivery = asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const deliveryImagePath = files?.deliveryImage
      ? `/uploads/delivery-images/${files.deliveryImage[0].filename}`
      : undefined;
    const signatureImagePath = files?.signature
      ? `/uploads/signatures/${files.signature[0].filename}`
      : undefined;

    const delivery = await deliveryService.updateDelivery(
      req.params.id,
      req.body,
      deliveryImagePath,
      signatureImagePath
    );

    res.status(200).json({
      success: true,
      message: 'Delivery updated successfully',
      data: delivery,
    });
  });

  getPendingDeliveries = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await deliveryService.getPendingDeliveries(page, limit);

    res.status(200).json({
      success: true,
      message: 'Deliveries retrieved successfully',
      data: result,
    });
  });
}
