// Dữ liệu demo cho trang Bản đồ quán chay — UI-only, chưa nối BE.
// Khi có API thật (danh sách quán + bản đồ), thay các hằng số này bằng
// dữ liệu từ query/store tương ứng.

export const mapFilterChips = [
  { id: "vegan100", label: "Thuần chay 100%", icon: "leaf", active: true },
  { id: "office", label: "Cơm văn phòng sạch", icon: "utensils" },
  { id: "hotpot", label: "Lẩu & Nướng chay", icon: "flame" },
  { id: "near", label: "Gần tôi (<2km)", icon: "pin" },
  { id: "rating", label: "Đánh giá 4.5+", icon: "star" },
  { id: "verified", label: "Bé Bông Cải bảo chứng", icon: "shield" },
];

export const mockRestaurants = [
  {
    id: "bong-sung",
    name: "Nhà Hàng Chay Bông Súng",
    rating: 4.8,
    address: "86 Nguyễn Du, P. Bến Nghé",
    distance: "650m",
    kcal: "~380 kcal/món",
    veganTag: "Thuần chay 100%",
    note: "Lẩu nấm tươi",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "xanh-moc",
    name: "Tiệm Chay Xanh Mộc",
    rating: 4.9,
    address: "42 Đề Thám, P. Cầu Ông Lãnh",
    distance: "1.1 km",
    kcal: "~420 kcal/món",
    veganTag: "Gạo lứt dinh dưỡng",
    note: "Ánh lan lành tính",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "an-nhien",
    name: "Bếp Chay An Nhiên",
    rating: 4.7,
    address: "14/2 Hai Bà Trưng, P. Bến Nghé",
    distance: "1.6 km",
    kcal: "~350 kcal/món",
    veganTag: "Phù chay thanh vị",
    note: "Organic Farm",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80&auto=format&fit=crop",
  },
];
