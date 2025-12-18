import React from 'react';
import { TenancyData, VehicleTransferData } from '@/types';
import { formatCurrency, numberToWords, calculateEndDate, formatDateWithOrdinal } from '@/utils/formatters';

interface DocumentPreviewProps {
  type: 'tenancy' | 'vehicle';
  data: TenancyData | VehicleTransferData;
}

const witnessContact = (phone: string, include: boolean) => {
  if (!include || !phone || phone === 'N/A') return '';
  return ` (${phone})`;
};

const blankOrValue = (value: string) => value && value !== 'N/A' ? value : '____________________';

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ type, data }) => {
  if (type === 'tenancy') {
    const tenancyData = data as TenancyData;
    return <TenancyPreview data={tenancyData} />;
  }
  
  const vehicleData = data as VehicleTransferData;
  return <VehiclePreview data={vehicleData} />;
};

const TenancyPreview: React.FC<{ data: TenancyData }> = ({ data }) => {
  const endDate = calculateEndDate(data.startDate, data.durationValue, data.durationUnit);
  const durationText = `${data.durationValue} ${data.durationUnit.toLowerCase()}`;
  const perFreq = data.rentFrequency === 'Month' ? 'monthly' : 'yearly';
  const totalAmount = data.rentFrequency === 'Month' 
    ? data.rentAmount * (data.durationUnit === 'Years' ? data.durationValue * 12 : data.durationValue)
    : data.rentAmount * (data.durationUnit === 'Years' ? data.durationValue : data.durationValue / 12);
  const rentInWords = numberToWords(Math.round(data.rentAmount));
  const totalInWords = numberToWords(Math.round(totalAmount));
  let clauseNumber = data.cautionFee > 0 ? 5 : 4;

  return (
    <div className="bg-white text-black font-serif text-[10px] leading-relaxed p-6 w-full aspect-[1/1.414] overflow-auto shadow-lg border">
      <h1 className="text-center font-bold text-sm mb-4">TENANCY AGREEMENT</h1>
      
      <p className="mb-3 text-justify">
        This Tenancy Agreement is made on this {formatDateWithOrdinal(data.dateOfAgreement)}, between {data.landlordName || '________'}{witnessContact(data.landlordPhone, data.includePhoneNumbers)} (hereinafter the "{data.landlordTitle}") and {data.tenantName || '________'}{witnessContact(data.tenantPhone, data.includePhoneNumbers)} (hereinafter the "Tenant").
      </p>
      
      <h2 className="font-bold text-[10px] mt-3 mb-1">1. PROPERTY DESCRIPTION</h2>
      <p className="mb-3 text-justify">
        The {data.landlordTitle} agrees to let and the Tenant agrees to take the property described as: {data.propertyType} located at {data.propertyLocation || '________'}.
      </p>
      
      <h2 className="font-bold text-[10px] mt-3 mb-1">2. TERM OF TENANCY</h2>
      <p className="mb-3 text-justify">
        The term of this tenancy shall be for a period of {durationText}, commencing from {data.startDate} and ending on {endDate}.
      </p>
      
      <h2 className="font-bold text-[10px] mt-3 mb-1">3. RENT</h2>
      <p className="mb-3 text-justify">
        The {perFreq} rent for the property is {formatCurrency(data.rentAmount)} ({rentInWords} Ghana Cedis). The total rent for the entire period is {formatCurrency(totalAmount)} ({totalInWords} Ghana Cedis).
      </p>
      
      {data.cautionFee > 0 && (
        <>
          <h2 className="font-bold text-[10px] mt-3 mb-1">4. CAUTION FEE</h2>
          <p className="mb-3 text-justify">
            A refundable caution fee of {formatCurrency(data.cautionFee)} ({numberToWords(Math.round(data.cautionFee))} Ghana Cedis) has been paid by the Tenant to the {data.landlordTitle}.
          </p>
        </>
      )}
      
      {data.customClauses.length > 0 && (
        <>
          <h2 className="font-bold text-[10px] mt-3 mb-1">{clauseNumber}. ADDITIONAL TERMS</h2>
          {data.customClauses.map((clause, index) => (
            <p key={index} className="mb-1 text-justify">{index + 1}. {clause}</p>
          ))}
        </>
      )}
      
      <h2 className="font-bold text-[10px] mt-3 mb-1">GOVERNING LAW</h2>
      <p className="mb-3 text-justify">
        This Agreement shall be governed by and construed in accordance with the Rent Act, 1963 (Act 220) and other applicable laws of the Republic of Ghana.
      </p>
      
      {/* Signatures - Two Column Layout */}
      <div className="mt-6">
        <h2 className="font-bold text-[10px] mb-2">SIGNATURES</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-bold text-[9px]">{data.landlordTitle.toUpperCase()}</p>
            <p className="text-[9px]">{blankOrValue(data.landlordName)}{witnessContact(data.landlordPhone, data.includePhoneNumbers)}</p>
            <p className="mt-4 border-b border-dotted border-black w-32"></p>
          </div>
          <div>
            <p className="font-bold text-[9px]">TENANT</p>
            <p className="text-[9px]">{blankOrValue(data.tenantName)}{witnessContact(data.tenantPhone, data.includePhoneNumbers)}</p>
            <p className="mt-4 border-b border-dotted border-black w-32"></p>
          </div>
        </div>
        
        <h2 className="font-bold text-[10px] mt-4 mb-2">WITNESSES</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-bold text-[9px]">{blankOrValue(data.witness1Name).toUpperCase()}</p>
            <p className="text-[9px]">{witnessContact(data.witness1Phone, data.includePhoneNumbers)}</p>
            <p className="mt-4 border-b border-dotted border-black w-32"></p>
          </div>
          <div>
            <p className="font-bold text-[9px]">{blankOrValue(data.witness2Name).toUpperCase()}</p>
            <p className="text-[9px]">{witnessContact(data.witness2Phone, data.includePhoneNumbers)}</p>
            <p className="mt-4 border-b border-dotted border-black w-32"></p>
          </div>
        </div>
      </div>
    </div>
  );
};

const VehiclePreview: React.FC<{ data: VehicleTransferData }> = ({ data }) => {
  const totalInWords = numberToWords(Math.round(data.totalPrice));
  const paidInWords = numberToWords(Math.round(data.amountPaid));
  const balanceInWords = numberToWords(Math.round(data.outstandingBalance));
  const deadlineFormatted = data.paymentDeadline ? formatDateWithOrdinal(data.paymentDeadline).replace(' day of ', ' ') : '________';

  return (
    <div className="bg-white text-black font-serif text-[10px] leading-relaxed p-6 w-full aspect-[1/1.414] overflow-auto shadow-lg border">
      <h1 className="text-center font-bold text-sm mb-4">VEHICLE TRANSFER AGREEMENT</h1>
      
      <p className="mb-3 text-justify">
        This Vehicle Transfer Agreement is made on this {formatDateWithOrdinal(data.dateOfAgreement)}, between {data.sellerName || '________'} of {data.sellerLocation || '________'} ("the Seller") and {data.buyerName || '________'} of {data.buyerLocation || '________'} ("the Buyer").
      </p>
      
      <h2 className="font-bold text-[10px] mt-3 mb-1">1. VEHICLE DETAILS</h2>
      <p className="mb-3 text-justify">
        The Seller agrees to sell to the Buyer a {data.vehicleColor || '________'} {data.vehicleMake || '________'} {data.vehicleModel || '________'} with registration number {data.registrationNumber || '________'}. The Buyer confirms that he/she has inspected the vehicle and accepts it in its current condition.
      </p>
      
      <h2 className="font-bold text-[10px] mt-3 mb-1">2. PURCHASE PRICE AND PAYMENT TERMS</h2>
      <p className="mb-3 text-justify">
        The total agreed purchase price of the vehicle is {formatCurrency(data.totalPrice)} ({totalInWords} Ghana Cedis). {data.amountPaid > 0 ? `The Buyer has made a part payment of ${formatCurrency(data.amountPaid)} (${paidInWords} Ghana Cedis), leaving an outstanding balance of ${formatCurrency(data.outstandingBalance)} (${balanceInWords} Ghana Cedis). The Buyer agrees to pay the remaining amount by ${deadlineFormatted}.` : 'Payment shall be made in full upon signing of this Agreement.'}
      </p>
      
      <h2 className="font-bold text-[10px] mt-3 mb-1">3. TRANSFER OF DOCUMENTS</h2>
      <p className="mb-3 text-justify">
        The Seller shall hand over all relevant documents—including the registration certificate, insurance papers, and any other ownership documents—{data.outstandingBalance > 0 ? 'only after the Buyer has paid the outstanding balance in full.' : 'upon signing of this Agreement.'}
      </p>
      
      <h2 className="font-bold text-[10px] mt-3 mb-1">4. OWNERSHIP AND RESPONSIBILITY</h2>
      <p className="mb-3 text-justify">
        Full ownership and legal rights to the vehicle will transfer to the Buyer {data.outstandingBalance > 0 ? 'only after complete payment of the total purchase price. Until then, the Seller remains the lawful owner of the vehicle.' : 'upon signing of this Agreement and receipt of full payment.'}
      </p>
      
      {data.outstandingBalance > 0 && (
        <>
          <h2 className="font-bold text-[10px] mt-3 mb-1">5. DEFAULT CLAUSE</h2>
          <p className="mb-3 text-justify">
            If the Buyer fails to pay the outstanding balance within the agreed period, the Seller reserves the right to withhold all vehicle documents and may take any lawful steps necessary to recover either the vehicle or the amount owed.
          </p>
        </>
      )}
      
      <h2 className="font-bold text-[10px] mt-3 mb-1">GOVERNING LAW</h2>
      <p className="mb-3 text-justify">
        This Agreement shall be governed by the laws of the Republic of Ghana.
      </p>
      
      {/* Signatures - Two Column Layout */}
      <div className="mt-6">
        <h2 className="font-bold text-[10px] mb-2">SIGNATURES</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[9px]">Seller: {blankOrValue(data.sellerName)}{witnessContact(data.sellerPhone, data.includePhoneNumbers)}</p>
            <p className="text-[9px]">Signature: ........................................</p>
          </div>
          <div>
            <p className="text-[9px]">Buyer: {blankOrValue(data.buyerName)}{witnessContact(data.buyerPhone, data.includePhoneNumbers)}</p>
            <p className="text-[9px]">Signature: ........................................</p>
          </div>
        </div>
        
        <h2 className="font-bold text-[10px] mt-4 mb-2">WITNESSES:</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[9px]">{blankOrValue(data.witness1Name)}</p>
            <p className="text-[9px]">……………………………………</p>
          </div>
          <div>
            <p className="text-[9px]">{blankOrValue(data.witness2Name)}</p>
            <p className="text-[9px]">……………………………………</p>
          </div>
        </div>
      </div>
    </div>
  );
};
