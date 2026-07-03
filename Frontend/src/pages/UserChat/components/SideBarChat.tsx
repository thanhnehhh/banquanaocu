import type { UserResponse } from "@/redux/chatSlice/chatSlice";
import chatSlice from "@/redux/chatSlice/chatSlice";
import { getConversations } from "@/services/chatService";
import dinhDangThoiGian from "@/utils/DinhDangThoiGian";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface ConversationSummary {
  conversationId: number;
  name?: string;
  isGroup?: boolean;
  createdAt: string;
  members: UserResponse[];
  lastMessage?: {
    content: string;
    sentAt: string;
    sender?: UserResponse;
  };
}

function SideBarChat() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [search, setSearch] = useState("");
  const user = useSelector((state: any) => state.auth.user);
  const activeConversationId = useSelector((state: any) => state.chat.conversationId);
  const dispatch = useDispatch();

  useEffect(() => {
    getConversations()
      .then((res) => setConversations((res as any).data))
      .catch(console.error);
  }, []);

  const handleChooseConversation = (id: number) => {
    dispatch(chatSlice.actions.setConversationId(id));
  };

  const getOtherUser = (members: UserResponse[]) =>
    members.find((m) => m.email !== user?.email);

  const getDisplayName = (conv: ConversationSummary) => {
    if (conv.isGroup) return conv.name || "Nhóm chat";
    const other = getOtherUser(conv.members);
    return `${other?.hoDem ?? ""} ${other?.ten ?? other?.email ?? ""}`.trim();
  };

  const filteredConversations = conversations.filter((conv) =>
    getDisplayName(conv).toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <aside className="border-r border-slate-200 bg-[#f9faf4] p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Tin nhắn</h1>
      </div>

      {/* Search */}
      <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm cuộc trò chuyện..."
          className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        />
      </div>

      {/* Conversation list */}
      <div className="mt-6 space-y-3">
        {filteredConversations.length === 0 && (
          <p className="text-center text-sm text-slate-400">Không có cuộc trò chuyện nào</p>
        )}
        {filteredConversations.map((conversation) => {
          const other = getOtherUser(conversation.members);
          const displayName = getDisplayName(conversation);
          const isActive = activeConversationId === conversation.conversationId;

          return (
            <div
              onClick={() => handleChooseConversation(conversation.conversationId)}
              key={conversation.conversationId}
              className={`group cursor-pointer rounded-3xl border p-4 transition ${
                isActive
                  ? "border-slate-400 bg-slate-100 shadow-sm"
                  : "border-transparent bg-white hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-800 text-sm font-semibold text-white shadow-sm">
                  {other?.avatar ? (
                    <img src={other.avatar} alt={displayName} className="h-full w-full object-cover" />
                  ) : (
                    displayName.charAt(0).toUpperCase()
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-sm font-semibold text-slate-900">{displayName}</h2>
                  {conversation.lastMessage ? (
                    <p className="truncate text-xs text-slate-500">
                      {conversation.lastMessage.content}
                    </p>
                  ) : (
                    <div className="text-xs text-slate-400">
                      {dinhDangThoiGian(conversation.createdAt)}
                    </div>
                  )}
                </div>

                {conversation.lastMessage && (
                  <div className="flex-shrink-0 text-[11px] text-slate-400">
                    {dinhDangThoiGian(conversation.lastMessage.sentAt)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export default SideBarChat;
