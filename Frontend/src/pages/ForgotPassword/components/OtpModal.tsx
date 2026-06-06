import React from "react";

interface OtpModalProps {
  isOpen: boolean;
  email: string;
  otp: string;
  setOTP: (otp: string) => void;
  otpError: string;
  onClose: () => void;
  onVerify: () => void;
}

const OtpModal: React.FC<OtpModalProps> = ({ isOpen, email, otp, setOTP, otpError, onClose, onVerify }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-gray-300 opacity-35"></div>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Enter OTP</h2>
          <button onClick={onClose} className="text-gray-500 hover:cursor-pointer hover:text-gray-700 text-2xl font-bold">×</button>
        </div>
        <p className="text-sm text-gray-600 text-center mb-6">
          Please enter the OTP sent to <span className="font-semibold">{email}</span>
        </p>
        {otpError && <div className="mb-4 p-2 text-sm text-red-700 bg-red-100 rounded text-center">{otpError}</div>}
        <div className="mb-6">
          <input type="text" maxLength={6} value={otp} onChange={(e) => setOTP(e.target.value)} placeholder="000000"
            className="w-full text-center text-2xl tracking-widest font-bold border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div className="flex space-x-3">
          <button onClick={onClose} className="hover:cursor-pointer w-1/2 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">Cancel</button>
          <button onClick={onVerify} className="hover:cursor-pointer w-1/2 py-2 px-4 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800">Verify</button>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;
