import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getMyVotes, voteBlog } from "@/features/blog/api/blogApi";
import { blogKeys } from "@/features/blog/queryKeys";
import {
  applyVoteToBlog,
  applyVoteToFeed,
  applyVoteToMyVotes,
} from "@/features/blog/utils/voteCache";
import { selectIsAuthenticated, useAuthStore } from "@/features/auth/store/authStore";
import { normalizeIds } from "@/shared/utils/ids";

const toVoteMap = (votes) => new Map(votes.map((v) => [v.blogId, v.myVote]));

export function useMyVotes(blogIds) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const ids = normalizeIds(blogIds);

  return useQuery({
    queryKey: blogKeys.myVoteList(ids),
    queryFn: () => getMyVotes(ids),
    select: toVoteMap,
    enabled: isAuthenticated && ids.length > 0,
    // Feed "Xem thêm" làm danh sách id đổi -> giữ vote cũ trong lúc tải để tim không nháy.
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
}

export function useVoteBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ blogId }) => voteBlog(blogId, 1),
    onSuccess: (vote) => {
      queryClient.setQueriesData({ queryKey: blogKeys.myVotes }, (old) =>
        applyVoteToMyVotes(old, vote)
      );
      queryClient.setQueriesData({ queryKey: blogKeys.feeds }, (old) =>
        applyVoteToFeed(old, vote)
      );
      queryClient.setQueryData(blogKeys.detail(vote.blogId), (old) =>
        applyVoteToBlog(old, vote)
      );
    },
  });
}
