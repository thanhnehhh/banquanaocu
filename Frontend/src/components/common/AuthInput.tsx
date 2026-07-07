import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AuthInputProps {
  label: string;
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const AuthInput: React.FC<AuthInputProps> = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-[14px] font-semibold text-brand-text leading-5">
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="
            w-full h-12
            px-4
            rounded-[10px]
            bg-brand-input
            text-[14px]
            placeholder:text-brand-placeholder
            focus:outline-none focus:ring-1 focus:ring-brand-accent
            border border-gray-300
            pr-11
          "
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthInput;
