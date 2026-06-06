import type { UserResponse } from "@/redux/chatSlice/chatSlice";
import chatSlice from "@/redux/chatSlice/chatSlice";
import axiosClient from "@/service/axiosClient";
import dinhDangThoiGian from "@/utils/DinhDangThoiGian";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface Conversations {
  id: number;
  name?: string;
  isGroup?: boolean;
  createdAt: string;
  members: UserResponse[];
}

function SideBarChat() {
  const [conversations, setConversations] = useState<Conversations[]>([]);
  const user = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    axiosClient.get("/conversations")
      .then((res) => setConversations(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleChooseConversation = (id: number) => {
    dispatch(chatSlice.actions.setConversationId(id));
  };

  return (
    <aside className="border-r border-slate-200 bg-[#f9faf4] p-6">
      <div className="mb-6"><h1 className="text-2xl font-semibold text-slate-900">Inbox</h1></div>
      <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
        <input type="search" placeholder="Search chats..." className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200" />
      </div>
      <div className="mt-6 space-y-3">
        {conversations.map((conversation) => (
          <div onClick={() => handleChooseConversation(conversation.id)} key={conversation.id}
            className="group rounded-3xl border border-transparent bg-white p-4 transition hover:border-slate-300 hover:shadow-sm cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-sm font-semibold text-white shadow-sm">
                {conversation.members.find((m) => m.email !== user.email)?.email.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <h2 className="text-sm font-semibold text-slate-900">
                  {conversation.members.find((m) => m.email !== user.email)?.email}
                </h2>
                <div className="text-xs text-slate-500">{dinhDangThoiGian(conversation.createdAt)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default SideBarChat;
