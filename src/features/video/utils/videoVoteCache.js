// Cập nhật danh sách vote của tôi cho video.
export function applyVoteToMyVideoVotes(list, vote) {
  if (!list) return list;
  const exists = list.some((v) => v.videoId === vote.videoId);
  if (!exists) return [...list, { videoId: vote.videoId, myVote: vote.myVote }];
  return list.map((v) => (v.videoId === vote.videoId ? { ...v, myVote: vote.myVote } : v));
}

// Cập nhật điểm voteScore trong feed video.
export function applyVoteToVideoFeed(data, vote) {
  if (!data?.pages) return data;
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: (page.items ?? []).map((video) =>
        video.id === vote.videoId ? { ...video, voteScore: vote.voteScore } : video
      ),
    })),
  };
}

// Cập nhật điểm voteScore cho chi tiết video.
export function applyVoteToVideo(video, vote) {
  if (!video) return video;
  return { ...video, voteScore: vote.voteScore };
}
