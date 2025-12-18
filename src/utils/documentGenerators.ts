import { Document, Paragraph, TextRun, AlignmentType, HeadingLevel, Packer } from 'docx';
import { saveAs } from 'file-saver';
import { TenancyData, VehicleTransferData } from '@/types';
import { formatCurrency, numberToWords, calculateEndDate, formatDateWithOrdinal } from './formatters';

const witnessContact = (phone: string, include: boolean) => {
  if (!include || !phone || phone === 'N/A') return '';
  return ` (${phone})`;
};

const blankOrValue = (value: string) => value && value !== 'N/A' ? value : '____________________';

export const generateTenancyDocument = async (data: TenancyData): Promise<void> => {
  const endDate = calculateEndDate(data.startDate, data.durationValue, data.durationUnit);
  const durationText = `${data.durationValue} ${data.durationUnit.toLowerCase()}`;
  
  const perFreq = data.rentFrequency === 'Month' ? 'monthly' : 'yearly';
  const totalAmount = data.rentFrequency === 'Month' 
    ? data.rentAmount * (data.durationUnit === 'Years' ? data.durationValue * 12 : data.durationValue)
    : data.rentAmount * (data.durationUnit === 'Years' ? data.durationValue : data.durationValue / 12);

  const rentInWords = numberToWords(Math.round(data.rentAmount));
  const totalInWords = numberToWords(Math.round(totalAmount));

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [new TextRun({ text: "TENANCY AGREEMENT", bold: true, size: 32, font: "Times New Roman" })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: `This Tenancy Agreement is made on this ${formatDateWithOrdinal(data.dateOfAgreement)}, between ${data.landlordName || '________'}${witnessContact(data.landlordPhone, data.includePhoneNumbers)} (hereinafter the "${data.landlordTitle}") and ${data.tenantName || '________'}${witnessContact(data.tenantPhone, data.includePhoneNumbers)} (hereinafter the "Tenant").`,
            size: 24,
            font: "Times New Roman"
          })],
          spacing: { after: 300 }
        }),
        
        new Paragraph({
          children: [new TextRun({ text: "1. PROPERTY DESCRIPTION", bold: true, size: 24, font: "Times New Roman" })],
          spacing: { before: 300, after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: `The ${data.landlordTitle} agrees to let and the Tenant agrees to take the property described as: ${data.propertyType} located at ${data.propertyLocation || '________'}.`,
            size: 24,
            font: "Times New Roman"
          })],
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "2. TERM OF TENANCY", bold: true, size: 24, font: "Times New Roman" })],
          spacing: { before: 300, after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: `The term of this tenancy shall be for a period of ${durationText}, commencing from ${data.startDate} and ending on ${endDate}.`,
            size: 24,
            font: "Times New Roman"
          })],
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "3. RENT", bold: true, size: 24, font: "Times New Roman" })],
          spacing: { before: 300, after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: `The ${perFreq} rent for the property is ${formatCurrency(data.rentAmount)} (${rentInWords} Ghana Cedis). The total rent for the entire period is ${formatCurrency(totalAmount)} (${totalInWords} Ghana Cedis).`,
            size: 24,
            font: "Times New Roman"
          })],
          spacing: { after: 200 }
        }),

        ...(data.cautionFee > 0 ? [
          new Paragraph({
            children: [new TextRun({ text: "4. CAUTION FEE", bold: true, size: 24, font: "Times New Roman" })],
            spacing: { before: 300, after: 200 }
          }),
          new Paragraph({
            children: [new TextRun({ 
              text: `A refundable caution fee of ${formatCurrency(data.cautionFee)} (${numberToWords(Math.round(data.cautionFee))} Ghana Cedis) has been paid by the Tenant to the ${data.landlordTitle}.`,
              size: 24,
              font: "Times New Roman"
            })],
            spacing: { after: 200 }
          })
        ] : []),

        ...(data.customClauses.length > 0 ? [
          new Paragraph({
            children: [new TextRun({ text: `${data.cautionFee > 0 ? '5' : '4'}. ADDITIONAL TERMS`, bold: true, size: 24, font: "Times New Roman" })],
            spacing: { before: 300, after: 200 }
          }),
          ...data.customClauses.map((clause, index) => 
            new Paragraph({
              children: [new TextRun({ text: `${index + 1}. ${clause}`, size: 24, font: "Times New Roman" })],
              spacing: { after: 100 }
            })
          )
        ] : []),

        new Paragraph({
          children: [new TextRun({ text: "GOVERNING LAW", bold: true, size: 24, font: "Times New Roman" })],
          spacing: { before: 300, after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "This Agreement shall be governed by and construed in accordance with the Rent Act, 1963 (Act 220) and other applicable laws of the Republic of Ghana.",
            size: 24,
            font: "Times New Roman"
          })],
          spacing: { after: 300 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "SIGNATURES", bold: true, size: 24, font: "Times New Roman" })],
          spacing: { before: 400, after: 300 }
        }),
        
        new Paragraph({ children: [new TextRun({ text: data.landlordTitle.toUpperCase(), bold: true, size: 24, font: "Times New Roman" })] }),
        new Paragraph({ 
          children: [new TextRun({ text: `${blankOrValue(data.landlordName)}${witnessContact(data.landlordPhone, data.includePhoneNumbers)}`, size: 24, font: "Times New Roman" })],
          spacing: { after: 100 }
        }),
        new Paragraph({ children: [new TextRun({ text: "Signature: ........................................", size: 24, font: "Times New Roman" })], spacing: { after: 300 } }),

        new Paragraph({ children: [new TextRun({ text: "TENANT", bold: true, size: 24, font: "Times New Roman" })] }),
        new Paragraph({ 
          children: [new TextRun({ text: `${blankOrValue(data.tenantName)}${witnessContact(data.tenantPhone, data.includePhoneNumbers)}`, size: 24, font: "Times New Roman" })],
          spacing: { after: 100 }
        }),
        new Paragraph({ children: [new TextRun({ text: "Signature: ........................................", size: 24, font: "Times New Roman" })], spacing: { after: 300 } }),

        new Paragraph({ children: [new TextRun({ text: "WITNESSES", bold: true, size: 24, font: "Times New Roman" })], spacing: { before: 300, after: 200 } }),
        
        new Paragraph({ children: [new TextRun({ text: "Witness 1:", bold: true, size: 24, font: "Times New Roman" })] }),
        new Paragraph({ 
          children: [new TextRun({ text: `${blankOrValue(data.witness1Name)}${witnessContact(data.witness1Phone, data.includePhoneNumbers)}`, size: 24, font: "Times New Roman" })],
          spacing: { after: 100 }
        }),
        new Paragraph({ children: [new TextRun({ text: "Signature: ........................................", size: 24, font: "Times New Roman" })], spacing: { after: 200 } }),

        new Paragraph({ children: [new TextRun({ text: "Witness 2:", bold: true, size: 24, font: "Times New Roman" })] }),
        new Paragraph({ 
          children: [new TextRun({ text: `${blankOrValue(data.witness2Name)}${witnessContact(data.witness2Phone, data.includePhoneNumbers)}`, size: 24, font: "Times New Roman" })],
          spacing: { after: 100 }
        }),
        new Paragraph({ children: [new TextRun({ text: "Signature: ........................................", size: 24, font: "Times New Roman" })], spacing: { after: 200 } }),
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Tenancy_Agreement_${data.tenantName || 'Draft'}.docx`);
};

export const generateVehicleTransferDocument = async (data: VehicleTransferData): Promise<void> => {
  const totalInWords = numberToWords(Math.round(data.totalPrice));
  const paidInWords = numberToWords(Math.round(data.amountPaid));
  const balanceInWords = numberToWords(Math.round(data.outstandingBalance));
  const deadlineFormatted = data.paymentDeadline ? formatDateWithOrdinal(data.paymentDeadline).replace(' day of ', ' ') : '________';

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [new TextRun({ text: "VEHICLE TRANSFER AGREEMENT", bold: true, size: 32, font: "Times New Roman" })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: `This Vehicle Transfer Agreement is made on this ${formatDateWithOrdinal(data.dateOfAgreement)}, between ${data.sellerName || '________'} of ${data.sellerLocation || '________'} ("the Seller") and ${data.buyerName || '________'} of ${data.buyerLocation || '________'} ("the Buyer").`,
            size: 24,
            font: "Times New Roman"
          })],
          spacing: { after: 300 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "1. VEHICLE DETAILS", bold: true, size: 24, font: "Times New Roman" })],
          spacing: { before: 300, after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: `The Seller agrees to sell to the Buyer a ${data.vehicleColor || '________'} ${data.vehicleMake || '________'} ${data.vehicleModel || '________'} with registration number ${data.registrationNumber || '________'}. The Buyer confirms that he/she has inspected the vehicle and accepts it in its current condition.`,
            size: 24,
            font: "Times New Roman"
          })],
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "2. PURCHASE PRICE AND PAYMENT TERMS", bold: true, size: 24, font: "Times New Roman" })],
          spacing: { before: 300, after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: `The total agreed purchase price of the vehicle is ${formatCurrency(data.totalPrice)} (${totalInWords} Ghana Cedis). ${data.amountPaid > 0 ? `The Buyer has made a part payment of ${formatCurrency(data.amountPaid)} (${paidInWords} Ghana Cedis), leaving an outstanding balance of ${formatCurrency(data.outstandingBalance)} (${balanceInWords} Ghana Cedis). The Buyer agrees to pay the remaining amount by ${deadlineFormatted}.` : 'Payment shall be made in full upon signing of this Agreement.'}`,
            size: 24,
            font: "Times New Roman"
          })],
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "3. TRANSFER OF DOCUMENTS", bold: true, size: 24, font: "Times New Roman" })],
          spacing: { before: 300, after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: `The Seller shall hand over all relevant documents—including the registration certificate, insurance papers, and any other ownership documents—${data.outstandingBalance > 0 ? 'only after the Buyer has paid the outstanding balance in full.' : 'upon signing of this Agreement.'}`,
            size: 24,
            font: "Times New Roman"
          })],
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "4. OWNERSHIP AND RESPONSIBILITY", bold: true, size: 24, font: "Times New Roman" })],
          spacing: { before: 300, after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: `Full ownership and legal rights to the vehicle will transfer to the Buyer ${data.outstandingBalance > 0 ? 'only after complete payment of the total purchase price. Until then, the Seller remains the lawful owner of the vehicle.' : 'upon signing of this Agreement and receipt of full payment.'}`,
            size: 24,
            font: "Times New Roman"
          })],
          spacing: { after: 200 }
        }),

        ...(data.outstandingBalance > 0 ? [
          new Paragraph({
            children: [new TextRun({ text: "5. DEFAULT CLAUSE", bold: true, size: 24, font: "Times New Roman" })],
            spacing: { before: 300, after: 200 }
          }),
          new Paragraph({
            children: [new TextRun({ 
              text: "If the Buyer fails to pay the outstanding balance within the agreed period, the Seller reserves the right to withhold all vehicle documents and may take any lawful steps necessary to recover either the vehicle or the amount owed.",
              size: 24,
              font: "Times New Roman"
            })],
            spacing: { after: 200 }
          })
        ] : []),

        new Paragraph({
          children: [new TextRun({ text: "GOVERNING LAW", bold: true, size: 24, font: "Times New Roman" })],
          spacing: { before: 300, after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: "This Agreement shall be governed by the laws of the Republic of Ghana.",
            size: 24,
            font: "Times New Roman"
          })],
          spacing: { after: 300 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "SIGNATURES", bold: true, size: 24, font: "Times New Roman" })],
          spacing: { before: 400, after: 300 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Seller: ", bold: true, size: 24, font: "Times New Roman" }),
            new TextRun({ text: `${blankOrValue(data.sellerName)}${witnessContact(data.sellerPhone, data.includePhoneNumbers)}`, size: 24, font: "Times New Roman" }),
            new TextRun({ text: "  Buyer: ", bold: true, size: 24, font: "Times New Roman" }),
            new TextRun({ text: `${blankOrValue(data.buyerName)}${witnessContact(data.buyerPhone, data.includePhoneNumbers)}`, size: 24, font: "Times New Roman" })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Signature: ........................................    Signature: ........................................", size: 24, font: "Times New Roman" })
          ],
          spacing: { after: 300 }
        }),

        new Paragraph({ children: [new TextRun({ text: "WITNESSES:", bold: true, size: 24, font: "Times New Roman" })], spacing: { before: 300, after: 200 } }),
        
        new Paragraph({
          children: [
            new TextRun({ text: `${blankOrValue(data.witness1Name)}    ${blankOrValue(data.witness2Name)}`, size: 24, font: "Times New Roman" })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "……………………………………  ……………………………………", size: 24, font: "Times New Roman" })
          ],
          spacing: { after: 200 }
        }),
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Vehicle_Transfer_Agreement_${data.buyerName || 'Draft'}.docx`);
};
