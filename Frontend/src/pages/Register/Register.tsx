import AuthInput from "@/components/common/AuthInput";
import AuthButton from "@/components/common/AuthButton";
import SocialAuthButtons from "@/components/common/SocialAuthButtons";
import { Link } from "react-router-dom";
import ORDivider from "@/components/common/ORDivider.tsx";
import { useState } from "react";
import Loading from "@/components/common/Loading";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

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

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        const passwordValidation = validatePassword(password);
        const confirmValidation = validateConfirmPassword(
            confirmPassword,
            password,
        );
        setPasswordError(passwordValidation);
        setConfirmPasswordError(confirmValidation);

        if (passwordValidation || confirmValidation) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_MAIN_URL}/auth/dang-ky`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        confirmPassword,
                    }),
                },
            );

            const data = await response.json();
            if (!response.ok) {
                setError(data.message || "Đăng ký thất bại. Vui lòng thử lại.");
            } else {
                setMessage(data.message || "Đăng ký thành công.");
            }
        } catch (error) {
            setError("Có lỗi xảy ra");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-brand-bg px-6">
            <div className="w-full max-w-100 flex flex-col items-center gap-8">
                {/* Title */}
                <div className="text-center space-y-3">
                    <h1 className="text-[36px] leading-10 font-extrabold text-brand-heading">
                        Tham gia với chúng tôi
                    </h1>
                    <p className="text-[14px] leading-5.5 text-brand-text max-w-[320px] mx-auto">
                        Tạo tài khoản của bạn để bắt đầu xây dựng tủ quần áo của mình
                    </p>
                </div>
                {error && (
                    <div className="text-red-500 text-[14px] text-center">{error}</div>
                )}
                {message && (
                    <div className="text-emerald-500 text-[14px] text-center">
                        {message}
                    </div>
                )}

                {/* Form */}
                <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
                    <AuthInput
                        label="Email"
                        placeholder="Nhập email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <AuthInput
                            label="Password"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => {
                                const newPassword = e.target.value;
                                setPassword(newPassword);
                                setPasswordError(validatePassword(newPassword));
                            }}
                        />
                        <AuthInput
                            label="Confirm Password"
                            type="password"
                            placeholder="Xác nhận mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => {
                                const newConfirmPassword = e.target.value;
                                setConfirmPassword(newConfirmPassword);
                                setConfirmPasswordError(
                                    validateConfirmPassword(newConfirmPassword, password),
                                );
                            }}
                        />
                    </div>
                    <div className="space-y-2">
                        {passwordError && (
                            <div className="text-red-500 text-[14px]">{passwordError}</div>
                        )}
                        {confirmPasswordError && (
                            <div className="text-red-500 text-[14px]">
                                {confirmPasswordError}
                            </div>
                        )}
                    </div>

                    <AuthButton text="Đăng ký" disabled={isLoading} />

                    {/* Divider */}
                    <ORDivider text="OR SIGN UP WITH" />

                    <SocialAuthButtons />

                    <div className="text-center text-[14px]">
                        <span className="text-brand-text">Already have an account? </span>
                        <Link
                            to="/login"
                            className="font-semibold text-brand-accent underline"
                        >
                            Login
                        </Link>
                    </div>
                </form>

                {isLoading && <Loading />}
            </div>
        </div>
    );
};

export default Register;
