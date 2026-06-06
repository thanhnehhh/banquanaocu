const mockShipping = [
  { id: "VC001", customer: "Quý", code: "012345988", rawPrice: "áihglashkfiK...", discount: "Nhanh", finalPrice: "30000", date: "03/04/2026", status: "Chờ xử lý" },
  { id: "VC002", customer: "ABC", code: "035698945", rawPrice: "SLJF;ALSVM...", discount: "Thường", finalPrice: "36363", date: "11/05/2026", status: "Đang giao" },
];

const AdminShipping = () => (
  <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pt-4 pb-12">
    <div className="flex items-center gap-3 text-sm"><span className="text-gray-500">Kênh ADMIN</span><span className="text-gray-400 font-bold">›</span><span className="font-bold text-[#1A1C19]">Quản lý vận chuyển</span></div>
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#F9FAF4]">
          <tr><th className="py-4 px-4 text-xs font-bold text-center">ID Đơn hàng</th><th className="py-4 px-4 text-xs font-bold text-center">Khách hàng</th><th className="py-4 px-4 text-xs font-bold text-center">Thực thu</th><th className="py-4 px-4 text-xs font-bold text-center">Thời gian</th><th className="py-4 px-4 text-xs font-bold text-center">Trạng thái</th></tr>
        </thead>
        <tbody>
          {mockShipping.map((item, i) => (
            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="py-4 px-4 text-sm text-center font-bold">{item.id}</td><td className="py-4 px-4 text-sm text-center">{item.customer}</td>
              <td className="py-4 px-4 text-sm text-center">{item.finalPrice}</td><td className="py-4 px-4 text-sm text-center">{item.date}</td>
              <td className={`py-4 px-4 text-sm font-bold text-center ${item.status === 'Chờ xử lý' ? 'text-orange-400' : 'text-blue-500'}`}>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminShipping;
