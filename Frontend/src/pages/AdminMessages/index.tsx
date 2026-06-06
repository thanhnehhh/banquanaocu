const AdminMessages = () => (
  <div className="flex flex-col gap-4 w-full h-[85vh] max-w-6xl mx-auto pt-4">
    <div className="flex items-center gap-3 text-sm mb-2">
      <span className="text-gray-500">Kênh ADMIN</span><span className="text-gray-400 font-bold">›</span><span className="font-bold text-[#1A1C19]">Tin nhắn khách hàng</span>
    </div>
    <div className="flex flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="w-[320px] border-r border-gray-100 flex flex-col bg-[#F9FAF4]">
        <div className="p-4 border-b border-gray-100"><h2 className="text-xl font-bold text-[#1A1C19] mb-4">Inbox</h2></div>
        <div className="flex-1 overflow-y-auto p-4 text-sm text-gray-500">Chưa có tin nhắn</div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center bg-white text-gray-400">
        <p>Chọn một cuộc trò chuyện</p>
      </div>
    </div>
  </div>
);

export default AdminMessages;
