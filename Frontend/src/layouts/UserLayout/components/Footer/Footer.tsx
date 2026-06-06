import { Globe, Share2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#F7F7F7] mt-20">
      <div className="max-w-[1200px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h2 className="text-xl font-bold text-[#4E6A4E]">The Sustainable Editorial</h2>
          <p className="mt-4 text-sm text-gray-600">© 2024 The Sustainable Editorial. <br />Crafted for the conscious collective.</p>
          <div className="flex gap-4 mt-4 text-gray-600"><Share2 size={18} /><Globe size={18} /></div>
        </div>
        <div>
          <h3 className="font-semibold mb-4">RESOURCES</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="underline cursor-pointer">Community Guidelines</li>
            <li className="underline cursor-pointer">Sustainability Mission</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">COMPANY</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="underline cursor-pointer">Support</li>
            <li className="underline cursor-pointer">Terms of Service</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">JOIN THE COLLECTIVE</h3>
          <p className="text-sm text-gray-600 mb-4">Nhận bản tin về thời trang bền vững hàng tuần.</p>
          <div className="flex items-center bg-white rounded-full overflow-hidden">
            <input type="email" placeholder="Email của bạn" className="flex-1 px-4 h-[44px] outline-none text-sm" />
            <button className="bg-[#4E6A4E] text-white w-[44px] h-[44px] flex items-center justify-center">
              <i className="fa-solid fa-bell"></i>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
