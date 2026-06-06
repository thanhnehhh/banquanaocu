import { useState } from "react";

const mockData = Array(4).fill({ id: "KN-12345", orderId: "123232", customer: "Nguyễn Văn A", reason: "Áo bị rách", proof: "aorach.png", date: "03/04/2026", status: "Đang chờ xử lí" });

const AdminComplaints = () => {
  const [activeTab, setActiveTab] = useState("Khiếu nại đơn hàng");
  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pt-4 pb-12">
      <div className="flex items-center gap-3 text-sm"><span className="text-gray-500">Kênh ADMIN</span><span className="text-gray-400 font-bold">›</span><span className="font-bold text-[#1A1C19]">Quản lý khiếu nại</span></div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
        <div className="flex justify-center gap-16 mb-8 relative">
          {["Khiếu nại đơn hàng", "Cảnh cáo người bán"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-2 text-lg font-medium transition-colors ${activeTab === tab ? "text-[#1A1C19] font-bold" : "text-gray-500"}`}>{tab}</button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="border-b border-gray-50">
              <th className="py-4 px-4 text-xs font-bold text-center">Mã khiếu nại</th><th className="py-4 px-4 text-xs font-bold text-center">ID đơn hàng</th>
              <th className="py-4 px-4 text-xs font-bold text-center">Khách hàng</th><th className="py-4 px-4 text-xs font-bold text-center">Lý do</th>
              <th className="py-4 px-4 text-xs font-bold text-center">Ngày gửi</th><th className="py-4 px-4 text-xs font-bold text-center">Trạng thái</th>
            </tr></thead>
            <tbody>
              {mockData.map((item, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-6 px-4 text-sm text-gray-500 text-center">{item.id}</td><td className="py-6 px-4 text-sm text-gray-500 text-center">{item.orderId}</td>
                  <td className="py-6 px-4 text-sm text-gray-500 text-center">{item.customer}</td><td className="py-6 px-4 text-sm text-gray-500 text-center">{item.reason}</td>
                  <td className="py-6 px-4 text-sm text-gray-500 text-center">{item.date}</td><td className="py-6 px-4 text-sm text-gray-500 text-center">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminComplaints;
