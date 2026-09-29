/**
 * WhatsApp Helper for Vagabond Tours & Co.
 * Preserves the owner's configured number (default: 0861747614)
 * and formats the wa.me link with international dialing code.
 */

export function cleanWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.startsWith('0') && digits.length === 10) {
    // Standard Indian 10-digit mobile prefixed with 0 -> prefix with country code 91
    return '91' + digits.substring(1);
  }
  if (digits.length === 10) {
    return '91' + digits;
  }
  return digits;
}

export function buildWhatsAppMessage(params: {
  businessName?: string;
  customerName: string;
  customerPhone: string;
  itemType: 'homestay' | 'tour' | 'general';
  itemId?: string;
  itemTitle?: string;
  expectedDate?: string;
  guestCount?: number;
  message: string;
}): string {
  const header = `*Enquiry for Vagabond Tours & Co.* (North Bengal)\n`;
  const subjectLine = params.itemTitle
    ? `*Subject:* ${params.itemType === 'homestay' ? '🏡 Homestay Enquiry' : params.itemType === 'tour' ? '🚙 Tour Package Enquiry' : '💬 General Enquiry'}: ${params.itemTitle} (ID: ${params.itemId || 'N/A'})\n`
    : `*Subject:* General Tourism Enquiry\n`;

  const visitorDetails = [
    `*Name:* ${params.customerName}`,
    `*Phone:* ${params.customerPhone}`,
    params.expectedDate ? `*Preferred Travel Date:* ${params.expectedDate}` : null,
    params.guestCount ? `*No. of Guests:* ${params.guestCount}` : null,
  ].filter(Boolean).join('\n');

  const messageBody = `\n*Message:*\n"${params.message.trim()}"\n`;
  const footer = `\n_Sent via Vagabond Tours & Co. website (Jalpaiguri)_`;

  return `${header}${subjectLine}${visitorDetails}\n${messageBody}${footer}`;
}

export function createWhatsAppUrl(phoneNumber: string, text: string): string {
  const cleanNum = cleanWhatsAppNumber(phoneNumber);
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanNum}?text=${encodedText}`;
}
