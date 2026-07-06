import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthInput from "../../components/common/AuthInput";
import publicAxios from "@/service/publicAxios";
import OtpModal from "./components/OtpModal";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Steps: "REQUEST_EMAIL" | "RESET_PASSWORD"
  const [step, setStep] = useState<"REQUEST_EMAIL" | "RESET_PASSWORD">(
    "REQUEST_EMAIL",
  );

  // OTP Modal
  const [modalOTP, setModalOTP] = useState(false);
  const [otp, setOTP] = useState("");
  const [otpError, setOtpError] = useState("");

  // Reset Password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [resetError, setResetError] = useState("");

  const navigate = useNavigate();

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const validatePassword = (newPassword: string): string => {
    if (!passwordRegex.test(newPassword)) {
      return "Mật khẩu tối thiểu 8 ký tự, ít nhất một chữ cái và một số";
    }
    return "";
  };
  const validateConfirmPassword = (
    confirmPass: string,
    pwd: string,
  ): string => {
    if (pwd && confirmPass !== pwd) {
      return "Không trùng với mật khẩu";
    }
    return "";
  };

  const handleSendResetLink = () => {
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setError("");
    setMessage("");

    publicAxios
      .post("/auth/quen-mat-khau", { email })
      .then((response) => {
        setMessage(
          response.data?.message ||
            "Reset OTP sent successfully. Please check your email.",
        );
        setError("");
        setModalOTP(true); // Open OTP modal
      })
      .catch((error) => {
        setError(
          error.response?.data?.message ||
            "Failed to send reset OTP. Please try again.",
        );
        setMessage("");
      });
  };

  const handleVerifyOTP = () => {
    if (!otp) {
      setOtpError("Please enter the OTP.");
      return;
    }
    setOtpError("");

    // Assuming backend has /auth/verify-otp endpoint
    publicAxios
      .post("/auth/xac-nhan-otp", { email, otp })
      .then(() => {
        setModalOTP(false);
        setStep("RESET_PASSWORD");
        setMessage(
          "OTP verified successfully. Please enter your new password.",
        );
      })
      .catch((error) => {
        setOtpError(
          error.response?.data?.message || "Invalid OTP. Please try again.",
        );
      });
  };

  const handleResetPassword = () => {
    if (!newPassword || !confirmPassword) {
      setResetError("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match.");
      return;
    }
    setResetError("");

    publicAxios
      .post("/auth/dat-lai-mat-khau", {
        email,
        otp,
        newPassword,
        confirmPassword,
      })
      .then(() => {
        setMessage("Password reset successfully. Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      })
      .catch((error) => {
        setResetError(
          error.response?.data?.message ||
            "Failed to reset password. Please try again.",
        );
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg px-4 relative">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-3">
          {step === "REQUEST_EMAIL" ? "Forgot Password?" : "Reset Password"}
        </h1>

        {/* Description */}
        <p className="text-center text-gray-600 text-sm mb-6">
          {step === "REQUEST_EMAIL"
            ? "Enter your email address and we will send you an OTP to reset your password."
            : "Please enter your new password."}
        </p>

        {/* Global Messages */}
        {message && step === "REQUEST_EMAIL" && (
          <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded">
            {message}
          </div>
        )}
        {error && step === "REQUEST_EMAIL" && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}

        {/* Step 1: Request Email */}
        {step === "REQUEST_EMAIL" && (
          <>
            <div className="mb-6">
              <AuthInput
                label="Email Address"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              onClick={handleSendResetLink}
              className="hover:cursor-pointer w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-4 rounded-full transition-colors duration-200"
            >
              Send OTP
            </button>
          </>
        )}

        {/* Step 2: Reset Password */}
        {step === "RESET_PASSWORD" && (
          <>
            {message && (
              <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded">
                {message}
              </div>
            )}
            {resetError && (
              <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded">
                {resetError}
              </div>
            )}
            <div className="mb-4">
              <AuthInput
                label="New Password"
                placeholder="Enter new password"
                type="password"
                value={newPassword}
                onChange={(e) => {
                  const newPassword = e.target.value;
                  setNewPassword(newPassword);
                  setNewPasswordError(validatePassword(newPassword));
                }}
              />
            </div>
            <div className="mb-6">
              <AuthInput
                label="Confirm Password"
                placeholder="Confirm new password"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  const newConfirmPassword = e.target.value;
                  setConfirmPassword(newConfirmPassword);
                  setConfirmPasswordError(
                    validateConfirmPassword(newConfirmPassword, newPassword),
                  );
                }}
              />
            </div>
            <div className="space-y-2">
              {newPasswordError && (
                <div className="text-red-500 text-[14px]">
                  {newPasswordError}
                </div>
              )}
              {confirmPasswordError && (
                <div className="text-red-500 text-[14px]">
                  {confirmPasswordError}
                </div>
              )}
            </div>
            <button
              onClick={handleResetPassword}
              className="hover:cursor-pointer w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-4 rounded-full transition-colors duration-200"
            >
              Reset Password
            </button>
          </>
        )}

        {/* Back to Login Link */}
        <button
          onClick={() => navigate("/login")}
          className="hover:cursor-pointer w-full mt-6 text-gray-700 hover:text-gray-900 font-medium text-center"
        >
          ← Back to Login
        </button>
      </div>

      {/* OTP Modal */}
      <OtpModal
        isOpen={modalOTP}
        email={email}
        otp={otp}
        setOTP={setOTP}
        otpError={otpError}
        onClose={() => setModalOTP(false)}
        onVerify={handleVerifyOTP}
      />
    </div>
  );
}

export default ForgotPassword;
