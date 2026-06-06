import React from "react";

interface AuthButtonProps {
  text: string;
  disabled?: boolean;
}

const AuthButton: React.FC<AuthButtonProps> = ({ text, disabled }) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`w-full h-13 rounded-full text-white text-[16px] font-semibold shadow-sm transition
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 hover:cursor-pointer"}`}
      style={{ background: "linear-gradient(135deg, #49613E 0%, #617A55 100%)" }}
    >
      {text}
    </button>
  );
};

export default AuthButton;
