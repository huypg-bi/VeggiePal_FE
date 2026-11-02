// Khóa cache của trang quản lý nội dung; đặt dưới gốc cache blog / recipe / video để các hook xóa có sẵn tự làm mới.
export const adminContentKeys = {
  blogs: (params) => ["blog", "posts", "admin", params],
  recipes: (params) => ["recipes", "admin", params],
  videos: ["videos", "admin", "all"],
};
