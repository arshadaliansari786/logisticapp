import { Request, Response } from 'express';
import { AttendanceService } from '../services/AttendanceService';
import { asyncHandler } from '@common/middleware/errorMiddleware';
import { IAuthRequest } from '@common/middleware/authMiddleware';

const attendanceService = new AttendanceService();

export class AttendanceController {
  checkIn = asyncHandler(async (req: IAuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const selfieImagePath = req.file ? `/uploads/attendance-selfies/${req.file.filename}` : undefined;
    const attendance = await attendanceService.checkIn(req.user.id, req.body, selfieImagePath);

    res.status(201).json({
      success: true,
      message: 'Check-in successful',
      data: attendance,
    });
  });

  checkOut = asyncHandler(async (req: IAuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const attendance = await attendanceService.checkOut(req.user.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Check-out successful',
      data: attendance,
    });
  });

  getHistory = asyncHandler(async (req: IAuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await attendanceService.getAttendanceHistory(req.user.id, page, limit);

    res.status(200).json({
      success: true,
      message: 'Attendance history retrieved successfully',
      data: result,
    });
  });

  getTodayStatus = asyncHandler(async (req: IAuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const status = await attendanceService.getTodayStatus(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Today status retrieved successfully',
      data: status,
    });
  });
}
