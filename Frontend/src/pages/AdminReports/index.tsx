import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const monthlyRevenueData = [
  { name: 'Jan', value: 1300000 }, { name: 'Feb', value: 2400000 }, { name: 'Mar', value: 1400000 },
  { name: 'Apr', value: 1550000 }, { name: 'May', value: 2450000 }, { name: 'Jun', value: 1100000 },
];
const productRevenueData = [
  { name: 'Áo', value: 1300000 }, { name: 'Quần', value: 2400000 }, { name: 'Váy', value: 1400000 },
  { name: 'Giày', value: 1550000 }, { name: 'Túi', value: 2450000 }, { name: 'Phụ kiện', value: 1100000 },
];

const chartStyle = { contentStyle: { borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' } };

const AdminReports = () => (
  <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pt-4 pb-12">
    <div className="flex items-center gap-3 text-sm"><span className="text-gray-500">Kênh ADMIN</span><span className="text-gray-400 font-bold">›</span><span className="font-bold text-[#1A1C19]">Thống kê báo cáo</span></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[{ label: "Doanh thu", val: "94.312$" }, { label: "Tổng Đơn hàng", val: "43.45M" }, { label: "Khách hàng", val: "175.3M" }, { label: "Cửa hàng", val: "9273" }].map(({ label, val }) => (
        <div key={label} className="bg-[#EBF5E4] rounded-2xl p-6 flex flex-col gap-2"><span className="text-gray-700 font-medium text-lg">{label}</span><span className="text-4xl font-bold text-[#49613E]">{val}</span></div>
      ))}
    </div>
    {[{ title: "Biểu đồ doanh thu theo tháng", data: monthlyRevenueData }, { title: "Biểu đồ doanh thu theo sản phẩm", data: productRevenueData }].map(({ title, data }) => (
      <div key={title} className="flex flex-col gap-4 mt-4">
        <h3 className="text-xl font-bold text-[#1A1C19]">{title}</h3>
        <div className="bg-[#EBF5E4] rounded-2xl p-6 w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#C4D7B5" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} dx={-10} />
              <Tooltip {...chartStyle} />
              <Line type="monotone" dataKey="value" stroke="#98B880" strokeWidth={3} dot={{ fill: '#EBF5E4', stroke: '#98B880', strokeWidth: 3, r: 5 }} activeDot={{ r: 8, fill: '#49613E', stroke: 'white' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    ))}
  </div>
);

export default AdminReports;
