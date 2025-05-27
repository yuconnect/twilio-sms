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
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState(''); // 'success' | 'error'

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
    setLoading(true);
    setStatusMessage('');
    setStatusType('');
    try {
      const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
      const res = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: cleanedPhoneNumber }),
      });
      if (res.ok) {
        setStatusMessage('✅ Contact card sent successfully!');
        setStatusType('success');
        setPhoneNumber('');
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

  const isPhoneValid = isValidPhoneNumber(phoneNumber);
  const showError = statusType === 'error' && statusMessage;
  const showSuccess = statusType === 'success' && statusMessage;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full p-8 flex flex-col items-center">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mb-4">
            <span className="text-2xl">👋</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Hi, I'm Dennis!</h1>
          <p className="text-gray-600 text-sm leading-relaxed text-center">Enter your number to get my contact info</p>
        </div>
        <form className="w-full" onSubmit={handleSubmit} autoComplete="off">
          <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number</label>
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
              (!isPhoneValid || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-600 hover:to-indigo-700'
            }`}
            disabled={!isPhoneValid || loading}
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
        </form>
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
