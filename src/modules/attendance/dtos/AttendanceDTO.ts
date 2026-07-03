export class CheckInDTO {
  latitude: number;
  longitude: number;
  address?: string;
}

export class CheckOutDTO {
  latitude: number;
  longitude: number;
  address?: string;
}

export class AttendanceDetailDTO {
  id: string;
  userId: string;
  checkInTime: Date;
  checkOutTime?: Date;
  checkInLatitude: number;
  checkInLongitude: number;
  checkOutLatitude?: number;
  checkOutLongitude?: number;
  checkInAddress?: string;
  checkOutAddress?: string;
  selfieImagePath?: string;
  createdAt: Date;
  updatedAt: Date;
}
