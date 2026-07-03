export class UpdateProfileDTO {
  name?: string;
  mobile?: string;
  vehicleNumber?: string;
}

export class ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export class ProfileDetailDTO {
  id: string;
  name: string;
  email: string;
  mobile: string;
  vehicleNumber: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
}
