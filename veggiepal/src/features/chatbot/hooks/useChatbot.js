import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createChatSession,
  deleteChatSession,
  fetchChatSessions,
  fetchSessionMessages,
  sendChatMessage,
} from "@/features/chatbot/api/chatbotApi";
import {
  createLocalId,
  deriveSessionTitle,
  pickNextActiveSessionId,
  sortSessionsByRecent,
} from "@/features/chatbot/utils/chatUtils";

/**
 * State + hành động cho trang chatbot: danh sách đoạn chat (sidebar), đoạn
 * chat đang mở, tin nhắn của nó, và gửi câu hỏi mới.
 * Tin nhắn được cache theo sessionId trong state để chuyển qua lại giữa các
 * đoạn chat không phải gọi lại API mock mỗi lần.
 */
export function useChatbot() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messagesBySession, setMessagesBySession] = useState({});
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const list = await fetchChatSessions();
      if (cancelled) return;
      const sorted = sortSessionsByRecent(list);
      setSessions(sorted);
      setActiveSessionId(sorted[0]?.id ?? null);
      setLoadingSessions(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!activeSessionId || messagesBySession[activeSessionId]) return;
    let cancelled = false;
    (async () => {
      const msgs = await fetchSessionMessages(activeSessionId);
      if (cancelled) return;
      setMessagesBySession((prev) => ({ ...prev, [activeSessionId]: msgs }));
    })();
    return () => {
      cancelled = true;
    };
  }, [activeSessionId, messagesBySession]);

  const selectSession = useCallback((sessionId) => {
    setActiveSessionId(sessionId);
  }, []);

  const startNewSession = useCallback(async () => {
    const session = await createChatSession();
    setSessions((prev) => sortSessionsByRecent([session, ...prev]));
    setMessagesBySession((prev) => ({ ...prev, [session.id]: [] }));
    setActiveSessionId(session.id);
  }, []);

  const deleteSession = useCallback(
    async (sessionId) => {
      await deleteChatSession(sessionId);

      const nextActiveId = pickNextActiveSessionId(
        sessions,
        sessionId,
        activeSessionId
      );

      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      setMessagesBySession((prev) => {
        const next = { ...prev };
        delete next[sessionId];
        return next;
      });
      setActiveSessionId(nextActiveId);
    },
    [sessions, activeSessionId]
  );

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || sending || !activeSessionId) return;

      const sessionId = activeSessionId;
      const optimisticMessage = {
        id: createLocalId("msg"),
        sessionId,
        role: "user",
        content: trimmed,
        createdAt: new Date().toISOString(),
      };

      setMessagesBySession((prev) => ({
        ...prev,
        [sessionId]: [...(prev[sessionId] ?? []), optimisticMessage],
      }));
      setSessions((prev) =>
        sortSessionsByRecent(
          prev.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  updatedAt: optimisticMessage.createdAt,
                  title:
                    s.title === "Cuộc trò chuyện mới"
                      ? deriveSessionTitle(trimmed)
                      : s.title,
                }
              : s
          )
        )
      );

      setSending(true);
      try {
        const { assistantMessage } = await sendChatMessage(sessionId, trimmed);
        setMessagesBySession((prev) => ({
          ...prev,
          [sessionId]: [...(prev[sessionId] ?? []), assistantMessage],
        }));
      } finally {
        setSending(false);
      }
    },
    [activeSessionId, sending]
  );

  const activeMessages = useMemo(
    () => messagesBySession[activeSessionId] ?? [],
    [messagesBySession, activeSessionId]
  );

  return {
    sessions,
    activeSessionId,
    activeMessages,
    loadingSessions,
    sending,
    selectSession,
    startNewSession,
    deleteSession,
    sendMessage,
  };
}
