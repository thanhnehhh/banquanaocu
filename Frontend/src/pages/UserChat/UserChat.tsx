import SideBarChat from "./components/SideBarChat";
import ChatFrame from "./components/ChatFrame";

function UserChat() {
  return (
    <div className="min-h-screen bg-[#f9faf4] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-3xl bg-[#f9faf4] shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="grid min-h-180 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <SideBarChat />
          <ChatFrame />
        </div>
      </div>
    </div>
  );
}

export default UserChat;
