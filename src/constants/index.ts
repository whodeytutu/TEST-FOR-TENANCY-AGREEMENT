import { TenancyData, PropertyType, PaymentStatus, VehicleTransferData } from '@/types';

export const INITIAL_TENANCY_DATA: TenancyData = {
  dateOfAgreement: new Date().toISOString().split('T')[0],
  landlordTitle: 'Landlord',
  landlordName: '',
  landlordPhone: '',
  tenantName: '',
  tenantPhone: '',
  propertyLocation: '',
  propertyType: PropertyType.SINGLE_ROOM,
  propertyDetails: 'A residential dwelling comprising of...',
  startDate: new Date().toISOString().split('T')[0],
  durationValue: 1,
  durationUnit: 'Years',
  rentAmount: 0,
  rentFrequency: 'Year',
  cautionFee: 0,
  paymentStatus: PaymentStatus.PAID_FULL,
  paymentNote: '',
  witness1Name: '',
  witness1Phone: '',
  witness2Name: '',
  witness2Phone: '',
  includePhoneNumbers: true,
  customClauses: []
};

export const INITIAL_VEHICLE_DATA: VehicleTransferData = {
  dateOfAgreement: new Date().toISOString().split('T')[0],
  sellerName: '',
  sellerLocation: '',
  sellerPhone: '',
  buyerName: '',
  buyerLocation: '',
  buyerPhone: '',
  vehicleColor: '',
  vehicleMake: '',
  vehicleModel: '',
  registrationNumber: '',
  totalPrice: 0,
  amountPaid: 0,
  outstandingBalance: 0,
  paymentDeadline: '',
  includePhoneNumbers: true,
  witness1Name: '',
  witness1Phone: '',
  witness2Name: '',
  witness2Phone: '',
};

export const OFFLINE_CLAUSES = {
  "Restrictions & Rules": [
    "The Tenant shall not keep any pets (dogs, cats, or other animals) on the premises.",
    "No loud music or noise that disturbs other neighbors is permitted after 10 PM.",
    "Smoking is strictly prohibited inside the rooms or indoor common areas.",
    "The Tenant shall not conduct any religious services or commercial business on the premises."
  ],
  "Maintenance & Repairs": [
    "The Tenant is responsible for the repair/replacement of all electrical bulbs, switches, and sockets damaged during the tenancy.",
    "The Tenant shall maintain the garden/compound and keep it tidy at all times.",
    "Any blockage of drains or sewage caused by the Tenant's negligence shall be cleared at the Tenant's cost.",
    "The Tenant shall replace any broken window panes or glass caused by their actions."
  ],
  "Utilities & Bills": [
    "The Tenant agrees to pay a fixed monthly service fee of GH₵ 100 for water and sanitation.",
    "Electricity is shared; the Tenant shall pay 50% of the total monthly bill presented by the Landlord.",
    "The Tenant is responsible for purchasing their own prepaid electricity credits for their separate meter.",
    "The Tenant shall pay for waste collection services directly to the service provider."
  ],
  "Termination & Security": [
    "The Landlord reserves the right to inspect the premises with 24 hours prior notice to the Tenant.",
    "The Tenant must return all keys to the Landlord immediately upon vacating the premises.",
    "The Tenant is responsible for the security of their own personal belongings; the Landlord is not liable for theft."
  ]
};

export const TENANCY_STEPS = [
  { title: 'Parties', description: 'Landlord and tenant details' },
  { title: 'Property', description: 'Property information' },
  { title: 'Terms', description: 'Rent and duration' },
  { title: 'Clauses', description: 'Additional conditions' },
  { title: 'Witnesses', description: 'Final details' }
];

export const VEHICLE_STEPS = [
  { title: 'Parties', description: 'Seller and buyer details' },
  { title: 'Vehicle', description: 'Vehicle information' },
  { title: 'Payment', description: 'Price and payment terms' },
  { title: 'Witnesses', description: 'Witness details' },
  { title: 'Review', description: 'Final review' }
];
