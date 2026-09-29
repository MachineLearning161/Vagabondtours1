import React from 'react';
import { SiteSettings } from '../types';
import { Shield, Lock, FileText, CheckCircle, ArrowLeft } from 'lucide-react';

interface PrivacyPolicyPageProps {
  settings: SiteSettings;
  onBack: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ settings, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-stone-800">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-emerald-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      <div className="space-y-3 border-b border-stone-200 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5" />
          <span>Vagabond Tours & Co. Privacy & Data Policy</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Privacy Policy
        </h1>
        <p className="text-xs text-stone-500">
          Last Updated: September 2026 • Applicable to website visitors and tour enquirers.
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed text-stone-700">
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-stone-900">1. Overview & Business Identity</h2>
          <p>
            This website is owned and operated by <strong className="text-stone-900">{settings.businessName}</strong>, located at {settings.address}, Jalpaiguri, West Bengal, India. We are dedicated to providing ethical, personalized North Bengal homestay and tour curation.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-stone-900">2. No Online Payment or Financial Data Collection</h2>
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 space-y-2">
            <p className="font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              <span>Zero Payment Gateway Processing</span>
            </p>
            <p>
              Vagabond Tours & Co. DOES NOT collect credit card numbers, debit card details, UPI PINs, or net-banking credentials on this website. There is no checkout cart or automated online payment processing. Any holiday or homestay arrangement is confirmed only after direct dialogue with our staff.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-stone-900">3. Information We Collect</h2>
          <p>
            When you submit an enquiry through our homestay, tour, or contact forms, we collect only the necessary details you provide voluntarily:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-600">
            <li>Your Name</li>
            <li>Your Contact Phone Number</li>
            <li>Your Email Address (if provided)</li>
            <li>Selected homestay or tour package interest</li>
            <li>Approximate travel dates, group size, and enquiry message</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-stone-900">4. How We Use and Protect Your Data</h2>
          <p>
            Your information is stored in secured Google Cloud Firestore databases protected by strict attribute-based security rules. Access is restricted solely to authorized Vagabond Tours administrators.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-600">
            <li>We use your contact details solely to reply to your travel inquiries via direct phone call, email, or scheduled consultation.</li>
            <li>We do not sell, rent, lease, or distribute your telephone number or personal information to third-party marketing entities.</li>
            <li>Enquiries are strictly confidential and are not publicly indexed or displayed anywhere on our website.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-stone-900">5. Website Enquiry Processing Disclosure</h2>
          <p>
            All enquiries are submitted directly and securely through our website forms into our Firestore database. There is no automated third-party chat redirection, and our travel specialists in Jalpaiguri review every enquiry before contacting you personally.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-stone-900">6. Contacting Our Data Custodian</h2>
          <p>
            If you have questions regarding your enquiry records or wish to request removal of your contact information from our enquiry registry, please write to:
          </p>
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-1">
            <p><strong>{settings.businessName}</strong></p>
            <p>Address: {settings.address}</p>
            <p>Email: <a href={`mailto:${settings.email}`} className="text-emerald-800 underline">{settings.email}</a></p>
            <p>Phone: {settings.phone}</p>
          </div>
        </section>
      </div>
    </div>
  );
};
