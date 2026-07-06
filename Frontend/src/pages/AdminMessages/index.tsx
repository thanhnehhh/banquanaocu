const AdminMessages = () => {
    return (
        <div className="flex flex-col gap-4 w-full h-[85vh] max-w-6xl mx-auto pt-4">
            <div className="flex items-center gap-3 text-sm mb-2">
                <span className="text-gray-500">Kênh ADMIN</span>
                <span className="text-gray-400 font-bold">›</span>
                <span className="font-bold text-[#1A1C19]">Tin nhắn khách hàng</span>
            </div>

            <div className="flex flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                {/* --- CỘT TRÁI: INBOX --- */}
                <div className="w-[320px] border-r border-gray-100 flex flex-col bg-[#F9FAF4]">
                    <div className="p-4 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-[#1A1C19] mb-4">Inbox</h2>
                        <div className="relative">
                            <input type="text" placeholder="Search chats..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#49613E]" />
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {/* Mục Chat Đang chọn */}
                        <div className="flex items-center gap-3 p-4 bg-white border-l-4 border-[#51604B] cursor-pointer shadow-sm">
                            <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-bold text-sm truncate text-[#1A1C19]">Admin Oreka</h4>
                                    <span className="text-[10px] text-gray-400">10:24 AM</span>
                                </div>
                                <p className="text-xs text-gray-500 truncate">Chào bạn, mình có thể giúp gì...</p>
                            </div>
                        </div>

                        {/* Các mục Chat khác */}
                        <div className="flex items-center gap-3 p-4 hover:bg-white cursor-pointer border-l-4 border-transparent transition-colors">
                            <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-bold text-sm truncate text-[#1A1C19]">Linh Nguyen</h4>
                                    <span className="text-[10px] text-gray-400">Yesterday</span>
                                </div>
                                <p className="text-xs text-gray-500 truncate">Is the linen dress still available?</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- CỘT PHẢI: KHUNG CHAT --- */}
                <div className="flex-1 flex flex-col bg-white">
                    {/* Header Chat */}
                    <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                            <div>
                                <h3 className="font-bold text-[#1A1C19] text-sm">Admin Oreka</h3>
                                <p className="text-xs text-green-500 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> ONLINE</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-gray-400">
                            <svg className="w-5 h-5 cursor-pointer hover:text-[#49613E]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                            <svg className="w-5 h-5 cursor-pointer hover:text-[#49613E]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                            <svg className="w-5 h-5 cursor-pointer hover:text-[#49613E]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                    </div>

                    {/* Vùng Tin Nhắn */}
                    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                        <div className="text-center"><span className="bg-gray-100 text-gray-400 text-[10px] font-bold px-3 py-1 rounded-full">TODAY</span></div>

                        {/* Lời nhắc tự động */}
                        <div className="bg-[#FFF4E5] text-[#D97706] text-xs p-3 rounded-lg mx-auto flex gap-2 items-start max-w-lg">
                            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                            <p>Chính sách bảo vệ người mua: Luôn thanh toán qua ứng dụng để đảm bảo quyền lợi và sự an toàn của bạn.</p>
                        </div>

                        {/* Tin nhắn từ Khách hàng */}
                        <div className="flex items-end gap-2">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                            <div className="bg-[#F3F4F1] text-gray-700 p-4 rounded-2xl rounded-bl-none max-w-md text-sm">
                                Chào bạn! Cảm ơn bạn đã quan tâm đến sản phẩm của EcoThread Collective. Mình là Oreka, mình có thể hỗ trợ gì cho bạn về chiếc áo Blazer Linen này không?
                            </div>
                            <span className="text-[10px] text-gray-400 mb-1">10:20 AM</span>
                        </div>

                        {/* Tin nhắn của Admin gửi đi */}
                        <div className="flex items-end gap-2 justify-end">
                            <span className="text-[10px] text-gray-400 mb-1">10:22 AM</span>
                            <div className="bg-[#65795C] text-white p-4 rounded-2xl rounded-br-none max-w-md text-sm shadow-sm">
                                Chào Oreka! Mình muốn hỏi về kích thước thực tế của áo. Vai 42cm thì mặc size M có bị chật không nhỉ?
                            </div>
                        </div>

                        {/* Khách hàng nhắn lại */}
                        <div className="flex items-end gap-2">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                            <div className="bg-[#F3F4F1] text-gray-700 p-4 rounded-2xl rounded-bl-none max-w-md text-sm">
                                Dạ, với vai 42cm thì size M sẽ hơi ôm một chút theo kiểu fit. Nếu bạn muốn mặc thoải mái theo phong cách oversized đặc trưng của hãng thì mình khuyên nên cân nhắc size L ạ. <br/><br/>Mình có thể gửi thêm ảnh chi tiết số đo cho bạn nhé?
                            </div>
                            <span className="text-[10px] text-gray-400 mb-1">10:24 AM</span>
                        </div>
                    </div>

                    {/* Vùng nhập văn bản */}
                    <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
                        <button className="text-gray-400 hover:text-gray-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg></button>
                        <button className="text-gray-400 hover:text-gray-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></button>

                        <div className="flex-1 bg-[#F9FAF4] rounded-full border border-gray-200 px-4 py-2.5 flex items-center">
                            <input type="text" placeholder="Type your message..." className="flex-1 bg-transparent border-none focus:outline-none text-sm" />
                            <button className="text-gray-400 hover:text-gray-600 ml-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></button>
                        </div>

                        <button className="w-10 h-10 bg-[#51604B] rounded-full flex items-center justify-center text-white hover:bg-[#3d4938] transition-colors shadow-sm">
                            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminMessages;