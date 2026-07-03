export class UpdateDeliveryDTO {
  status: string;
  remarks?: string;
}

export class DeliveryDetailDTO {
  id: string;
  deliveryNumber: string;
  pickupId: string;
  status: string;
  remarks?: string;
  deliveryImagePath?: string;
  signatureImagePath?: string;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
