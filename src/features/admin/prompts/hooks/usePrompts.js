import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  activatePromptVersion,
  createPromptDraft,
  getPromptActivations,
  getPromptVersions,
  getPrompts,
  previewPromptDraft,
  publishPromptDraft,
  updatePromptDraft,
} from "../api/promptApi";
import { promptKeys } from "../queryKeys";

export function usePrompts() {
  return useQuery({ queryKey: promptKeys.list, queryFn: getPrompts });
}

export function usePromptVersions(key) {
  return useQuery({
    queryKey: promptKeys.versions(key),
    queryFn: () => getPromptVersions(key),
    enabled: Boolean(key),
  });
}

export function usePromptActivations(key) {
  return useQuery({
    queryKey: promptKeys.activations(key),
    queryFn: () => getPromptActivations(key),
    enabled: Boolean(key),
  });
}

// Mọi thay đổi (nháp, publish, kích hoạt) đều làm đổi danh sách, phiên bản và lịch sử kích hoạt nên làm mới cả nhóm.
function useRefreshingMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: promptKeys.all }),
  });
}

export const useCreateDraft = () => useRefreshingMutation(({ key, content }) => createPromptDraft(key, content));
export const useUpdateDraft = () =>
  useRefreshingMutation(({ key, version, content }) => updatePromptDraft(key, version, content));
export const usePublishDraft = () => useRefreshingMutation(({ key, version }) => publishPromptDraft(key, version));
export const useActivateVersion = () =>
  useRefreshingMutation(({ key, version }) => activatePromptVersion(key, version));

// Chạy thử không đổi dữ liệu nào nên không cần làm mới cache.
export function usePreviewDraft() {
  return useMutation({
    mutationFn: ({ key, version, sampleInput, variables }) =>
      previewPromptDraft(key, version, { sampleInput, variables }),
  });
}
