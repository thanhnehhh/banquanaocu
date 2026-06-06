import React from "react";

const SocialAuthButtons: React.FC = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_MAIN_URL}/oauth2/authorization/google`;
  };

  return (
    <div className="flex gap-3">
      <button type="button" onClick={handleGoogleLogin}
        className="flex-1 h-11 flex items-center justify-center gap-2 border border-[#E5E7EB]
          rounded-full bg-white text-[14px] font-medium text-brand-heading hover:bg-gray-50 transition hover:cursor-pointer">
        <i className="fa-brands fa-google text-[16px]"></i>
        Google
      </button>
      <button type="button"
        className="flex-1 h-11 flex items-center justify-center gap-2 border border-[#E5E7EB]
          rounded-full bg-white text-[14px] font-medium text-brand-heading hover:bg-gray-50 transition">
        <i className="fa-brands fa-facebook text-[16px] text-[#1877F2]"></i>
        Facebook
      </button>
    </div>
  );
};

export default SocialAuthButtons;
