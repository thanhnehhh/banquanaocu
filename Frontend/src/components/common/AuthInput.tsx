import React from "react";

interface AuthInputProps {
  label: string;
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const AuthInput: React.FC<AuthInputProps> = ({ label, placeholder, type = "text", value, onChange }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-[14px] font-semibold text-brand-text leading-5">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-12 px-4 rounded-[10px] bg-brand-input text-[14px]
          placeholder:text-brand-placeholder focus:outline-none focus:ring-1 focus:ring-brand-accent
          border border-gray-300"
      />
    </div>
  );
};

export default AuthInput;
