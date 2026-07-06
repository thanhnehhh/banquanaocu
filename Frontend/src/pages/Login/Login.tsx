import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthInput from "@/components/common/AuthInput";
import AuthButton from "@/components/common/AuthButton";
import SocialAuthButtons from "@/components/common/SocialAuthButtons";
import ORDivider from "@/components/common/ORDivider.tsx";
import { useState, type SyntheticEvent } from "react";
import Loading from "@/components/common/Loading";
import { jwtDecode } from "jwt-decode";
import type Token from "@/model/Token";
import { useGetProfile } from "@/hooks/useGetProfile";
import { connectSocket } from "@/websocket/chatSocket";

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(searchParams.get("error") ?? "");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const getProfile = useGetProfile();

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const validatePassword = (newPassword: string): string => {
    if (!passwordRegex.test(newPassword)) {
      return "Mật khẩu tối thiểu 8 ký tự, ít nhất một chữ cái và một số";
    }
    return "";
  };
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError("");

    if (email.trim() === "" || password.trim() === "") {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (passwordError) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_MAIN_URL}/auth/dang-nhap`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        console.log(data.message);
        setError(data.message || "Đăng nhập thất bại. Vui lòng thử lại.");
        return;
      }
      const { token } = data.data;

      localStorage.setItem("token", token);
      connectSocket();
      const decodedToken = jwtDecode(token) as Token;

      getProfile(token);
      setEmail("");
      setPassword("");
      if (decodedToken.roles?.includes("ROLE_ADMIN")) {
        navigate("/admin/users");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
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
            Chào mừng bạn trở lại
          </h1>
          <p className="text-[14px] text-brand-text">
            Đăng nhập để tiếp tục trải nghiệm của bạn
          </p>
        </div>

        {error && (
          <div className="text-red-500 text-[14px] text-center">{error}</div>
        )}

        {/* Form */}
        <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
          <AuthInput
            label="Email"
            placeholder="Nhập email của bạn"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password + Forgot */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-[14px] font-semibold text-brand-text">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[13px] text-brand-text hover:text-brand-heading"
              >
                Forgot?
              </Link>
            </div>

            <input
              type="password"
              placeholder="Nhập mật khẩu của bạn"
              value={password}
              onChange={(e) => {
                const newPassword = e.target.value;
                setPassword(newPassword);
                setPasswordError(validatePassword(newPassword));
              }}
              className="       border border-gray-300
                                w-full h-12
                                px-4
                                rounded-[10px]
                                bg-brand-input
                                text-[14px]
                                placeholder:text-brand-placeholder
                                focus:outline-none focus:ring-1 focus:ring-brand-accent
                            "
            />
          </div>
          <div className="space-y-2">
            {passwordError && (
              <div className="text-red-500 text-[14px]">{passwordError}</div>
            )}
          </div>

          <AuthButton text="Đăng nhập" />

          {/* Divider */}
          <ORDivider text="OR SIGN IN WITH" />

          <SocialAuthButtons />

          {/* Register link */}
          <div className="text-center text-[14px]">
            <span className="text-brand-text">Don’t have an account? </span>
            <Link
              to="/register"
              className="font-semibold text-brand-text underline"
            >
              Sign up
            </Link>
          </div>
        </form>
        {isLoading && <Loading />}
      </div>
    </div>
  );
}

export default Login;
