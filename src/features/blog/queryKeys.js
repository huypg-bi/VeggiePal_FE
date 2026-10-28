export const blogKeys = {
  categories: ["blog", "categories"],
  categoryTree: (type, activeOnly) => [
    "blog",
    "categories",
    "tree",
    { type, activeOnly },
  ],
  category: (id) => ["blog", "categories", "detail", id],

  blogs: ["blog", "posts"],
  feeds: ["blog", "posts", "feed"],
  feed: (params) => ["blog", "posts", "feed", params],
  // Nằm dưới `feeds` nên vote làm cập nhật cả feed này (applyVoteToFeed); theo dõi / bỏ theo dõi thì làm mới nó.
  followingFeeds: ["blog", "posts", "feed", "following"],
  followingFeed: (size) => ["blog", "posts", "feed", "following", { size }],
  detail: (id) => ["blog", "posts", "detail", id],
  related: (id) => ["blog", "posts", "related", id],
  mine: (status, size) => ["blog", "posts", "mine", { status, size }],

  // Vote của tôi trên danh sách bài (chỉ có khi đăng nhập).
  myVotes: ["blog", "my-votes"],
  myVoteList: (ids) => ["blog", "my-votes", ids],

  // Theo dõi người dùng (identity-service): id những người tôi theo dõi và số liệu theo dõi của từng người.
  followingIds: ["users", "following", "ids"],
  followStats: (userId) => ["users", "follow-stats", userId],
  followLists: ["users", "follow-list"],
  followList: (userId, kind) => ["users", "follow-list", userId, kind],

  comments: ["blog", "comments"],
  commentList: (targetId, params) => ["blog", "comments", "list", targetId, params],
  replies: (commentId, params) => ["blog", "comments", "replies", commentId, params],
};
