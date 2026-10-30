import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { selectIsAuthenticated, useAuthStore } from "@/features/auth/store/authStore";
import { getMyVideoVotes, removeVideoVote, voteVideo } from "@/features/video/api/videoApi";
import { videoKeys } from "@/features/video/queryKeys";
import {
  applyVoteToMyVideoVotes,
  applyVoteToVideo,
  applyVoteToVideoFeed,
} from "@/features/video/utils/videoVoteCache";
import { normalizeIds } from "@/shared/utils/ids";

const toVoteMap = (votes) => new Map(votes.map((v) => [v.videoId, v.myVote]));

// Lấy danh sách vote của tôi trên các video đang hiển thị.
export function useMyVideoVotes(videoIds) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const ids = normalizeIds(videoIds);

  return useQuery({
    queryKey: videoKeys.myVoteList(ids),
    queryFn: () => getMyVideoVotes(ids),
    select: toVoteMap,
    enabled: isAuthenticated && ids.length > 0,
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
}

// Mutation bình chọn hoặc hủy vote video dạng toggle.
export function useVoteVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ videoId, value = 1 }) => voteVideo(videoId, value),
    onSuccess: (vote) => {
      queryClient.setQueriesData({ queryKey: videoKeys.myVotes }, (old) =>
        applyVoteToMyVideoVotes(old, vote)
      );
      queryClient.setQueriesData({ queryKey: ["videos", "feed"] }, (old) =>
        applyVoteToVideoFeed(old, vote)
      );
      queryClient.setQueryData(videoKeys.detail(vote.videoId), (old) =>
        applyVoteToVideo(old, vote)
      );
    },
  });
}

// Mutation xóa vote video rõ ràng.
export function useRemoveVideoVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ videoId }) => removeVideoVote(videoId),
    onSuccess: (vote) => {
      queryClient.setQueriesData({ queryKey: videoKeys.myVotes }, (old) =>
        applyVoteToMyVideoVotes(old, vote)
      );
      queryClient.setQueriesData({ queryKey: ["videos", "feed"] }, (old) =>
        applyVoteToVideoFeed(old, vote)
      );
      queryClient.setQueryData(videoKeys.detail(vote.videoId), (old) =>
        applyVoteToVideo(old, vote)
      );
    },
  });
}
