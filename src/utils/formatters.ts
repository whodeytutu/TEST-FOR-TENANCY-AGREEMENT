export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2
  }).format(amount).replace('GHS', 'GH₵');
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const calculateEndDate = (startDate: string, duration: number, unit: string): string => {
  if (!startDate) return '';
  try {
    const date = new Date(startDate);
    if (isNaN(date.getTime())) return '';
    if (unit === 'Years') {
      date.setFullYear(date.getFullYear() + duration);
    } else if (unit === 'Months') {
      date.setMonth(date.getMonth() + duration);
    }
    date.setDate(date.getDate() - 1);
    return formatDate(date.toISOString().split('T')[0]);
  } catch {
    return '';
  }
};

export const numberToWords = (num: number): string => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 
                'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if (num === 0) return 'Zero';
  if (num < 0) return 'Negative ' + numberToWords(Math.abs(num));
  
  let words = '';
  
  if (Math.floor(num / 1000000) > 0) {
    words += numberToWords(Math.floor(num / 1000000)) + ' Million ';
    num %= 1000000;
  }
  
  if (Math.floor(num / 1000) > 0) {
    words += numberToWords(Math.floor(num / 1000)) + ' Thousand ';
    num %= 1000;
  }
  
  if (Math.floor(num / 100) > 0) {
    words += ones[Math.floor(num / 100)] + ' Hundred ';
    num %= 100;
  }
  
  if (num > 0) {
    if (num < 20) {
      words += ones[num];
    } else {
      words += tens[Math.floor(num / 10)];
      if (num % 10 > 0) {
        words += '-' + ones[num % 10];
      }
    }
  }
  
  return words.trim();
};

export const getOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

export const formatDateWithOrdinal = (dateString: string): string => {
  if (!dateString) return '________ day of ________ ________';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '________ day of ________ ________';
    const day = date.getDate();
    const month = date.toLocaleDateString('en-GB', { month: 'long' });
    const year = date.getFullYear();
    return `${day}${getOrdinalSuffix(day)} day of ${month} ${year}`;
  } catch {
    return '________ day of ________ ________';
  }
};
