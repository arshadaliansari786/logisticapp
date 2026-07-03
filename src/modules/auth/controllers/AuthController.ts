import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { asyncHandler } from '@common/middleware/errorMiddleware';
import { IAuthRequest } from '@common/middleware/authMiddleware';

const authService = new AuthService();

export class AuthController {
  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  });

  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: result,
    });
  });

  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.forgotPassword(req.body);
    res.status(200).json({
      success: true,
      message: result.message,
      data: { email: req.body.email },
    });
  });

  verifyOTP = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.verifyOTP(req.body);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  });

  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.resetPassword(req.body);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  });

  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.refreshToken(req.body);
    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: result,
    });
  });

  logout = asyncHandler(async (req: IAuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const result = await authService.logout(req.user.id);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  });
}
