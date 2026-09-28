import { useEffect, useRef, useState } from "react";
import { Info, Loader2 } from "lucide-react";

import HomeHeader from "@/features/meal-planner/components/HomeHeader";
import HomeFooter from "@/features/meal-planner/components/HomeFooter";
import { useChatbot } from "@/features/chatbot/hooks/useChatbot";
import ChatSidebar from "@/features/chatbot/components/ChatSidebar";
import ChatHeader from "@/features/chatbot/components/ChatHeader";
import ChatMessage from "@/features/chatbot/components/ChatMessage";
import ChatEmptyState from "@/features/chatbot/components/ChatEmptyState";
import TypingIndicator from "@/features/chatbot/components/TypingIndicator";
import ChatComposer from "@/features/chatbot/components/ChatComposer";

/**
 * Trang chatbot dinh dưỡng (/chatbot).
 * Chưa có API AI thật — toàn bộ session/tin nhắn dùng mock data + độ trễ
 * giả lập qua @/features/chatbot/api/chatbotApi.js, dễ thay bằng API thật
 * sau này mà không đổi UI.
 */
export default function ChatbotScreen() {
  const {
    sessions,
    activeSessionId,
    activeMessages,
    loadingSessions,
    sending,
    selectSession,
    startNewSession,
    deleteSession,
    sendMessage,
  } = useChatbot();

  const [draft, setDraft] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const scrollRef = useRef(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [activeMessages, sending]);

  const handleSend = () => {
    const text = draft;
    setDraft("");
    sendMessage(text);
  };

  const handlePromptClick = (text) => {
    sendMessage(text);
  };

  return (
    <div className="min-h-dvh bg-canvas">
      <HomeHeader />

      <main className="mx-auto w-full max-w-[1280px] px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex h-[75dvh] min-h-[620px] max-h-[960px] overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <ChatSidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            collapsed={collapsed}
            onToggleCollapsed={() => setCollapsed((c) => !c)}
            onSelectSession={selectSession}
            onNewChat={startNewSession}
            onDeleteSession={deleteSession}
          />

          <div className="flex min-w-0 flex-1 flex-col">
            <ChatHeader
              title={activeSession?.title ?? "Cuộc trò chuyện dinh dưỡng"}
              onNewChat={startNewSession}
            />

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
              <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                {loadingSessions ? (
                  <div className="flex items-center justify-center gap-2 py-24 text-sm text-subtle">
                    <Loader2 className="h-5 w-5 animate-spin text-brand" />
                    Đang tải lịch sử trò chuyện…
                  </div>
                ) : !activeSessionId ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-24 text-center text-sm text-subtle">
                    <p>
                      Chưa có đoạn chat nào. Nhấn "Đoạn chat mới" để bắt đầu.
                    </p>
                  </div>
                ) : activeMessages.length === 0 ? (
                  <ChatEmptyState onPromptClick={handlePromptClick} />
                ) : (
                  activeMessages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))
                )}
                {sending && <TypingIndicator />}
              </div>
            </div>

            <ChatComposer
              value={draft}
              onChange={setDraft}
              onSend={handleSend}
              disabled={sending || !activeSessionId}
            />

            <p className="flex items-center justify-center gap-1.5 px-6 pb-4 text-center text-xs text-subtle">
              <Info className="h-3.5 w-3.5 shrink-0" />
              Trợ lý cung cấp thông tin tham khảo về ăn chay và dinh dưỡng,
              không thay thế tư vấn y tế chuyên nghiệp. Hãy hỏi ý kiến chuyên
              gia khi có vấn đề sức khỏe.
            </p>
          </div>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
}
