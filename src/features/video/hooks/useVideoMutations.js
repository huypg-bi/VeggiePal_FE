import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createVideo,
  deleteVideo,
  submitVideo,
  updateVideo,
} from "@/features/video/api/videoApi";
import { videoKeys } from "@/features/video/queryKeys";

function useInvalidateVideos() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: videoKeys.all });
}

export function useCreateVideo() {
  const invalidate = useInvalidateVideos();
  return useMutation({
    mutationFn: ({ formData, onUploadProgress }) =>
      createVideo(formData, { onUploadProgress }),
    onSuccess: invalidate,
  });
}

export function useUpdateVideo() {
  const invalidate = useInvalidateVideos();
  return useMutation({
    mutationFn: ({ id, ...payload }) => updateVideo(id, payload),
    onSuccess: invalidate,
  });
}

export function useSubmitVideo() {
  const invalidate = useInvalidateVideos();
  return useMutation({
    mutationFn: submitVideo,
    onSuccess: invalidate,
  });
}

export function useDeleteVideo() {
  const invalidate = useInvalidateVideos();
  return useMutation({
    mutationFn: deleteVideo,
    onSuccess: invalidate,
  });
}
