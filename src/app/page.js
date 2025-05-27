'use client';
import { useState } from 'react';

const formatPhoneNumber = (value) => {
  const cleaned = value.replace(/\D/g, '');
  const limited = cleaned.slice(0, 10);
  if (limited.length >= 6) {
    return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
  } else if (limited.length >= 3) {
    return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
  } else if (limited.length > 0) {
    return `(${limited}`;
  }
  return '';
};

const isValidPhoneNumber = (value) => {
  const cleaned = value.replace(/\D/g, '');
  return cleaned.length === 10;
};

export default function Page() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState(''); // 'success' | 'error'
  const [consentChecked, setConsentChecked] = useState(false);
  const [step, setStep] = useState('form');
  const [consentTimestamp, setConsentTimestamp] = useState(null);

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    if (statusMessage) {
      setStatusMessage('');
      setStatusType('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidPhoneNumber(phoneNumber)) {
      setStatusMessage('Please enter a valid 10-digit phone number');
      setStatusType('error');
      return;
    }
    if (!consentChecked) {
      setStatusMessage('You must consent to receive automated text messages.');
      setStatusType('error');
      return;
    }
    if (!fullName.trim()) {
      setStatusMessage('Please enter your full name');
      setStatusType('error');
      return;
    }
    setLoading(true);
    setStatusMessage('');
    setStatusType('');
    try {
      const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
      const res = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phoneNumber: cleanedPhoneNumber,
          fullName: fullName.trim(),
          consentTimestamp: new Date().toISOString()
        }),
      });
      if (res.ok) {
        setConsentTimestamp(new Date().toISOString());
        setStep('success');
        setStatusMessage('✅ Contact card sent successfully!');
        setStatusType('success');
      } else {
        setStatusMessage('❌ Failed to send contact card. Please try again.');
        setStatusType('error');
      }
    } catch {
      setStatusMessage('❌ Failed to send contact card. Please try again.');
      setStatusType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${fullName}
TEL:${phoneNumber.replace(/\D/g, '')}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fullName.replace(/\s+/g, '_')}_contact.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleStartOver = () => {
    setStep('form');
    setFullName('');
    setPhoneNumber('');
    setConsentChecked(false);
    setStatusMessage('');
    setStatusType('');
    setConsentTimestamp(null);
  };

  const isPhoneValid = isValidPhoneNumber(phoneNumber);
  const isFormValid = isPhoneValid && consentChecked && fullName.trim().length > 0;
  const showError = statusType === 'error' && statusMessage;
  const showSuccess = statusType === 'success' && statusMessage;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {step === 'form' ? (
          <>
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mb-4">
                <span className="text-2xl">👋</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Hi, I&apos;m Dennis!</h1>
              <p className="text-gray-600 text-sm leading-relaxed text-center">Let's exchange our contact info</p>
            </div>
            <form className="w-full" onSubmit={handleSubmit} autoComplete="off">
              <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">What's your name?</label>
              <input
                id="fullName"
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg mb-4 text-black"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
                aria-label="Full Name"
              />
              <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">What's your mobile number?</label>
              <input
                id="phone"
                type="text"
                inputMode="tel"
                autoComplete="tel"
                maxLength={14}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg mb-4 text-black"
                placeholder="(555) 123-4567"
                value={phoneNumber}
                onChange={handlePhoneChange}
                disabled={loading}
                aria-label="Phone Number"
              />
              <button
                type="submit"
                className={`w-full py-3 px-4 text-lg font-semibold rounded-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 transition-colors duration-200 flex items-center justify-center ${
                  (!isFormValid || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-600 hover:to-indigo-700'
                }`}
                disabled={!isFormValid || loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  'Send Contact Card'
                )}
              </button>
              <div className="flex items-start mt-4">
                <input
                  id="consent"
                  type="checkbox"
                  checked={consentChecked}
                  onChange={e => setConsentChecked(e.target.checked)}
                  className="mt-1 mr-2 w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  required
                />
                <label htmlFor="consent" className="text-gray-800 text-sm leading-snug select-none">
                  I consent to receive automated text messages from Dennis Yu Builds at the phone number provided. Message and data rates may apply. Reply STOP to opt out at any time.
                </label>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center mb-4">
              <span className="text-2xl">😊</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Thanks, {fullName}!</h1>
            <p className="text-gray-600 text-sm leading-relaxed text-center mb-8">Your contact card has been sent successfully.</p>
            
            <div className="flex flex-col gap-4 w-full">
              <button
                onClick={handleDownloadVCard}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>📇</span>
                <span>Save New Contact</span>
              </button>
              
              <button
                onClick={handleStartOver}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>🔁</span>
                <span>Start Over</span>
              </button>
            </div>
          </div>
        )}
        {(showSuccess || showError) && (
          <div
            className={`w-full mt-6 border rounded-lg px-4 py-3 text-center text-base font-medium ${
              showSuccess
                ? 'bg-green-50 text-green-800 border-green-200'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
            role="alert"
          >
            {statusMessage}
          </div>
        )}
      </div>
      <div className="mt-6 text-gray-500 text-sm text-center">Powered by Dennis Yu Builds</div>
    </div>
  );
}
