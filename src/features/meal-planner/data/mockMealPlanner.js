// Dữ liệu mẫu còn lại của trang Thực đơn — chỉ cho những khối mà BE CHƯA có API:
// thẻ Nước & Khoáng, thẻ Vận Động và Bữa Phụ (thực đơn AI chỉ có sáng / trưa / tối).
// Thực đơn, dinh dưỡng, BMI và biểu đồ macro đã lấy từ BE; khi BE bổ sung phần còn lại thì thay các hằng số này.

export const mockStats = [
  {
    id: "water",
    icon: "water",
    label: "Nước & Khoáng",
    value: "1.8",
    unit: "/ 2.4 L",
    caption: "Đã uống 6/8 ly nước mát",
    progress: 75,
    barClass: "bg-chart-2",
  },
  {
    id: "activity",
    icon: "run",
    label: "Vận Động",
    value: "7,850",
    badge: "78% mục tiêu",
    caption: "Đã đạt 25 phút Yoga sáng",
    progress: 78,
    barClass: "bg-chart-3",
  },
];

// Khẩu vị gợi ý gửi cho AI qua `preferences`. `label` là chuỗi gửi đi nên viết rõ nghĩa.
export const flavorPreferences = [
  { id: "light", label: "Thanh đạm vị ngọt nhẹ", icon: "✨", color: "#1D6C3D" },
  { id: "sea", label: "Đậm đà Đông Nam Á", icon: "✏️", color: "#EAEAEA" },
  { id: "low-oil", label: "Ít dầu mỡ & chiên xào", icon: "🔥", color: "#FBE1CE" },
  { id: "no-sugar", label: "Không đường tinh luyện", icon: "✨", color: "#DCEBFB" },
  { id: "soup", label: "Chuộng món súp ấm nóng", icon: "🍥", color: "#DCEBFB" },
];

// Mục tiêu sức khỏe gợi ý nhanh, bấm để điền vào ô "Mục tiêu".
export const healthGoalSuggestions = [
  "Giảm cân nhẹ, ăn thanh đạm",
  "Tăng cơ, nhiều đạm thực vật",
  "Duy trì cân nặng và vóc dáng",
  "Ăn đủ chất, dễ tiêu hoá",
];

export const mockSnack = {
  id: "snack",
  meal: "Bữa Phụ",
  time: "15:30",
  title: "Tàu Hũ Nóng Hạt Sen",
  description: "Vị thanh của gừng ấm xua tan buồn ngủ, tốt cho giấc ngủ về tối.",
  image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80&auto=format&fit=crop",
  prepMinutes: 5,
  kcal: 190,
  protein: 12,
  carb: 28,
  fat: 4,
};

export const macroLabels = {
  carb: "Tinh bột chậm",
  protein: "Đạm thực vật",
  fat: "Chất béo tốt",
};

export const dailyAdviceStats = [
  { id: "veggie", label: "Ăn đủ rau xanh", value: "~500g/ngày" },
  { id: "water", label: "Uống đủ nước", value: "2 - 2.5L/ngày" },
  { id: "sleep", label: "Ngủ đủ giấc", value: "7 - 8 giờ/đêm" },
];
