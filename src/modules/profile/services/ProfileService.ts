import { ProfileRepository } from '../repositories/ProfileRepository';
import { UpdateProfileDTO, ChangePasswordDTO } from '../dtos/ProfileDTO';
import { ProfileValidation } from '../dtos/ProfileValidation';
import { NotFoundError, UnauthorizedError } from '@common/exceptions/AppError';
import { PasswordUtil } from '@common/utils/commonUtils';

export class ProfileService {
  private profileRepository: ProfileRepository;

  constructor() {
    this.profileRepository = new ProfileRepository();
  }

  async getProfile(userId: string) {
    const profile = await this.profileRepository.findById(userId);
    if (!profile) {
      throw new NotFoundError('User profile not found');
    }
    return profile;
  }

  async updateProfile(userId: string, updateData: UpdateProfileDTO) {
    await this.getProfile(userId);

    const validatedData = await ProfileValidation.validateUpdate(updateData);

    const profile = await this.profileRepository.update(userId, validatedData);
    return profile;
  }

  async changePassword(userId: string, changePasswordData: ChangePasswordDTO) {
    const user = await this.profileRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const validatedData = await ProfileValidation.validateChangePassword(changePasswordData);

    const userWithPassword = await this.profileRepository.findByEmail(user.email);
    if (!userWithPassword) {
      throw new NotFoundError('User not found');
    }

    const isPasswordValid = await PasswordUtil.compare(
      validatedData.currentPassword,
      userWithPassword.passwordHash
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    const newPasswordHash = await PasswordUtil.hash(validatedData.newPassword);
    await this.profileRepository.updatePassword(userId, newPasswordHash);

    return { message: 'Password changed successfully' };
  }
}
