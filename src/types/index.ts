export enum PropertyType {
  SINGLE_ROOM = 'Single Room Self-Contained',
  CHAMBER_AND_HALL = 'Chamber and Hall Self-Contained',
  TWO_BEDROOM = 'Two Bedroom Apartment',
  THREE_BEDROOM = 'Three Bedroom House',
  STORE = 'Commercial Store',
  OTHER = 'Other'
}

export enum PaymentStatus {
  PAID_FULL = 'Paid in Full',
  PART_PAYMENT = 'Part Payment',
  NOT_PAID = 'Not Yet Paid'
}

export interface TenancyData {
  dateOfAgreement: string;
  landlordTitle: 'Landlord' | 'Landlady';
  landlordName: string;
  landlordPhone: string;
  tenantName: string;
  tenantPhone: string;
  propertyLocation: string;
  propertyType: PropertyType;
  propertyDetails: string;
  startDate: string;
  durationValue: number;
  durationUnit: string;
  rentAmount: number;
  rentFrequency: string;
  cautionFee: number;
  paymentStatus: PaymentStatus;
  paymentNote?: string;
  witness1Name: string;
  witness1Phone: string;
  witness2Name: string;
  witness2Phone: string;
  includePhoneNumbers: boolean;
  customClauses: string[];
}

export interface VehicleTransferData {
  dateOfAgreement: string;
  sellerName: string;
  sellerLocation: string;
  sellerPhone: string;
  buyerName: string;
  buyerLocation: string;
  buyerPhone: string;
  vehicleColor: string;
  vehicleMake: string;
  vehicleModel: string;
  registrationNumber: string;
  totalPrice: number;
  amountPaid: number;
  outstandingBalance: number;
  paymentDeadline: string;
  includePhoneNumbers: boolean;
  witness1Name: string;
  witness1Phone: string;
  witness2Name: string;
  witness2Phone: string;
}

export type DocumentType = 'tenancy' | 'vehicle-transfer';
