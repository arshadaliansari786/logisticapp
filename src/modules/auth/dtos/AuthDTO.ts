export class LoginDTO {
  email: string;
  password: string;
}

export class RegisterDTO {
  name: string;
  email: string;
  mobile: string;
  password: string;
  vehicleNumber: string;
}

export class ForgotPasswordDTO {
  email: string;
}

export class VerifyOTPDTO {
  email: string;
  otp: string;
}

export class ResetPasswordDTO {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export class RefreshTokenDTO {
  refreshToken: string;
}

export class AuthResponseDTO {
  id: string;
  email: string;
  name: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}
