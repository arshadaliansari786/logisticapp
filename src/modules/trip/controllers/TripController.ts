import { Request, Response } from 'express';
import { TripService } from '../services/TripService';
import { asyncHandler } from '@common/middleware/errorMiddleware';
import { IAuthRequest } from '@common/middleware/authMiddleware';

const tripService = new TripService();

export class TripController {
  createTrip = asyncHandler(async (req: IAuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const openingMeterImagePath = req.file ? `/uploads/meter-images/${req.file.filename}` : undefined;
    const trip = await tripService.createTrip(req.user.id, req.body, openingMeterImagePath);

    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      data: trip,
    });
  });

  closeTrip = asyncHandler(async (req: IAuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const closingMeterImagePath = req.file ? `/uploads/meter-images/${req.file.filename}` : undefined;
    const trip = await tripService.closeTrip(req.user.id, req.params.tripId, req.body, closingMeterImagePath);

    res.status(200).json({
      success: true,
      message: 'Trip closed successfully',
      data: trip,
    });
  });

  getHistory = asyncHandler(async (req: IAuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await tripService.getTripHistory(req.user.id, page, limit);

    res.status(200).json({
      success: true,
      message: 'Trip history retrieved successfully',
      data: result,
    });
  });

  getTodayTrip = asyncHandler(async (req: IAuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const trip = await tripService.getTodayTrip(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Today trip retrieved successfully',
      data: trip,
    });
  });

  getTotalDistance = asyncHandler(async (req: IAuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const totalDistance = await tripService.getTotalDistanceToday(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Total distance calculated successfully',
      data: { totalDistance },
    });
  });
}
