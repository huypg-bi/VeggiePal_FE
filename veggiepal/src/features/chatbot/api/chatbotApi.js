import {
  MOCK_MESSAGES_BY_SESSION,
  MOCK_SESSIONS,
} from "@/features/chatbot/data/mockChatData";
import {
  createLocalId,
  deriveSessionTitle,
  getMockAssistantReply,
} from "@/features/chatbot/utils/chatUtils";

/**
 * Lớp "API" cho chatbot — hiện chưa có backend nên trả Promise từ mock data
 * kèm độ trễ giả lập. Chữ ký hàm được thiết kế giống REST call thật
 * (GET /chatbot/sessions, POST /chatbot/sessions/:id/messages, ...) để sau
 * này thay bằng apiClient (@/shared/api/apiClient) mà không cần sửa hook/UI.
 */

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Giữ state trong module để mô phỏng "server" xuyên suốt phiên làm việc.
const sessions = MOCK_SESSIONS.map((s) => ({ ...s }));
const messagesBySession = Object.fromEntries(
  Object.entries(MOCK_MESSAGES_BY_SESSION).map(([id, msgs]) => [
    id,
    msgs.map((m) => ({ ...m })),
  ])
);

/** GET /chatbot/sessions — danh sách đoạn chat trong lịch sử */
export async function fetchChatSessions() {
  await delay(300);
  return sessions.map((s) => ({ ...s }));
}

/** GET /chatbot/sessions/:id/messages */
export async function fetchSessionMessages(sessionId) {
  await delay(200);
  return (messagesBySession[sessionId] ?? []).map((m) => ({ ...m }));
}

/** POST /chatbot/sessions — tạo đoạn chat mới, trống tin nhắn */
export async function createChatSession() {
  await delay(150);
  const session = {
    id: createLocalId("session"),
    title: "Cuộc trò chuyện mới",
    updatedAt: new Date().toISOString(),
  };
  sessions.unshift(session);
  messagesBySession[session.id] = [];
  return { ...session };
}

/** DELETE /chatbot/sessions/:id — xoá đoạn chat khỏi lịch sử */
export async function deleteChatSession(sessionId) {
  await delay(150);
  const index = sessions.findIndex((s) => s.id === sessionId);
  if (index !== -1) sessions.splice(index, 1);
  delete messagesBySession[sessionId];
}

/**
 * POST /chatbot/sessions/:id/messages — gửi câu hỏi, nhận lại tin nhắn của
 * user (đã lưu) + phản hồi mock của trợ lý.
 */
export async function sendChatMessage(sessionId, text) {
  const userMessage = {
    id: createLocalId("msg"),
    sessionId,
    role: "user",
    content: text,
    createdAt: new Date().toISOString(),
  };

  const list = messagesBySession[sessionId] ?? (messagesBySession[sessionId] = []);
  list.push(userMessage);

  const session = sessions.find((s) => s.id === sessionId);
  if (session) {
    session.updatedAt = userMessage.createdAt;
    if (session.title === "Cuộc trò chuyện mới") {
      session.title = deriveSessionTitle(text);
    }
  }

  // Giả lập độ trễ trả lời của AI.
  await delay(900);

  const { content, isFallback } = getMockAssistantReply(text);
  const assistantMessage = {
    id: createLocalId("msg"),
    sessionId,
    role: "assistant",
    content,
    isFallback,
    createdAt: new Date().toISOString(),
  };
  list.push(assistantMessage);

  return { userMessage, assistantMessage };
}
