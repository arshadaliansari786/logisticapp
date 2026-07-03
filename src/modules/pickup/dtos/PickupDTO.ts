export class CreatePickupDTO {
  customerName: string;
  mobileNumber: string;
  pickupAddress: string;
  deliveryAddress: string;
  materialType: string;
  weight: number;
  deliveryDate: Date;
  remarks?: string;
}

export class UpdatePickupDTO {
  status?: string;
  remarks?: string;
}

export class PickupListDTO {
  id: string;
  pickupNumber: string;
  customerName: string;
  mobileNumber: string;
  status: string;
  deliveryDate: Date;
  createdAt: Date;
}

export class PickupDetailDTO {
  id: string;
  pickupNumber: string;
  customerName: string;
  mobileNumber: string;
  pickupAddress: string;
  deliveryAddress: string;
  materialType: string;
  weight: number;
  status: string;
  remarks?: string;
  pickupImagePath?: string;
  deliveryDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
