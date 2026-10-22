// Dữ liệu mẫu tham khảo cho các tính năng chưa có endpoint backend riêng
// (nutrition facts, kênh ẩm thực đề xuất, video gợi ý dự phòng khi DB chưa có nhiều video).
// (nutrition facts, kênh ẩm thực đề xuất).

export const nutritionFacts = {
  servingLabel: "1 bát tiêu chuẩn",
  kcal: 315,
  protein: "16.5g",
  fiber: "7.8g",
  ingredients: [
    { id: "banh-pho", name: "Bánh phở lứt huyết rồng", amount: "250g" },
    { id: "nam", name: "Nấm hương tươi & Nấm đùi gà", amount: "180g" },
    { id: "thao-moc", name: "Thảo mộc: Hoa hồi, quế, thảo quả", amount: "1 gói nhỏ" },
  ],
};

export const videoChannels = [
  { id: "an", label: "Bếp Chay An Nhiên", initials: "AN", avatarClass: "bg-[#1D6C3D]" },
  { id: "yv", label: "Bếp Nhỏ Yên Vui", initials: "YV", avatarClass: "bg-[#E38B29]" },
  { id: "mc", label: "Mộc Chay Kitchen", initials: "MC", avatarClass: "bg-[#4B5563]" },
  { id: "tm", label: "Chef Tuệ Mẫn", initials: "TM", avatarClass: "bg-[#1D8A6E]" },
  { id: "sv", label: "Bếp Sen Vàng", initials: "SV", avatarClass: "bg-[#2E7D4F]" },
  { id: "sk", label: "Sống Khỏe Cùng Hạt", initials: "SK", avatarClass: "bg-[#E3A72D]" },
  { id: "gl", label: "GreenLife Vietnam", initials: "GL", avatarClass: "bg-[#1D8A6E]" },
];
<<<<<<< Updated upstream

export const suggestedVideos = [
  {
    id: "dau-hu-non-ap-chao",
    title: "Đậu Hũ Non Áp Chảo Giòn Vỏ Sốt Gừng Teriyaki",
    channel: "Bếp Nhỏ Yên Vui",
    views: "12K lượt xem",
    uploadedAgo: "1 ngày trước",
    duration: "06:40",
    tag: "Đạm: 21g",
    thumbClass: "bg-gradient-to-br from-[#C4471F] to-[#3A1F0E]",
    emoji: "🥢",
  },
  {
    id: "ca-tim-nuong",
    title: "Cà Tím Nướng Xé Sợi Sốt Tương Cay Kiểu Tứ Xuyên",
    channel: "Chef Tuệ Mẫn",
    views: "34K lượt xem",
    uploadedAgo: "4 ngày trước",
    duration: "08:15",
    tag: "Ít béo • Dễ làm",
    thumbClass: "bg-gradient-to-br from-[#3B2A6E] to-[#1A1030]",
    emoji: "🍆",
  },
  {
    id: "salad-quinoa",
    title: "Salad Quinoa Cầu Vồng Thanh Nhiệt & Sốt Chanh Leo",
    channel: "GreenLife Vietnam",
    views: "18K lượt xem",
    uploadedAgo: "1 tuần trước",
    duration: "05:20",
    tag: "Giàu Xơ • Eat Clean",
    thumbClass: "bg-gradient-to-br from-[#1D6C3D] to-[#0C2818]",
    emoji: "🥗",
  },
  {
    id: "canh-rong-bien",
    title: "Canh Rong Biển Đậu Hũ Non Hạt Sen Bổ Não Dưỡng Thần",
    channel: "Bếp Chay An Nhiên",
    views: "56K lượt xem",
    uploadedAgo: "2 tuần trước",
    duration: "14:10",
    tag: "Ngủ ngon • An thần",
    thumbClass: "bg-gradient-to-br from-[#2A5FA0] to-[#0F1F38]",
    emoji: "🥣",
  },
  {
    id: "tempeh-chien-gion",
    title: "Tempeh Chiên Giòn Lắc Muối Sả Ớt Cay Nồng Hao Cơm",
    channel: "Mộc Chay Kitchen",
    views: "41K lượt xem",
    uploadedAgo: "3 tuần trước",
    duration: "09:45",
    tag: "Đạm cao 24g",
    thumbClass: "bg-gradient-to-br from-[#B5651D] to-[#3A1F0E]",
    emoji: "🍢",
  },
  {
    id: "sua-hat-sen-macca",
    title: "Cách Nấu Sữa Hạt Sen Macca Mịn Màng Không Cần Lọc Bã",
    channel: "Sống Khỏe Cùng Hạt",
    views: "29K lượt xem",
    uploadedAgo: "1 tháng trước",
    duration: "07:30",
    tag: "Lành mạnh",
    thumbClass: "bg-gradient-to-br from-[#E3B23C] to-[#5A4116]",
    emoji: "🥛",
  },
];
=======
>>>>>>> Stashed changes
