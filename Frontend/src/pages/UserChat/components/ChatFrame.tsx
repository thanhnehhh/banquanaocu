import chatSlice from "@/redux/chatSlice/chatSlice";
import axiosClient from "@/service/axiosClient";
import dinhDangThoiGian from "@/utils/DinhDangThoiGian";
import { stompClient } from "@/websocket/stompClient";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function ChatFrame() {
  const conversationId = useSelector((state: any) => state.chat.conversationId);
  const chatInfo = useSelector((state: any) => state.chat.chatInfo);
  const user = useSelector((state: any) => state.auth.user);
  const [myMaNguoiDung, setMyMaNguoiDung] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [page, setPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const dispatch = useDispatch();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isPrependingRef = useRef(false);
  const isFetchingRef = useRef(false);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (messagesContainerRef.current)
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    });
  };

  const loadMoreMessages = async () => {
    if (
      isFetchingRef.current ||
      isLoadingMore ||
      !conversationId ||
      page >= (chatInfo?.totalPages || 1) - 1 ||
      (chatInfo?.messages?.length || 0) < 20
    ) return;

    const container = messagesContainerRef.current;
    if (!container) return;

    isFetchingRef.current = true;
    isPrependingRef.current = true;
    setIsLoadingMore(true);
    const prevHeight = container.scrollHeight;
    const prevTop = container.scrollTop;

    try {
      const nextPage = page + 1;
      const res = await axiosClient.get(`/conversations/${conversationId}`, {
        params: { page: nextPage, size: 20 },
      });
      dispatch(chatSlice.actions.prependMessages((res as any).data.messages));
      setPage(nextPage);
      requestAnimationFrame(() => {
        if (!messagesContainerRef.current) return;
        messagesContainerRef.current.scrollTop =
          prevTop + (messagesContainerRef.current.scrollHeight - prevHeight);
        isPrependingRef.current = false;
      });
    } catch {
      isPrependingRef.current = false;
    } finally {
      setIsLoadingMore(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    if (!isPrependingRef.current) scrollToBottom();
  }, [chatInfo?.messages]);

  useEffect(() => {
    if (!conversationId) return;
    setPage(0);
    axiosClient
      .get(`/conversations/${conversationId}`, { params: { page: 0, size: 20 } })
      .then((res) => {
        const data = (res as any).data;
        dispatch(chatSlice.actions.setChatList(data));
        // Xác định maNguoiDung của user hiện tại
        const me = data.members.find((m: any) => m.email === user?.email);
        if (me) setMyMaNguoiDung(me.maNguoiDung);
        setTimeout(() => scrollToBottom(), 0);
      })
      .catch(console.error);
  }, [conversationId]);

  // Subscribe WebSocket topic khi conversation thay đổi
  useEffect(() => {
    if (!conversationId) return;
    const sub = stompClient.subscribe(
      `/topic/conversation/${conversationId}`,
      (msg) => {
        dispatch(chatSlice.actions.addMessage(JSON.parse(msg.body)));
      },
    );
    return () => sub.unsubscribe();
  }, [conversationId]);

  const handleSendMessage = () => {
    if (!text.trim() || !conversationId) return;
    stompClient.publish({
      destination: "/app/chat.send",
      body: JSON.stringify({ content: text.trim(), conversationId }),
    });
    setText("");
  };

  // Người còn lại trong cuộc trò chuyện 1-1
  const otherUser = chatInfo?.members?.find((m: any) => m.email !== user?.email);
  const displayName = chatInfo?.isGroup
    ? (chatInfo?.name || "Nhóm chat")
    : `${otherUser?.hoDem ?? ""} ${otherUser?.ten ?? otherUser?.email ?? ""}`.trim();

  if (conversationId === null) {
    return (
      <main className="flex min-h-180 items-center justify-center bg-[#f9faf4] p-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-700">Chưa chọn cuộc trò chuyện</h2>
          <p className="mt-2 text-sm text-slate-500">Hãy chọn một đoạn chat ở sidebar</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-180 flex-col bg-[#f9faf4] p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between rounded-3xl border border-gray-200 bg-[#f9faf4] p-5 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-slate-800 text-xl font-semibold text-white">
            {otherUser?.avatar ? (
              <img src={otherUser.avatar} alt={displayName} className="h-full w-full object-cover" />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{displayName}</h2>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div
          ref={messagesContainerRef}
          onScroll={() => {
            if ((messagesContainerRef.current?.scrollTop ?? 999) < 100) loadMoreMessages();
          }}
          className="max-h-115 overflow-y-auto px-5 py-4"
        >
          {isLoadingMore && (
            <div className="sticky top-0 z-10 mb-3 flex justify-center">
              <div className="rounded-full bg-white px-4 py-2 text-sm text-slate-500 shadow">
                Đang tải tin nhắn cũ...
              </div>
            </div>
          )}
          <div className="space-y-4">
            {[...(chatInfo?.messages || [])].reverse().map((message: any) => {
              const isMine = message.sender?.maNguoiDung === myMaNguoiDung;
              return (
                <div key={message.messageId} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  {!isMine && (
                    <div className="mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-800 text-xs font-semibold text-white">
                      {message.sender?.avatar ? (
                        <img src={message.sender.avatar} alt="" className="h-full w-full object-cover" />
                      ) : (
                        (message.sender?.ten ?? message.sender?.email ?? "?").charAt(0).toUpperCase()
                      )}
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      isMine
                        ? "rounded-br-md bg-blue-500 text-white"
                        : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    <p className="break-words leading-relaxed">{message.content}</p>
                    <div className={`mt-1 text-[11px] ${isMine ? "text-blue-100" : "text-slate-400"}`}>
                      {dinhDangThoiGian(message.sentAt)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="mt-4 rounded-3xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Nhập tin nhắn..."
            className="min-w-0 flex-1 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
          <button
            onClick={handleSendMessage}
            disabled={!text.trim()}
            className="rounded-2xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-900 disabled:opacity-50"
          >
            Gửi
          </button>
        </div>
      </div>
    </main>
  );
}

export default ChatFrame;
