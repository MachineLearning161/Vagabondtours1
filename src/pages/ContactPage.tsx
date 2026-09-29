import React, { useState } from 'react';
import { SiteSettings } from '../types';
import { 
  MapPin, Phone, Mail, Instagram, Send, CheckCircle, 
  AlertCircle, Clock, Compass, FileText, ArrowRight
} from 'lucide-react';
import { submitEnquiry } from '../services/db';

interface ContactPageProps {
  settings: SiteSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [travelSubject, setTravelSubject] = useState('General North Bengal Holiday');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent accidental duplicate submissions

    if (!name.trim()) {
      setError('Please provide your full name.');
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
      // Save enquiry directly to Firestore enquiries collection
      const newEnquiryId = await submitEnquiry({
        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim(),
        enquiryType: 'general',
        targetId: 'contact-general',
        targetTitle: travelSubject,
        message: message.trim(),
      });

      // ONLY show success message after Firestore confirms that the enquiry was saved
      setSubmittedId(newEnquiryId);
      setLoading(false);
    } catch (err: any) {
      console.error('Failed to submit enquiry:', err);
      let actualError = 'Failed to record your enquiry in our database. Please check your connection and try again.';
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

  const handleResetForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
    setSubmittedId(null);
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold">
          <MapPin className="w-3.5 h-3.5" />
          <span>Jalpaiguri, West Bengal Headquarters</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Connect with Vagabond Tours & Co.
        </h1>
        <p className="text-stone-600 text-sm max-w-2xl">
          Located in Jalpaiguri, the historic gateway to the North Bengal hills and Dooars sanctuaries. Contact us via phone, email, or submit an enquiry below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="bg-stone-900 text-white p-7 rounded-3xl border border-stone-800 space-y-6 shadow-xl">
            <h3 className="font-serif text-xl font-bold text-white border-b border-stone-800 pb-3">
              Official Contact Desk
            </h3>

            <div className="space-y-4 text-xs text-stone-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-bold">Office Address</span>
                  <p className="text-sm font-medium text-white mt-0.5">{settings.address}</p>
                  <p className="text-stone-400 text-[11px] mt-0.5">Jalpaiguri, West Bengal 735101, India</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-bold">Direct Phone (Enquiry Consultation)</span>
                  <a href={`tel:${(settings?.phone || '').replace(/\s+/g, '')}`} className="text-sm font-bold text-white hover:text-emerald-400 transition-colors">
                    {settings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-bold">Email Inquiries</span>
                  <a href={`mailto:${settings.email}`} className="text-xs text-stone-200 hover:text-white transition-colors">
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Instagram className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-bold">Instagram</span>
                  <a 
                    href={`https://instagram.com/${settings.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-stone-200 hover:text-pink-400 transition-colors font-medium"
                  >
                    @{settings.instagram}
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800 text-[11px] text-stone-400 space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>Operating Hours: 8:00 AM – 9:00 PM IST (All 7 Days)</span>
              </div>
              <p>Pickups coordinated around train arrivals at NJP / Jalpaiguri Town & flights at Bagdogra Airport.</p>
            </div>
          </div>

          {/* Location note */}
          <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-200 space-y-2 text-xs text-emerald-950">
            <h4 className="font-serif text-base font-bold flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-800" />
              <span>Why Jalpaiguri is the Tourism Hub</span>
            </h4>
            <p className="leading-relaxed">
              Jalpaiguri sits at the strategic junction between the Dooars plain wildlife sanctuaries (Gorumara, Lataguri, Jaldapara) and the scenic hill roads winding to Darjeeling, Kurseong, and Kalimpong. Our central local base ensures dependable cab logistics and 24/7 on-route support.
            </p>
          </div>
        </div>

        {/* Contact Form that saves directly to Firestore */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Website Enquiry Desk
            </span>
            <h3 className="font-serif text-2xl font-bold text-stone-900 mt-1">
              Send an Enquiry to Our Travel Curators
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Submitting this form records your enquiry directly into our database for our Jalpaiguri team to review and respond.
            </p>
          </div>

          {submittedId ? (
            <div className="p-8 bg-emerald-50/80 border border-emerald-300 rounded-2xl text-center space-y-5">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shadow-sm">
                <CheckCircle className="w-9 h-9" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-serif text-2xl font-bold text-emerald-950">
                  Enquiry Successfully Received!
                </h4>
                <p className="text-xs text-emerald-900 max-w-md mx-auto">
                  Thank you, <strong className="text-emerald-950">{name}</strong>. Your enquiry regarding &quot;{travelSubject}&quot; has been securely recorded.
                </p>
              </div>

              {/* Reference ID card */}
              <div className="p-4 bg-white rounded-xl border border-emerald-200 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-500 uppercase text-[10px] font-bold">Enquiry Reference ID</span>
                  <span className="font-mono text-emerald-800 font-bold">{submittedId}</span>
                </div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-500 uppercase text-[10px] font-bold">Contact Phone</span>
                  <span className="font-mono text-stone-800">{phone}</span>
                </div>
                <p className="text-[11px] text-stone-500 pt-1 leading-relaxed">
                  Our team in Jalpaiguri will review your travel requirements and contact you directly at your provided phone number or email.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-colors"
                >
                  Submit Another Enquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Full Name <span className="text-emerald-700">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={loading}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Ananya Mukherjee"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-700 rounded-xl px-4 py-2.5 text-sm outline-none disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Contact Phone Number <span className="text-emerald-700">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    disabled={loading}
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. 9832012345"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-700 rounded-xl px-4 py-2.5 text-sm outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    disabled={loading}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. ananya@example.com"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-700 rounded-xl px-4 py-2.5 text-sm outline-none disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Enquiry Subject
                  </label>
                  <select
                    disabled={loading}
                    value={travelSubject}
                    onChange={e => setTravelSubject(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-700 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none disabled:opacity-50"
                  >
                    <option value="General North Bengal Holiday">General North Bengal Holiday</option>
                    <option value="Dooars Jungle Safari & Lataguri Homestays">Dooars Jungle Safari & Lataguri Homestays</option>
                    <option value="Darjeeling & Kanchenjunga Cottages">Darjeeling & Kanchenjunga Cottages</option>
                    <option value="Kalimpong & Lava Offbeat Stays">Kalimpong & Lava Offbeat Stays</option>
                    <option value="Custom Cab & Vehicle Hire">Custom Cab & Vehicle Hire</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Enquiry Message & Dates <span className="text-emerald-700">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  disabled={loading}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tell us your tentative travel dates, group size, preference between hills or forests, or any specific homestay..."
                  className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-700 rounded-xl px-4 py-2.5 text-sm outline-none resize-none disabled:opacity-50"
                />
              </div>

              <div className="p-3 bg-stone-100 rounded-xl text-[11px] text-stone-600">
                🔒 <strong className="text-stone-800">Privacy & Booking Note:</strong> Your contact details are stored securely in Firestore and accessed strictly by Vagabond Tours administrators. There is NO online payment or card checkout on this site.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-emerald-950/30 transition-all hover:scale-[1.01]"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving Enquiry...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Enquiry</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
