export class CreateTripDTO {
  vehicleNumber: string;
  openingMeter: number;
  tripDate: Date;
}

export class CloseTripDTO {
  closingMeter: number;
}

export class TripDetailDTO {
  id: string;
  userId: string;
  vehicleNumber: string;
  tripDate: Date;
  openingMeter: number;
  closingMeter?: number;
  totalDistance?: number;
  openingMeterImagePath?: string;
  closingMeterImagePath?: string;
  createdAt: Date;
  updatedAt: Date;
}
