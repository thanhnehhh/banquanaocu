const AdminReviews = () => (
  <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto pt-4 pb-12">
    <div className="flex items-center gap-3 text-sm"><span className="text-gray-500">Kênh ADMIN</span><span className="text-gray-400 font-bold">›</span><span className="font-bold text-[#1A1C19]">Quản lý đánh giá</span></div>
    <div className="bg-[#EBF5E4] rounded-2xl p-6 flex flex-col md:flex-row items-center gap-8 border border-[#CDE5BC]">
      <div className="flex flex-col items-center"><span className="text-5xl font-bold text-[#49613E]">4,2/5</span><div className="flex text-yellow-400 text-lg mt-1">★★★★<span className="text-gray-300">★</span></div></div>
      <div className="flex flex-wrap gap-3">
        <button className="px-5 py-2 bg-[#49613E] text-white text-sm font-bold rounded-full">Tất cả</button>
        <button className="px-5 py-2 bg-white text-gray-700 text-sm rounded-full border shadow-sm">5 sao (100)</button>
        <button className="px-5 py-2 bg-white text-gray-700 text-sm rounded-full border shadow-sm">4 sao (15)</button>
        <button className="px-5 py-2 bg-white text-gray-700 text-sm rounded-full border shadow-sm">1-3 sao (5)</button>
      </div>
    </div>
  </div>
);

export default AdminReviews;
