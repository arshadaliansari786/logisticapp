import { Request, Response } from 'express';
import { PickupService } from '../services/PickupService';
import { asyncHandler } from '@common/middleware/errorMiddleware';
import { IAuthRequest } from '@common/middleware/authMiddleware';

const pickupService = new PickupService();

export class PickupController {
  createPickup = asyncHandler(async (req: IAuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const imagePath = req.file ? `/uploads/pickup-images/${req.file.filename}` : undefined;
    const pickup = await pickupService.createPickup(req.body, req.user.id, imagePath);

    res.status(201).json({
      success: true,
      message: 'Pickup created successfully',
      data: pickup,
    });
  });

  getPickupById = asyncHandler(async (req: Request, res: Response) => {
    const pickup = await pickupService.getPickupById(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Pickup retrieved successfully',
      data: pickup,
    });
  });

  getPickupByNumber = asyncHandler(async (req: Request, res: Response) => {
    const pickup = await pickupService.getPickupByNumber(req.params.pickupNumber);

    res.status(200).json({
      success: true,
      message: 'Pickup retrieved successfully',
      data: pickup,
    });
  });

  getPickupsList = asyncHandler(async (req: IAuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await pickupService.getPickupsList(req.user.id, page, limit);

    res.status(200).json({
      success: true,
      message: 'Pickups retrieved successfully',
      data: result,
    });
  });

  updatePickup = asyncHandler(async (req: Request, res: Response) => {
    const pickup = await pickupService.updatePickup(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Pickup updated successfully',
      data: pickup,
    });
  });

  deletePickup = asyncHandler(async (req: Request, res: Response) => {
    await pickupService.deletePickup(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Pickup deleted successfully',
    });
  });

  getDashboardStats = asyncHandler(async (req: IAuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const stats = await pickupService.getDashboardStats(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Dashboard stats retrieved successfully',
      data: stats,
    });
  });
}
