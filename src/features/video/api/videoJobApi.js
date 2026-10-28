import { recipeStateFromResponse } from "@/features/video/utils/videoJob";
import apiClient from "@/shared/api/apiClient";
import { VIDEO_JOB_ERROR_MESSAGES } from "@/shared/api/errorMessages";

// Upload tối đa 100MB nên cho chờ lâu hơn mặc định; BE trả 202 ngay sau khi kiểm tra file bằng ffprobe.
const UPLOAD_TIMEOUT_MS = 600_000;
// Bóc tách video đã đăng: BE tải tệp từ Cloudinary về và kiểm tra bằng ffprobe trước khi trả 202.
const PROCESS_EXISTING_TIMEOUT_MS = 120_000;

const EMPTY_PAGE = { items: [], page: 0, size: 0, totalElements: 0, totalPages: 0 };

// Lỗi 401/413/429/503 do Spring Security hoặc multipart trả về có thể không kèm mã 60xx nên dựa thêm vào HTTP status.
function toMessage(res, fallbackMessage) {
  const byCode = VIDEO_JOB_ERROR_MESSAGES[res.data?.code];
  if (byCode) return byCode;
  if (res.status === 401) return VIDEO_JOB_ERROR_MESSAGES[6001];
  if (res.status === 413) return VIDEO_JOB_ERROR_MESSAGES[6009];
  if (res.status === 429) return VIDEO_JOB_ERROR_MESSAGES[6003];
  if (res.status === 503) return VIDEO_JOB_ERROR_MESSAGES[6004];
  return res.data?.message || fallbackMessage;
}

// validateStatus tắt throw theo status, nên chỉ còn lỗi mạng / quá thời gian chờ rơi vào catch.
function networkError(error, timeoutMessage) {
  return new Error(
    error?.code === "ECONNABORTED" ? timeoutMessage : "Không kết nối được máy chủ, vui lòng thử lại",
    { cause: error },
  );
}

function unwrap(res, fallbackMessage) {
  if (res.status >= 400) throw new Error(toMessage(res, fallbackMessage));
  return res.data?.result;
}

export async function processVideo(file, { onUploadProgress } = {}) {
  const formData = new FormData();
  formData.append("file", file);

  let res;
  try {
    res = await apiClient.post("/ai/videos/process", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: UPLOAD_TIMEOUT_MS,
      onUploadProgress,
    });
  } catch (error) {
    throw networkError(error, "Tải video lên quá thời gian chờ, bạn kiểm tra mạng rồi thử lại nhé");
  }
  return unwrap(res, "Gửi video bóc tách thất bại");
}

export async function processExistingVideo(videoId) {
  let res;
  try {
    res = await apiClient.post("/ai/videos/process-existing", { videoId }, { timeout: PROCESS_EXISTING_TIMEOUT_MS });
  } catch (error) {
    throw networkError(error, "Gửi video bóc tách quá thời gian chờ, bạn thử lại sau nhé");
  }
  return unwrap(res, "Gửi video bóc tách thất bại");
}

export async function getVideoRecipe(videoId) {
  let res;
  try {
    res = await apiClient.get(`/ai/videos/by-video/${videoId}`);
  } catch (error) {
    throw networkError(error, "Tải công thức quá thời gian chờ");
  }
  const state = recipeStateFromResponse(res);
  if (state) return state;
  throw new Error(toMessage(res, "Không lấy được công thức AI của video"));
}

export async function getVideoJobs({ page = 0, size = 10 } = {}) {
  let res;
  try {
    res = await apiClient.get("/ai/videos", { params: { page, size } });
  } catch (error) {
    throw networkError(error, "Tải danh sách quá thời gian chờ");
  }
  return unwrap(res, "Không lấy được lịch sử bóc tách video") ?? EMPTY_PAGE;
}
