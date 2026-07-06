import React from "react";

interface ORDividerProps {
  text: string;
}

const ORDivider: React.FC<ORDividerProps> = ({ text }) => {
  return (
    <div className="relative flex flex-col justify-center items-center py-4 w-full h-12">
      {/* Đường gạch ngang */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full border-t border-brand-divider"></div>
      </div>
      {/* Chữ Text đè lên đường gạch */}
      <div className="relative z-10 flex flex-col items-center px-4 bg-brand-bg h-4">
        <span className="font-bold text-[12px] leading-4 tracking-[1.2px] uppercase text-brand-social-text">
          {text}
        </span>
      </div>
    </div>
  );
};

export default ORDivider;
