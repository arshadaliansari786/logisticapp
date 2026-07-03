import { AuthRepository } from '../repositories/AuthRepository';
import { AuthValidation } from '../dtos/AuthValidation';
import { AuthResponseDTO, LoginDTO, RegisterDTO, ForgotPasswordDTO, ResetPasswordDTO, RefreshTokenDTO } from '../dtos/AuthDTO';
import { PasswordUtil, TokenUtil, IdUtil, OTPUtil } from '@common/utils/commonUtils';
import { UnauthorizedError, NotFoundError, ConflictError } from '@common/exceptions/AppError';

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async login(loginData: LoginDTO): Promise<AuthResponseDTO> {
    const validatedData = await AuthValidation.validateLogin(loginData);

    const user = await this.authRepository.findUserByEmail(validatedData.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await PasswordUtil.compare(validatedData.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('User account is inactive');
    }

    const accessToken = TokenUtil.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = TokenUtil.generateRefreshToken({
      id: user.id,
    });

    const refreshTokenExpiryAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await this.authRepository.updateRefreshToken(user.id, refreshToken, refreshTokenExpiryAt);
    await this.authRepository.updateLastLogin(user.id);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      accessToken,
      refreshToken,
      expiresIn: '7d',
    };
  }

  async register(registerData: RegisterDTO): Promise<AuthResponseDTO> {
    const validatedData = await AuthValidation.validateRegister(registerData);

    const existingUser = await this.authRepository.findUserByEmail(validatedData.email);
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    const existingMobile = await this.authRepository.findUserByMobile(validatedData.mobile);
    if (existingMobile) {
      throw new ConflictError('Mobile number already registered');
    }

    const passwordHash = await PasswordUtil.hash(validatedData.password);

    const user = await this.authRepository.createUser({
      name: validatedData.name,
      email: validatedData.email,
      mobile: validatedData.mobile,
      passwordHash,
      vehicleNumber: validatedData.vehicleNumber,
    });

    const accessToken = TokenUtil.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = TokenUtil.generateRefreshToken({
      id: user.id,
    });

    const refreshTokenExpiryAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await this.authRepository.updateRefreshToken(user.id, refreshToken, refreshTokenExpiryAt);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      accessToken,
      refreshToken,
      expiresIn: '7d',
    };
  }

  async forgotPassword(forgotData: ForgotPasswordDTO): Promise<{ message: string; otp: string }> {
    const validatedData = await AuthValidation.validateForgotPassword(forgotData);

    const user = await this.authRepository.findUserByEmail(validatedData.email);
    if (!user) {
      // Don't expose whether user exists
      return { message: 'If an account with that email exists, an OTP will be sent', otp: '' };
    }

    const otp = OTPUtil.generateOTP();

    // TODO: Implement OTP sending via email (using Nodemailer or similar)
    console.log(`OTP for ${validatedData.email}: ${otp}`);

    return { message: 'OTP sent to email', otp };
  }

  async verifyOTP(verifyData: any): Promise<{ message: string; verified: boolean }> {
    const validatedData = await AuthValidation.validateVerifyOTP(verifyData);

    // TODO: Verify OTP from database/cache
    // This is a placeholder implementation

    return { message: 'OTP verified successfully', verified: true };
  }

  async resetPassword(resetData: ResetPasswordDTO): Promise<{ message: string }> {
    const validatedData = await AuthValidation.validateResetPassword(resetData);

    const user = await this.authRepository.findUserByEmail(validatedData.email);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // TODO: Verify OTP before resetting password

    const passwordHash = await PasswordUtil.hash(validatedData.newPassword);

    // Update password in database
    // await this.authRepository.updatePassword(user.id, passwordHash);

    return { message: 'Password reset successfully' };
  }

  async refreshToken(refreshData: RefreshTokenDTO): Promise<{ accessToken: string; expiresIn: string }> {
    const validatedData = await AuthValidation.validateRefreshToken(refreshData);

    try {
      const decoded = TokenUtil.verifyRefreshToken(validatedData.refreshToken);
      const user = await this.authRepository.findUserById(decoded.id);

      if (!user || user.refreshToken !== validatedData.refreshToken) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      if (user.refreshTokenExpiryAt && user.refreshTokenExpiryAt < new Date()) {
        throw new UnauthorizedError('Refresh token expired');
      }

      const accessToken = TokenUtil.generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        accessToken,
        expiresIn: '7d',
      };
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  async logout(userId: string): Promise<{ message: string }> {
    await this.authRepository.clearRefreshToken(userId);
    return { message: 'Logged out successfully' };
  }
}
