import html2pdf from 'html2pdf.js';
import { TenancyData, VehicleTransferData } from '@/types';
import { formatCurrency, numberToWords, calculateEndDate, formatDateWithOrdinal } from './formatters';

const witnessContact = (phone: string, include: boolean) => {
  if (!include || !phone || phone === 'N/A') return '';
  return ` (${phone})`;
};

const blankOrValue = (value: string) => value && value !== 'N/A' ? value : '____________________';

const createPrintableHTML = (content: string, title: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        @page {
          size: A4;
          margin: 15mm;
        }
        body {
          font-family: "Times New Roman", Times, serif;
          font-size: 11pt;
          line-height: 1.5;
          max-width: 100%;
          margin: 0;
          padding: 0;
        }
        h1 {
          text-align: center;
          font-size: 14pt;
          font-weight: bold;
          margin-bottom: 20px;
        }
        h2 {
          font-size: 11pt;
          font-weight: bold;
          margin-top: 15px;
          margin-bottom: 8px;
        }
        p {
          margin-bottom: 10px;
          text-align: justify;
        }
        .signature-section {
          margin-top: 30px;
        }
        .signature-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .signature-block {
          margin-bottom: 15px;
        }
        .signature-name {
          font-weight: bold;
          margin-bottom: 2px;
        }
        .signature-contact {
          margin-bottom: 2px;
        }
        .signature-dots {
          margin-top: 15px;
          border-bottom: 1px dotted #000;
          width: 150px;
        }
        .clause-item {
          margin-bottom: 6px;
        }
        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `;
};

export const generateTenancyHTML = (data: TenancyData): string => {
  const endDate = calculateEndDate(data.startDate, data.durationValue, data.durationUnit);
  const durationText = `${data.durationValue} ${data.durationUnit.toLowerCase()}`;
  
  const perFreq = data.rentFrequency === 'Month' ? 'monthly' : 'yearly';
  const totalAmount = data.rentFrequency === 'Month' 
    ? data.rentAmount * (data.durationUnit === 'Years' ? data.durationValue * 12 : data.durationValue)
    : data.rentAmount * (data.durationUnit === 'Years' ? data.durationValue : data.durationValue / 12);

  const rentInWords = numberToWords(Math.round(data.rentAmount));
  const totalInWords = numberToWords(Math.round(totalAmount));

  let clauseNumber = data.cautionFee > 0 ? 5 : 4;

  const customClausesHTML = data.customClauses.length > 0 
    ? `<h2>${clauseNumber}. ADDITIONAL TERMS</h2>
       ${data.customClauses.map((clause, index) => 
         `<p class="clause-item">${index + 1}. ${clause}</p>`
       ).join('')}`
    : '';

  const content = `
    <h1>TENANCY AGREEMENT</h1>
    
    <p>This Tenancy Agreement is made on this ${formatDateWithOrdinal(data.dateOfAgreement)}, between ${data.landlordName || '________'}${witnessContact(data.landlordPhone, data.includePhoneNumbers)} (hereinafter the "${data.landlordTitle}") and ${data.tenantName || '________'}${witnessContact(data.tenantPhone, data.includePhoneNumbers)} (hereinafter the "Tenant").</p>
    
    <h2>1. PROPERTY DESCRIPTION</h2>
    <p>The ${data.landlordTitle} agrees to let and the Tenant agrees to take the property described as: ${data.propertyType} located at ${data.propertyLocation || '________'}.</p>
    
    <h2>2. TERM OF TENANCY</h2>
    <p>The term of this tenancy shall be for a period of ${durationText}, commencing from ${data.startDate} and ending on ${endDate}.</p>
    
    <h2>3. RENT</h2>
    <p>The ${perFreq} rent for the property is ${formatCurrency(data.rentAmount)} (${rentInWords} Ghana Cedis). The total rent for the entire period is ${formatCurrency(totalAmount)} (${totalInWords} Ghana Cedis).</p>
    
    ${data.cautionFee > 0 ? `
      <h2>4. CAUTION FEE</h2>
      <p>A refundable caution fee of ${formatCurrency(data.cautionFee)} (${numberToWords(Math.round(data.cautionFee))} Ghana Cedis) has been paid by the Tenant to the ${data.landlordTitle}.</p>
    ` : ''}
    
    ${customClausesHTML}
    
    <h2>GOVERNING LAW</h2>
    <p>This Agreement shall be governed by and construed in accordance with the Rent Act, 1963 (Act 220) and other applicable laws of the Republic of Ghana.</p>
    
    <div class="signature-section">
      <h2>SIGNATURES</h2>
      <div class="signature-grid">
        <div class="signature-block">
          <p class="signature-name">${data.landlordTitle.toUpperCase()}</p>
          <p class="signature-contact">${blankOrValue(data.landlordName)}${witnessContact(data.landlordPhone, data.includePhoneNumbers)}</p>
          <div class="signature-dots"></div>
        </div>
        <div class="signature-block">
          <p class="signature-name">TENANT</p>
          <p class="signature-contact">${blankOrValue(data.tenantName)}${witnessContact(data.tenantPhone, data.includePhoneNumbers)}</p>
          <div class="signature-dots"></div>
        </div>
      </div>
      
      <h2>WITNESSES</h2>
      <div class="signature-grid">
        <div class="signature-block">
          <p class="signature-name">${blankOrValue(data.witness1Name).toUpperCase()}</p>
          <p class="signature-contact">${witnessContact(data.witness1Phone, data.includePhoneNumbers)}</p>
          <div class="signature-dots"></div>
        </div>
        <div class="signature-block">
          <p class="signature-name">${blankOrValue(data.witness2Name).toUpperCase()}</p>
          <p class="signature-contact">${witnessContact(data.witness2Phone, data.includePhoneNumbers)}</p>
          <div class="signature-dots"></div>
        </div>
      </div>
    </div>
  `;

  return createPrintableHTML(content, 'Tenancy Agreement');
};

export const generateVehicleTransferHTML = (data: VehicleTransferData): string => {
  const totalInWords = numberToWords(Math.round(data.totalPrice));
  const paidInWords = numberToWords(Math.round(data.amountPaid));
  const balanceInWords = numberToWords(Math.round(data.outstandingBalance));
  const deadlineFormatted = data.paymentDeadline ? formatDateWithOrdinal(data.paymentDeadline).replace(' day of ', ' ') : '________';

  const content = `
    <h1>VEHICLE TRANSFER AGREEMENT</h1>
    
    <p>This Vehicle Transfer Agreement is made on this ${formatDateWithOrdinal(data.dateOfAgreement)}, between ${data.sellerName || '________'} of ${data.sellerLocation || '________'} ("the Seller") and ${data.buyerName || '________'} of ${data.buyerLocation || '________'} ("the Buyer").</p>
    
    <h2>1. VEHICLE DETAILS</h2>
    <p>The Seller agrees to sell to the Buyer a ${data.vehicleColor || '________'} ${data.vehicleMake || '________'} ${data.vehicleModel || '________'} with registration number ${data.registrationNumber || '________'}. The Buyer confirms that he/she has inspected the vehicle and accepts it in its current condition.</p>
    
    <h2>2. PURCHASE PRICE AND PAYMENT TERMS</h2>
    <p>The total agreed purchase price of the vehicle is ${formatCurrency(data.totalPrice)} (${totalInWords} Ghana Cedis). ${data.amountPaid > 0 ? `The Buyer has made a part payment of ${formatCurrency(data.amountPaid)} (${paidInWords} Ghana Cedis), leaving an outstanding balance of ${formatCurrency(data.outstandingBalance)} (${balanceInWords} Ghana Cedis). The Buyer agrees to pay the remaining amount by ${deadlineFormatted}.` : 'Payment shall be made in full upon signing of this Agreement.'}</p>
    
    <h2>3. TRANSFER OF DOCUMENTS</h2>
    <p>The Seller shall hand over all relevant documents—including the registration certificate, insurance papers, and any other ownership documents—${data.outstandingBalance > 0 ? 'only after the Buyer has paid the outstanding balance in full.' : 'upon signing of this Agreement.'}</p>
    
    <h2>4. OWNERSHIP AND RESPONSIBILITY</h2>
    <p>Full ownership and legal rights to the vehicle will transfer to the Buyer ${data.outstandingBalance > 0 ? 'only after complete payment of the total purchase price. Until then, the Seller remains the lawful owner of the vehicle.' : 'upon signing of this Agreement and receipt of full payment.'}</p>
    
    ${data.outstandingBalance > 0 ? `
      <h2>5. DEFAULT CLAUSE</h2>
      <p>If the Buyer fails to pay the outstanding balance within the agreed period, the Seller reserves the right to withhold all vehicle documents and may take any lawful steps necessary to recover either the vehicle or the amount owed.</p>
    ` : ''}
    
    <h2>GOVERNING LAW</h2>
    <p>This Agreement shall be governed by the laws of the Republic of Ghana.</p>
    
    <div class="signature-section">
      <h2>SIGNATURES</h2>
      <div class="signature-grid">
        <div class="signature-block">
          <p class="signature-name">Seller: ${blankOrValue(data.sellerName)}${witnessContact(data.sellerPhone, data.includePhoneNumbers)}</p>
          <p>Signature: ........................................</p>
        </div>
        <div class="signature-block">
          <p class="signature-name">Buyer: ${blankOrValue(data.buyerName)}${witnessContact(data.buyerPhone, data.includePhoneNumbers)}</p>
          <p>Signature: ........................................</p>
        </div>
      </div>
      
      <h2>WITNESSES</h2>
      <div class="signature-grid">
        <div class="signature-block">
          <p class="signature-name">${blankOrValue(data.witness1Name)}</p>
          <p>……………………………………</p>
        </div>
        <div class="signature-block">
          <p class="signature-name">${blankOrValue(data.witness2Name)}</p>
          <p>……………………………………</p>
        </div>
      </div>
    </div>
  `;

  return createPrintableHTML(content, 'Vehicle Transfer Agreement');
};

export const generatePDF = async (html: string, filename: string): Promise<void> => {
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);

  const options = {
    margin: 10,
    filename: `${filename}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  try {
    await html2pdf().set(options).from(container).save();
  } finally {
    document.body.removeChild(container);
  }
};

export const printDocument = (html: string): void => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  } else {
    // Fallback if popup is blocked - print in current window
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);
    
    const iframeDoc = iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.write(html);
      iframeDoc.close();
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    }
    
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }
};
