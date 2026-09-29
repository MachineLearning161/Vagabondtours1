import React, { useState } from 'react';
import { X, Send, CheckCircle, AlertCircle, Phone, Calendar, Users, Mail, Lock, FileText } from 'lucide-react';
import { submitEnquiry } from '../../services/db';
import { SiteSettings } from '../../types';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: 'homestay' | 'tour' | 'general';
  itemId?: string;
  itemTitle?: string;
  settings: SiteSettings;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  itemType,
  itemId = 'general',
  itemTitle = 'General North Bengal Travel Consultation',
  settings,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [guestCount, setGuestCount] = useState('2');
  const [message, setMessage] = useState(
    itemType === 'homestay'
      ? `Hello, I would like to enquire about availability, room options, and pricing for "${itemTitle}".`
      : itemType === 'tour'
      ? `Hello, I would like more details and customized pricing for the "${itemTitle}" package.`
      : `Hello, I am planning a holiday in North Bengal and would like your guidance.`
  );

  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent accidental duplicate submissions

    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    const cleanDigits = phone.replace(/[^0-9]/g, '');
    if (!phone.trim() || cleanDigits.length < 8) {
      setError('Please enter a valid phone number (minimum 8-10 digits).');
      return;
    }
    if (!message.trim()) {
      setError('Please enter your enquiry message.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Save directly to Firestore enquiries collection
      const newEnquiryId = await submitEnquiry({
        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim(),
        enquiryType: itemType,
        targetId: itemId, // Locked value, not editable by visitor
        targetTitle: itemTitle, // Locked value, not editable by visitor
        message: message.trim(),
        expectedTravelDate: travelDate,
        guestCount: parseInt(guestCount, 10) || 2,
      });

      // ONLY show success after Firestore confirms the document was saved
      setSubmittedId(newEnquiryId);
      setLoading(false);
    } catch (err: any) {
      console.error('Enquiry submission error:', err);
      let actualError = 'Unable to save your enquiry to our database right now. Please try again.';
      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed?.error) actualError = `Firestore write error: ${parsed.error}`;
        } catch {
          actualError = err.message;
        }
      }
      setError(actualError);
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedId(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-lg bg-stone-900 text-stone-100 rounded-3xl shadow-2xl border border-stone-800 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-950 px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white leading-tight">
                Send an Enquiry
              </h3>
              <p className="text-xs text-stone-400">
                Directly submitted to {settings.businessName} (Jalpaiguri)
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-stone-400 hover:text-white p-1.5 rounded-lg hover:bg-stone-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {submittedId ? (
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950 border border-emerald-600/50 flex items-center justify-center text-emerald-400 shadow-inner">
                <CheckCircle className="w-9 h-9" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-serif text-2xl font-bold text-white">
                  Enquiry Successfully Received!
                </h4>
                <p className="text-sm text-stone-300">
                  Thank you, <strong className="text-white">{name}</strong>. Your enquiry for <span className="text-emerald-400 font-semibold">{itemTitle}</span> has been saved in our system.
                </p>
              </div>

              {/* Reference ID and Next Steps Confirmation */}
              <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 text-left text-xs space-y-2 text-stone-300">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <span className="text-stone-400 uppercase text-[10px] font-bold">Enquiry Reference ID</span>
                  <span className="font-mono text-emerald-400 font-bold">{submittedId}</span>
                </div>
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <span className="text-stone-400 uppercase text-[10px] font-bold">Contact Phone</span>
                  <span className="font-mono text-stone-200">{phone}</span>
                </div>
                <p className="text-[11px] text-stone-400 pt-1 leading-relaxed">
                  Our team in Jalpaiguri will review your requirements and reach out to you directly at your provided contact number.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full py-3 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors shadow-lg shadow-emerald-950/40"
                >
                  Close & Return to Website
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Selected Item Indicator - Locked / Read-only for Visitors */}
              <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-800 text-xs flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">
                    <Lock className="w-3 h-3 text-stone-500" />
                    <span>
                      {itemType === 'homestay' ? 'Selected Homestay' : itemType === 'tour' ? 'Selected Tour Package' : 'Subject'}:
                    </span>
                  </div>
                  <p className="font-medium text-stone-200 truncate mt-0.5">{itemTitle}</p>
                </div>
                <span className="text-[10px] font-mono text-stone-400 bg-stone-900 border border-stone-800 px-2 py-1 rounded flex-shrink-0">
                  ID: {itemId}
                </span>
              </div>

              {error && (
                <div className="p-3 bg-rose-950/80 border border-rose-700/60 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Your Full Name <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={loading}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Ananya Sen"
                    className="w-full bg-stone-950 border border-stone-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-stone-500 outline-none transition-colors disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Contact Phone Number <span className="text-emerald-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      disabled={loading}
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="e.g. 9832012345"
                      className="w-full bg-stone-950 border border-stone-700 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-stone-500 outline-none transition-colors disabled:opacity-50"
                    />
                    <Phone className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-3.5" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      disabled={loading}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. ananya@example.com"
                      className="w-full bg-stone-950 border border-stone-700 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-stone-500 outline-none transition-colors disabled:opacity-50"
                    />
                    <Mail className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Approximate Number of Guests
                  </label>
                  <div className="relative">
                    <select
                      disabled={loading}
                      value={guestCount}
                      onChange={e => setGuestCount(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-700 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white outline-none transition-colors disabled:opacity-50"
                    >
                      <option value="1">1 Person</option>
                      <option value="2">2 Persons (Couple)</option>
                      <option value="4">3 - 4 Persons (Family)</option>
                      <option value="6">5 - 8 Persons (Group)</option>
                      <option value="10">8+ Persons (Large Group)</option>
                    </select>
                    <Users className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-3.5" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Tentative Travel Date (Optional)
                </label>
                <div className="relative">
                  <input
                    type="date"
                    disabled={loading}
                    value={travelDate}
                    onChange={e => setTravelDate(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-2 text-sm text-white outline-none transition-colors disabled:opacity-50"
                  />
                  <Calendar className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Enquiry Message <span className="text-emerald-400">*</span>
                </label>
                <textarea
                  required
                  disabled={loading}
                  rows={3}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Specify desired dates, meal preferences, safari requirements, or any questions..."
                  className="w-full bg-stone-950 border border-stone-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-stone-500 outline-none transition-colors resize-none disabled:opacity-50"
                />
              </div>

              <div className="text-[11px] text-stone-400 bg-stone-950/60 p-3 rounded-xl border border-stone-800">
                🔒 Your enquiry will be submitted securely into our database. Our team will contact you directly to assist with your plan.
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleResetAndClose}
                  className="px-4 py-2.5 rounded-xl border border-stone-700 text-stone-400 hover:text-white hover:bg-stone-800 text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold text-xs transition-colors shadow-lg shadow-emerald-950/50"
                >
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Enquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
