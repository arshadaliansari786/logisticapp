import { Request, Response } from 'express';
import { ProfileService } from '../services/ProfileService';
import { asyncHandler } from '@common/middleware/errorMiddleware';
import { IAuthRequest } from '@common/middleware/authMiddleware';

const profileService = new ProfileService();

export class ProfileController {
  getProfile = asyncHandler(async (req: IAuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const profile = await profileService.getProfile(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: profile,
    });
  });

  updateProfile = asyncHandler(async (req: IAuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const profile = await profileService.updateProfile(req.user.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: profile,
    });
  });

  changePassword = asyncHandler(async (req: IAuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const result = await profileService.changePassword(req.user.id, req.body);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  });
}
