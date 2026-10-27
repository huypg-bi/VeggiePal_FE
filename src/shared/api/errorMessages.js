// Mã lỗi `code` của BE -> tiếng Việt, mỗi service một bảng riêng vì cùng số mã có thể khác nghĩa giữa các service.

// identity-service (10xx)
export const AUTH_ERROR_MESSAGES = {
  1001: "Dữ liệu chưa hợp lệ, vui lòng kiểm tra lại",
  1002: "Email này đã được đăng ký, vui lòng dùng email khác hoặc đăng nhập",
  1003: "Mật khẩu phải có ít nhất 6 ký tự",
  1004: "Email không hợp lệ",
  1005: "Vui lòng nhập email",
  1006: "Vui lòng nhập họ và tên",
  1010: "Vui lòng nhập mật khẩu",
  1018: "Dữ liệu chưa hợp lệ, vui lòng kiểm tra lại",
  1019: "Không xác thực được tài khoản Google. Vui lòng thử lại.",
};

// identity-service (10xx) + nutrition-service (20xx), dùng cho hồ sơ, chỉ số sức khỏe, dị ứng
const INVALID_DATA = "Dữ liệu chưa hợp lệ, vui lòng kiểm tra lại";
const HEIGHT_INVALID = "Chiều cao 50 đến 250 cm, tối đa 1 chữ số thập phân";
const WEIGHT_INVALID = "Cân nặng 20 đến 300 kg, tối đa 1 chữ số thập phân";
const ALLERGY_INVALID = "Danh sách dị ứng không hợp lệ";

export const PROFILE_ERROR_MESSAGES = {
  1001: INVALID_DATA,
  1018: INVALID_DATA,
  1003: "Mật khẩu tối thiểu 6 ký tự",
  1006: "Vui lòng nhập họ tên",
  1007: "Không tìm thấy tài khoản",
  1008: "Phiên đăng nhập đã hết hạn",
  1009: "Bạn không có quyền thực hiện",
  1010: "Vui lòng nhập mật khẩu",
  1011: "Mật khẩu hiện tại không đúng",
  1012: "Mật khẩu mới phải khác mật khẩu hiện tại",
  1013: "Ngày sinh phải ở quá khứ",
  1014: "Vui lòng chọn ảnh đại diện",
  1015: "Ảnh phải là JPEG, PNG hoặc WEBP",
  1016: "Ảnh không được vượt quá 2MB",
  1017: "Không tải được ảnh lên, vui lòng thử lại sau",
  2001: HEIGHT_INVALID,
  2002: HEIGHT_INVALID,
  2003: WEIGHT_INVALID,
  2004: WEIGHT_INVALID,
  2006: ALLERGY_INVALID,
  2007: ALLERGY_INVALID,
};

// nutrition-service (20xx), nhật ký ăn uống
export const DIARY_ERROR_MESSAGES = {
  1001: "Dữ liệu chưa hợp lệ, vui lòng kiểm tra lại",
  1008: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
  1018: "Dữ liệu chưa hợp lệ, vui lòng kiểm tra lại",
  2010: "Khẩu phần phải từ 0,01 đến 100, tối đa 2 chữ số thập phân",
  2011: "Lượng nước phải là số nguyên ml lớn hơn 0 và tối đa 100.000",
  2012: "Hãy nhập loại vận động (tối đa 100 ký tự) và số phút từ 1 đến 1440",
  2013: "Không tìm thấy bản ghi này trong nhật ký, có thể nó đã bị xóa",
  2014: "Thực đơn hoặc bữa ăn này không có trong ngày đã chọn",
  2015: "Chưa lấy được thực đơn để ghi bữa ăn, vui lòng thử lại sau",
};

// blog-service (30xx): danh mục, bài viết, ảnh bìa, bình luận, vote, kiểm duyệt
export const BLOG_ERROR_MESSAGES = {
  1002: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
  1008: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
  1009: "Bạn không có quyền thực hiện thao tác này",
  1017: "Không tải được tệp lên, vui lòng thử lại sau",
  1018: "Dữ liệu không hợp lệ",
  3001: "Tên danh mục không được để trống và tối đa 100 ký tự",
  3002: "Vui lòng chọn loại danh mục",
  3003: "Danh mục không tồn tại",
  3004: "Đã có danh mục cùng tên ở cùng cấp",
  3005: "Không xóa được: danh mục đang có bài viết hoặc danh mục con. Hãy tắt hiển thị thay vì xóa",
  3006: "Danh mục chỉ có tối đa 2 cấp",
  3007: "Danh mục này đã ngừng hoạt động, vui lòng chọn danh mục khác",
  3008: "Vui lòng chọn danh mục",
  3010: "Vui lòng nhập tiêu đề bài viết",
  3011: "Tiêu đề tối đa 150 ký tự",
  3012: "Vui lòng nhập nội dung bài viết",
  3013: "Nội dung bài viết tối thiểu 20 ký tự",
  3014: "Bài viết không tồn tại hoặc chưa được đăng",
  3015: "Bài viết đang ở trạng thái không cho phép thao tác này",
  3020: "Vui lòng chọn ảnh bìa",
  3021: "Ảnh bìa phải là JPEG, PNG hoặc WEBP",
  3022: "Ảnh bìa không được vượt quá 5MB",
  3030: "Vui lòng nhập nội dung bình luận",
  3031: "Bình luận tối đa 500 từ",
  3032: "Bình luận không tồn tại hoặc đã bị xóa",
  3033: "Chỉ có thể phản hồi bình luận gốc, không phản hồi lồng nhau",
  3034: "Bình luận gốc không thuộc bài viết này",
  3035: "Bài viết này không còn tồn tại hoặc đã bị gỡ",
  3036: "Loại nội dung này chưa được hỗ trợ",
  3037: "Bình luận quá dài (tối đa 5000 ký tự)",
  3040: "Giá trị bình chọn không hợp lệ",
  3041: "Bạn không thể bình chọn bài viết của chính mình",
  3050: "Hệ thống kiểm duyệt tạm thời không khả dụng, vui lòng thử lại sau",
  3051: "Kết quả kiểm duyệt không hợp lệ, vui lòng thử lại sau",
  3052: "Dữ liệu kiểm duyệt không khớp tác giả",
};

// blog-service (30xx), video
export const VIDEO_ERROR_MESSAGES = {
  1002: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
  1008: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
  1009: "Bạn không có quyền thực hiện thao tác này",
  1017: "Không tải được video lên, vui lòng thử lại sau",
  1018: "Dữ liệu không hợp lệ",
  3003: "Danh mục không tồn tại",
  3007: "Danh mục này đã ngừng hoạt động, vui lòng chọn danh mục khác",
  3008: "Vui lòng chọn danh mục",
  3050: "Hệ thống kiểm duyệt tạm thời không khả dụng, vui lòng thử lại sau",
  3051: "Kết quả kiểm duyệt không hợp lệ",
  3052: "Dữ liệu kiểm duyệt không khớp tác giả",
  3060: "Video không tồn tại hoặc chưa được đăng",
  3061: "Vui lòng nhập tiêu đề video",
  3062: "Tiêu đề video tối đa 150 ký tự",
  3063: "Mô tả video tối đa 5000 ký tự",
  3064: "Chỉ được chọn đúng một nguồn video: tệp video hoặc liên kết YouTube",
  3065: "Video phải là tệp định dạng .mp4",
  3066: "Tệp video vượt quá dung lượng cho phép (tối đa 30MB)",
  3067: "Liên kết YouTube không hợp lệ",
  3068: "Video đang ở trạng thái không cho phép thao tác này",
};

// recipe-service (40xx): nguyên liệu (4000-4009)
export const INGREDIENT_ERROR_MESSAGES = {
  1001: "Dữ liệu không hợp lệ, vui lòng kiểm tra lại các trường đã nhập",
  1008: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
  1009: "Bạn không có quyền thực hiện thao tác này",
  4000: "Vui lòng nhập tên nguyên liệu",
  4001: "Tên nguyên liệu tối đa 150 ký tự",
  4002: "Mô tả tối đa 1000 ký tự",
  4003: "Nguyên liệu không tồn tại",
  4004: "Đã có nguyên liệu cùng tên",
  4005: "Vui lòng nhập năng lượng",
  4006: "Vui lòng nhập lượng đạm",
  4007: "Vui lòng nhập lượng tinh bột",
  4008: "Vui lòng nhập lượng béo",
  4009: "Giá trị dinh dưỡng phải từ 0 trở lên",
};

// recipe-service (40xx): công thức (41xx)
export const RECIPE_ERROR_MESSAGES = {
  1001: "Dữ liệu không hợp lệ, vui lòng kiểm tra lại các trường đã nhập",
  1008: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
  1009: "Bạn không có quyền thực hiện thao tác này",
  4003: "Có nguyên liệu không tồn tại",
  4100: "Công thức không tồn tại",
  4101: "Vui lòng nhập tên công thức",
  4102: "Bạn không thể chỉnh sửa công thức này",
  4103: "Công thức này đã được đăng rồi",
  4104: "Có nguyên liệu đã ngừng sử dụng, vui lòng chọn nguyên liệu khác",
  4105: "Có nguyên liệu bị chọn trùng, mỗi nguyên liệu chỉ được thêm một lần",
  4106: "Các bước thực hiện bị trùng số thứ tự, vui lòng thử lại",
  4107: "Có đơn vị nguyên liệu chưa được hỗ trợ, vui lòng chọn lại đơn vị",
  4108: "Công thức đã bị xóa hoặc đang bị ẩn nên không thể thực hiện thao tác này",
};

// location-service (50xx)
export const RESTAURANT_ERROR_MESSAGES = {
  1018: "Dữ liệu tìm kiếm không hợp lệ",
  5001: "Tọa độ không hợp lệ",
  5002: "Bán kính tìm kiếm phải lớn hơn 0 và tối đa 10 km",
};

// ai-service (60xx), gợi ý nội dung trang chủ
export const RECOMMENDATION_ERROR_MESSAGES = {
  6000: "Yêu cầu gợi ý chưa hợp lệ, vui lòng thử lại",
  6001: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
  6003: "Hạn mức AI hôm nay đã hết, vui lòng quay lại vào ngày mai",
  6004: "AI đang tạm thời quá tải, vui lòng thử lại sau ít phút",
  6005: "Tính năng AI chưa được cấu hình trên máy chủ",
  6006: "Chưa lấy được dữ liệu bài viết và công thức, vui lòng thử lại sau",
  6007: "AI chưa trả về kết quả hợp lệ, vui lòng thử lại",
  6999: "Máy chủ đang gặp lỗi, vui lòng thử lại sau ít phút",
};

// ai-service (60xx), thực đơn
export const MEAL_PLAN_ERROR_MESSAGES = {
  6000: "Thông tin chưa hợp lệ, vui lòng kiểm tra lại các mục đã nhập (ví dụ mục tiêu dinh dưỡng có mức tối thiểu lớn hơn tối đa)",
  6001: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
  6002: "Không tìm thấy thực đơn này",
  6003: "Bạn đã dùng hết lượt tạo thực đơn trong tháng này. Bạn có thể nâng cấp gói tại /pricing để tiếp tục hoặc quay lại vào tháng sau",
  6004: "AI đang tạm thời quá tải, vui lòng thử lại sau ít phút",
  6005: "Tính năng AI chưa được cấu hình trên máy chủ",
  6006: "Chưa lấy được dữ liệu công thức hoặc sức khỏe của bạn, vui lòng thử lại sau",
  6007: "AI chưa xếp được thực đơn đạt yêu cầu, vui lòng thử lại",
  6010: "Bạn cần cập nhật chiều cao và cân nặng trong hồ sơ sức khỏe trước khi lên thực đơn",
  6011: "Không tìm thấy món chay nào phù hợp với dị ứng và yêu cầu dinh dưỡng của bạn",
  6020: "Bạn cần cập nhật ngày sinh, giới tính và mức độ vận động trong hồ sơ để tính nhu cầu calo",
  6021: "Mục tiêu calo tự tính hiện chỉ dành cho người từ 18 tuổi trở lên. Bạn có thể tự đặt mục tiêu dinh dưỡng riêng",
  6014: "Thực đơn này đã có trong danh sách yêu thích",
  6015: "Thực đơn này chưa có trong danh sách yêu thích",
  6016: "Bạn không có quyền với thực đơn này",
  6017: "Không tìm thấy phiên bản này của thực đơn",
  6018: "Món này không phải món thuần chay, bạn chọn món khác nhé",
  6019: "Món này chứa thành phần gây dị ứng của bạn, bạn chọn món khác nhé",
  6999: "Máy chủ đang gặp lỗi, vui lòng thử lại sau ít phút",
};

// ai-service (60xx), bóc tách công thức từ video
export const VIDEO_JOB_ERROR_MESSAGES = {
  6000: "Tệp không phải video hợp lệ, vui lòng chọn tệp video khác",
  6001: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
  6002: "Không tìm thấy lượt bóc tách này",
  6003: "Bạn đã dùng hết lượt bóc tách video trong tháng này. Bạn có thể nâng cấp gói tại /pricing để tiếp tục hoặc quay lại vào tháng sau",
  6004: "AI đang tạm thời quá tải, vui lòng thử lại sau ít phút",
  6005: "Tính năng AI chưa được cấu hình trên máy chủ",
  6007: "AI chưa bóc tách được công thức từ video này, vui lòng thử lại",
  6008: "Không xử lý được video này: tệp bị lỗi hoặc dài hơn 30 phút",
  6009: "Tệp video vượt quá dung lượng cho phép (tối đa 100MB)",
  6020: "Hệ thống đang bận xử lý nhiều video, vui lòng thử lại sau ít phút",
  6021: "Chưa hỗ trợ bóc tách video YouTube, chỉ bóc tách được video tải lên trực tiếp",
  6022: "Video này đang được bóc tách, vui lòng chờ trong giây lát",
  6023: "Lần bóc tách trước của video này chưa thành công",
  6024: "Video không có đủ thông tin công thức (nguyên liệu kèm số lượng và các bước) để AI bóc tách",
  6999: "Máy chủ đang gặp lỗi, vui lòng thử lại sau ít phút",
};

// payment-service (60xx, trùng số với ai-service nhưng là service khác)
export const PAYMENT_ERROR_MESSAGES = {
  1008: "Phiên đăng nhập hết hạn",
  6000: "Vui lòng chọn gói thành viên",
  6001: "Gói không tồn tại",
  6002: "Gói này không thể mua",
  6003: "Không tìm thấy đơn hàng",
  6004: "Cổng thanh toán đang bận, thử lại sau",
  6005: "Chữ ký thanh toán không hợp lệ",
  6006: "Số tiền thanh toán không khớp với đơn hàng",
  6007: "Thanh toán không thành công",
  6008: "Đơn hàng này không thể huỷ",
  6009: "Chưa huỷ được đơn, vui lòng thử lại",
};
