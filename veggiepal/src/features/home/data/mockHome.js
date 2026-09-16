// Dữ liệu demo cho trang Trang chủ / Thực đơn — UI-only, chưa nối BE.
// Khi có API thật, thay các hằng số này bằng dữ liệu từ query/store tương ứng.

export const mockStats = [
  {
    id: "bmi",
    icon: "bmi",
    label: "Chỉ số BMI",
    value: "21.4",
    caption: "Thể trạng lý tưởng",
    progress: 72,
    barClass: "bg-[#1D6C3D]",
  },
  {
    id: "calo",
    icon: "fire",
    label: "Calo Mục Tiêu",
    value: "1,420",
    unit: "/ 1,850 kcal",
    caption: "Còn 430 kcal cho bữa tối thanh đạm",
    progress: 77,
    barClass: "bg-[#F0883E]",
  },
  {
    id: "water",
    icon: "water",
    label: "Nước & Khoáng",
    value: "1.8",
    unit: "/ 2.4 L",
    caption: "Đã uống 6/8 ly nước mát",
    progress: 75,
    barClass: "bg-[#2A9DD6]",
  },
  {
    id: "activity",
    icon: "run",
    label: "Vận Động",
    value: "7,850",
    badge: "78% mục tiêu",
    caption: "Đã đạt 25 phút Yoga sáng",
    progress: 78,
    barClass: "bg-[#8B5CF6]",
  },
];

export const availableIngredients = [
  { id: "mushroom", label: "Nấm đùi gà", icon: "🍄", color: "#E3F3E1" },
  { id: "tofu", label: "Đậu hũ non mềm", icon: "🧊", color: "#EAEAEE" },
  { id: "pumpkin", label: "Bí đỏ Nhật ngọt", icon: "🎃", color: "#FBE7D0" },
  { id: "kale", label: "Cải xoăn Kale xoăn", icon: "🥬", color: "#DFF3E6" },
  { id: "lotus", label: "Hạt sen tươi Huế", icon: "🪷", color: "#DCEBFB" },
  { id: "avocado", label: "Bơ sáp Đắk Lắk", icon: "🥑", color: "#FBF0CE" },
];

export const flavorPreferences = [
  { id: "light", label: "Thanh đạm vị ngọt nhẹ", icon: "✨", color: "#1D6C3D", active: true },
  { id: "sea", label: "Đậm đà Đông Nam Á", icon: "✏️", color: "#EAEAEA", active: false },
  { id: "low-oil", label: "Ít dầu mỡ & chiên xào", icon: "🔥", color: "#FBE1CE", active: false },
  { id: "no-sugar", label: "Không đường tinh luyện", icon: "✨", color: "#DCEBFB", active: false },
  { id: "soup", label: "Chuộng món súp ấm nóng", icon: "🍥", color: "#DCEBFB", active: false },
];

export const weekDays = [
  { id: "t2", label: "T2" },
  { id: "t3", label: "T3" },
  { id: "t4", label: "T4" },
  { id: "t5", label: "T5" },
  { id: "t6", label: "T6" },
  { id: "t7", label: "T7" },
  { id: "cn", label: "CN" },
];

export const todayMeals = [
  {
    id: "breakfast",
    meal: "Bữa Sáng",
    time: "07:30",
    title: "Yến Mạch Chia Berry",
    description: "Bổ sung chất xơ hoà tan Beta-Glucan, quả mọng chống oxy hoá tự nhiên.",
    image: "https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?w=600&q=80&auto=format&fit=crop",
    kcal: 360,
    protein: 14,
    carb: 52,
    fat: 8,
  },
  {
    id: "lunch",
    meal: "Bữa Trưa",
    time: "12:15",
    title: "Buddha Bowl Đậu Gà & Rau Củ",
    description: "Giàu đạm thực vật, chất xơ, vitamin đủ bộ mang thanh thoát.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80&auto=format&fit=crop",
    kcal: 540,
    protein: 24,
    carb: 68,
    fat: 18,
  },
  {
    id: "snack",
    meal: "Bữa Phụ",
    time: "15:30",
    title: "Tàu Hũ Nóng Hạt Sen",
    description: "Vị thanh của gừng ấm xua tan buồn ngủ, tốt cho giấc ngủ về tối.",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80&auto=format&fit=crop",
    kcal: 190,
    protein: 12,
    carb: 28,
    fat: 4,
  },
  {
    id: "dinner",
    meal: "Bữa Tối",
    time: "19:00",
    title: "Súp Bí Đỏ Nấm Đùi Gà",
    description: "Thanh nhẹ, dễ tiêu hoá cho buổi tối, vitamin A và beta-caroten nuôi dưỡng làn da.",
    image: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=600&q=80&auto=format&fit=crop",
    kcal: 220,
    protein: 11,
    carb: 42,
    fat: 6,
  },
];

export const macroBreakdown = [
  { id: "carb", label: "Tinh bột chậm", value: 50, colorClass: "text-[#1D6C3D]" },
  { id: "protein", label: "Đạm thực vật", value: 25, colorClass: "text-[#5CB85C]" },
  { id: "fat", label: "Chất béo tốt", value: 25, colorClass: "text-[#F0883E]" },
];

export const dailyAdviceStats = [
  { id: "veggie", label: "Ăn đủ rau xanh", value: "~500g/ngày" },
  { id: "water", label: "Uống đủ nước", value: "2 - 2.5L/ngày" },
  { id: "sleep", label: "Ngủ đủ giấc", value: "7 - 8 giờ/đêm" },
];
