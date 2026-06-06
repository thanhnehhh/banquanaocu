import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthInput from "../../components/common/AuthInput";
import publicAxios from "@/service/publicAxios";
import OtpModal from "./components/OtpModal";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState<"REQUEST_EMAIL" | "RESET_PASSWORD">("REQUEST_EMAIL");
  const [modalOTP, setModalOTP] = useState(false);
  const [otp, setOTP] = useState("");
  const [otpError, setOtpError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [resetError, setResetError] = useState("");
  const navigate = useNavigate();

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const validatePassword = (p: string) => passwordRegex.test(p) ? "" : "Mật khẩu tối thiểu 8 ký tự, ít nhất một chữ cái và một số";
  const validateConfirmPassword = (c: string, p: string) => p && c !== p ? "Không trùng với mật khẩu" : "";

  const handleSendResetLink = () => {
    if (!email) { setError("Vui lòng nhập email của bạn."); return; }
    setError(""); setMessage("");
    publicAxios.post("/auth/quen-mat-khau", { email })
      .then((response: any) => {
        setMessage(response?.data?.message || "OTP đã được gửi đến email của bạn.");
        setModalOTP(true);
      })
      .catch((err: any) => setError(err.response?.data?.message || "Gửi OTP thất bại. Vui lòng thử lại."));
  };

  const handleVerifyOTP = () => {
    if (!otp) { setOtpError("Vui lòng nhập OTP."); return; }
    setOtpError("");
    publicAxios.post("/auth/xac-nhan-otp", { email, otp })
      .then(() => { setModalOTP(false); setStep("RESET_PASSWORD"); setMessage("OTP hợp lệ. Vui lòng nhập mật khẩu mới."); })
      .catch((err: any) => setOtpError(err.response?.data?.message || "OTP không hợp lệ. Vui lòng thử lại."));
  };

  const handleResetPassword = () => {
    if (!newPassword || !confirmPassword) { setResetError("Vui lòng điền đầy đủ thông tin."); return; }
    if (newPassword !== confirmPassword) { setResetError("Mật khẩu không khớp."); return; }
    setResetError("");
    publicAxios.post("/auth/dat-lai-mat-khau", { email, otp, newPassword, confirmPassword })
      .then(() => { setMessage("Đặt lại mật khẩu thành công! Đang chuyển hướng..."); setTimeout(() => navigate("/login"), 2000); })
      .catch((err: any) => setResetError(err.response?.data?.message || "Đặt lại mật khẩu thất bại. Vui lòng thử lại."));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg px-4 relative">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900 mb-3">
          {step === "REQUEST_EMAIL" ? "Quên mật khẩu?" : "Đặt lại mật khẩu"}
        </h1>
        <p className="text-center text-gray-600 text-sm mb-6">
          {step === "REQUEST_EMAIL" ? "Nhập email của bạn và chúng tôi sẽ gửi OTP để đặt lại mật khẩu." : "Vui lòng nhập mật khẩu mới của bạn."}
        </p>

        {message && step === "REQUEST_EMAIL" && <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded">{message}</div>}
        {error && step === "REQUEST_EMAIL" && <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded">{error}</div>}

        {step === "REQUEST_EMAIL" && (
          <>
            <div className="mb-6">
              <AuthInput label="Email" placeholder="Nhập email của bạn" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button onClick={handleSendResetLink} className="hover:cursor-pointer w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-4 rounded-full transition-colors">Gửi OTP</button>
          </>
        )}

        {step === "RESET_PASSWORD" && (
          <>
            {message && <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded">{message}</div>}
            {resetError && <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded">{resetError}</div>}
            <div className="mb-4">
              <AuthInput label="Mật khẩu mới" placeholder="Nhập mật khẩu mới" type="password" value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setNewPasswordError(validatePassword(e.target.value)); }} />
            </div>
            <div className="mb-6">
              <AuthInput label="Xác nhận mật khẩu" placeholder="Xác nhận mật khẩu mới" type="password" value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setConfirmPasswordError(validateConfirmPassword(e.target.value, newPassword)); }} />
            </div>
            <div className="space-y-1 mb-4">
              {newPasswordError && <div className="text-red-500 text-[14px]">{newPasswordError}</div>}
              {confirmPasswordError && <div className="text-red-500 text-[14px]">{confirmPasswordError}</div>}
            </div>
            <button onClick={handleResetPassword} className="hover:cursor-pointer w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-4 rounded-full transition-colors">Đặt lại mật khẩu</button>
          </>
        )}

        <button onClick={() => navigate("/login")} className="hover:cursor-pointer w-full mt-6 text-gray-700 hover:text-gray-900 font-medium text-center">← Quay lại đăng nhập</button>
      </div>

      <OtpModal isOpen={modalOTP} email={email} otp={otp} setOTP={setOTP} otpError={otpError} onClose={() => setModalOTP(false)} onVerify={handleVerifyOTP} />
    </div>
  );
}

export default ForgotPassword;
