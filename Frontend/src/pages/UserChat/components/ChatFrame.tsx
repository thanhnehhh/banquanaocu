import chatSlice from "@/redux/chatSlice/chatSlice";
import axiosClient from "@/service/axiosClient";
import dinhDangThoiGian from "@/utils/DinhDangThoiGian";
import { stompClient } from "@/websocket/stompClient";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function ChatFrame() {
  const conversationId = useSelector((state: any) => state.chat.conversationId);

  const chatInfo = useSelector((state: any) => state.chat.chatInfo);

  const connected = useSelector((state: any) => state.socket.connected);
  const user = useSelector((state: any) => state.auth.user);

  const [userCurrentId, setUserCurrentId] = useState<number | null>(null);

  const [text, setText] = useState("");

  const [page, setPage] = useState(0);

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const dispatch = useDispatch();

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // dùng để biết có đang prepend message cũ không
  const isPrependingRef = useRef(false);

  // dùng để tránh spam load
  const isFetchingRef = useRef(false);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
    });
  };

  const loadMoreMessages = async () => {
    if (
      isFetchingRef.current ||
      isLoadingMore ||
      !conversationId ||
      page >= (chatInfo?.totalPages || 1) - 1 ||
      (chatInfo?.messages?.length || 0) < 50
    ) {
      return;
    }

    const container = messagesContainerRef.current;

    if (!container) return;

    isFetchingRef.current = true;
    isPrependingRef.current = true;

    setIsLoadingMore(true);

    // lưu vị trí cũ
    const previousScrollHeight = container.scrollHeight;
    const previousScrollTop = container.scrollTop;

    try {
      const nextPage = page + 1;

      const res = await axiosClient.get(`/conversations/${conversationId}`, {
        params: {
          page: nextPage,
        },
      });

      const data = res.data as any;

      dispatch(chatSlice.actions.prependMessages(data.messages));

      setPage(nextPage);

      requestAnimationFrame(() => {
        if (!messagesContainerRef.current) return;

        const newScrollHeight = messagesContainerRef.current.scrollHeight;

        // giữ nguyên vị trí đang xem
        messagesContainerRef.current.scrollTop =
          previousScrollTop + (newScrollHeight - previousScrollHeight);

        isPrependingRef.current = false;
      });
    } catch (err) {
      console.log("Load more error:", err);
      isPrependingRef.current = false;
    } finally {
      setIsLoadingMore(false);
      isFetchingRef.current = false;
    }
  };

  const handleScroll = () => {
    const container = messagesContainerRef.current;

    if (!container) return;

    // gần top thì load thêm
    if (container.scrollTop < 100) {
      loadMoreMessages();
    }
  };

  // auto scroll xuống dưới khi có message mới
  useEffect(() => {
    // đang prepend thì không scroll xuống
    if (isPrependingRef.current) return;

    scrollToBottom();
  }, [chatInfo?.messages]);

  // load conversation
  useEffect(() => {
    if (!conversationId) return;

    setPage(0);

    axiosClient
      .get(`/conversations/${conversationId}`, {
        params: {
          page: 0,
        },
      })
      .then((res) => {
        const data = res.data as any;

        dispatch(chatSlice.actions.setChatList(data));

        const userCurrent = data.members.find(
          (member: any) => member.email === user.email,
        );

        setUserCurrentId(userCurrent.maNguoiDung);

        // conversation mới -> xuống cuối
        setTimeout(() => {
          scrollToBottom();
        }, 0);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [conversationId]);

  // realtime message
  useEffect(() => {
    if (!connected) return;
    if (!conversationId) return;

    console.log(`Subscribe /topic/conversation/${conversationId}`);

    const subscription = stompClient.subscribe(
      `/topic/conversation/${conversationId}`,
      (message) => {
        const newMessage = JSON.parse(message.body);

        dispatch(chatSlice.actions.addMessage(newMessage));
      },
    );

    return () => {
      console.log(`Unsubscribe /topic/conversation/${conversationId}`);

      subscription.unsubscribe();
    };
  }, [conversationId, connected]);

  const handleSendMessage = () => {
    if (text.trim() === "") return;

    stompClient.publish({
      destination: "/app/chat.send",
      body: JSON.stringify({
        content: text,
        conversationId,
      }),
    });

    setText("");
  };

  const handleSubmitMessage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  if (conversationId === null) {
    return (
      <main className="flex min-h-180 items-center justify-center bg-[#f9faf4] p-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-700">
            Chưa chọn cuộc trò chuyện
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Hãy chọn một đoạn chat ở sidebar
          </p>
        </div>
      </main>
    );
  }

  const otherUser = chatInfo?.members?.find(
    (member: any) => member.email !== user.email,
  );

  return (
    <main className="flex min-h-180 flex-col bg-[#f9faf4] p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between rounded-3xl border border-gray-200 bg-[#f9faf4] p-5 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-xl font-semibold text-white">
            {otherUser?.email?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {otherUser?.email}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-500">
          <button className="rounded-full bg-slate-100 p-2 transition hover:bg-slate-200">
            📞
          </button>

          <button className="rounded-full bg-slate-100 p-2 transition hover:bg-slate-200">
            🎥
          </button>

          <button className="rounded-full bg-slate-100 p-2 transition hover:bg-slate-200">
            ⚙️
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-b from-white to-slate-50 shadow-sm">
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
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
              const isMine = message.senderId === userCurrentId;

              return (
                <div
                  key={message.id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`
                max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm
                ${
                  isMine
                    ? "rounded-br-md bg-blue-500 text-white"
                    : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
                }
              `}
                  >
                    <p className="break-words leading-relaxed">
                      {message.content}
                    </p>

                    <div
                      className={`mt-1 text-[11px] ${
                        isMine ? "text-blue-100" : "text-slate-400"
                      }`}
                    >
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
          <button className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100">
            ➕
          </button>

          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleSubmitMessage}
            placeholder="Type your message..."
            className="min-w-0 flex-1 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />

          <button
            onClick={handleSendMessage}
            className="rounded-2xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}

export default ChatFrame;
