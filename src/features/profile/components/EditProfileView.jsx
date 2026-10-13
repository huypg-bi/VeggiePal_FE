import React, { useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  User,
  Heart,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  Clock,
  Save,
  Plus,
  Wheat,
} from "lucide-react";

export default function EditProfileView({ onBack, onSaveSuccess }) {
  const [openSections, setOpenSections] = useState({
    personalInfo: true,
    changePassword: false,
  });

  const [openAllergies, setOpenAllergies] = useState({
    grains: true,
    legumes: true,
    nuts: false,
    veggies: false,
    mushrooms: false,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAllergySection = (key) => {
    setOpenAllergies((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [personalData, setPersonalData] = useState({
    fullName: "Bi dz",
    phone: "",
    birthDate: "",
    email: "huy@gmail.com",
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [healthData, setHealthData] = useState({
    height: 170,
    weight: 60,
  });

  const bmi = (
    healthData.weight /
    ((healthData.height / 100) * (healthData.height / 100))
  ).toFixed(1);

  const [selectedAllergies, setSelectedAllergies] = useState([
    "Lúa mì (Gluten)",
    "Yến mạch chứa gluten",
    "Đậu phộng (Lạc)",
  ]);

  const toggleAllergyTag = (tag) => {
    if (selectedAllergies.includes(tag)) {
      setSelectedAllergies(selectedAllergies.filter((item) => item !== tag));
    } else {
      setSelectedAllergies([...selectedAllergies, tag]);
    }
  };

  const allergyCategories = {
    grains: {
      name: "Ngũ cốc & Tinh bột",
      note: "Chọn các loại ngũ cốc gây mẫn cảm hoặc dị ứng:",
      items: ["Lúa mì (Gluten)", "Yến mạch chứa gluten", "Lúa mạch đen", "Bắp ngô", "Kiều mạch"],
    },
    legumes: {
      name: "Các loại Đậu & Chế phẩm",
      note: "Tùy chọn đậu nành, lạc/đậu phộng và đậu khác:",
      items: ["Đậu phộng (Lạc)", "Đậu nành (Soybean)", "Đậu đỏ / Đậu đen", "Đậu gà (Chickpeas)"],
    },
    nuts: {
      name: "Hạt dinh dưỡng & Quả hạch",
      note: "Các loại hạt khô thường gây kích ứng:",
      items: ["Hạt điều", "Hạnh nhân", "Quả óc chó", "Hạt dẻ cười"],
    },
    veggies: {
      name: "Rau củ & Trái cây",
      note: "Rau củ tính hàn hoặc nhạy cảm:",
      items: ["Cà chua", "Cần tây", "Dâu tây", "Xoài"],
    },
    mushrooms: {
      name: "Nấm & Nấm men",
      note: "Các loại nấm mỡ, nấm men bia:",
      items: ["Men dinh dưỡng", "Nấm đùi gà", "Nấm đông cô"],
    },
  };

  const handleSaveAll = () => {
    alert("Đã lưu thông tin hồ sơ và chỉ số dinh dưỡng thành công!");
    if (onSaveSuccess) onSaveSuccess();
  };

  return (
    <div className="w-full space-y-6 pb-6 text-stone-800 dark:text-stone-100">
      {/* Tiêu đề & Nút quay lại */}
      <div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400 mb-2">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 text-stone-700 dark:text-stone-200 hover:text-emerald-700 dark:hover:text-emerald-400 font-semibold cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Quay lại Trang cá nhân
          </button>
          <span>/</span>
          <span>Cài đặt tài khoản</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            🌱 Hồ sơ thành viên xanh
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-stone-50 dark:bg-stone-800 px-2.5 py-0.5 text-[11px] font-medium text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
            • Đã xác minh dinh dưỡng
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-800 dark:text-stone-100 tracking-tight">
          Chỉnh sửa hồ sơ
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
          Quản lý thông tin hiển thị và quyền riêng tư trên cộng đồng thuần chay VeggiePal
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CỘT TRÁI */}
        <div className="lg:col-span-4 space-y-5">
          <div className="flex items-center gap-3.5 rounded-3xl border border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 shadow-sm">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-stone-900 text-white font-bold text-xl shadow-xs">
              <User className="h-7 w-7 text-emerald-400" />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
                ✓
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-stone-800 dark:text-stone-100 text-base">User</h3>
                <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold">✓</span>
              </div>
              <p className="text-xs text-stone-400">Thành viên thuần chay vàng</p>
            </div>
          </div>

          <span className="block text-[11px] font-bold tracking-wider text-stone-400 uppercase ml-2">
            Giới thiệu
          </span>

          {/* Dropdown 1: Thông tin cá nhân */}
          <div className="rounded-3xl border border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm overflow-hidden transition-all">
            <button
              type="button"
              onClick={() => toggleSection("personalInfo")}
              className="flex w-full items-center justify-between p-4.5 text-left hover:bg-stone-50/50 dark:hover:bg-stone-800/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-100">Thông tin cá nhân</h4>
                  <p className="text-[10px] text-stone-400">Họ tên, số điện thoại, ngày sinh</p>
                </div>
              </div>
              {openSections.personalInfo ? (
                <ChevronUp className="h-4 w-4 text-stone-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-stone-400" />
              )}
            </button>

            {openSections.personalInfo && (
              <div className="p-4.5 pt-1 border-t border-stone-50 dark:border-stone-800 space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1.5">Họ và tên</label>
                  <input
                    type="text"
                    value={personalData.fullName}
                    onChange={(e) => setPersonalData({ ...personalData, fullName: e.target.value })}
                    className="w-full rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/60 px-3.5 py-2.5 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1.5">Số điện thoại</label>
                  <input
                    type="text"
                    placeholder="Để trống nếu muốn xóa"
                    value={personalData.phone}
                    onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })}
                    className="w-full rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/60 px-3.5 py-2.5 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1.5">Ngày sinh</label>
                  <input
                    type="date"
                    value={personalData.birthDate}
                    onChange={(e) => setPersonalData({ ...personalData, birthDate: e.target.value })}
                    className="w-full rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/60 px-3.5 py-2.5 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={personalData.email}
                    disabled
                    className="w-full rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-100/70 dark:bg-stone-800/90 px-3.5 py-2.5 text-xs text-stone-400 cursor-not-allowed"
                  />
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    Email không thể thay đổi tại đây
                  </span>
                </div>

                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
                >
                  <Save className="h-3.5 w-3.5" />
                  Lưu thay đổi
                </button>
              </div>
            )}
          </div>

          {/* Dropdown 2: Đổi mật khẩu */}
          <div className="rounded-3xl border border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm overflow-hidden transition-all">
            <button
              type="button"
              onClick={() => toggleSection("changePassword")}
              className="flex w-full items-center justify-between p-4.5 text-left hover:bg-stone-50/50 dark:hover:bg-stone-800/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  <Lock className="h-4 w-4" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-100">Đổi mật khẩu</h4>
              </div>
              {openSections.changePassword ? (
                <ChevronUp className="h-4 w-4 text-stone-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-stone-400" />
              )}
            </button>

            {openSections.changePassword && (
              <div className="p-4.5 pt-1 border-t border-stone-50 dark:border-stone-800 space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1.5">Mật khẩu mới</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu mới"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                      }
                      className="w-full rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/60 px-3.5 py-2.5 pr-9 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1.5">Xác nhận mật khẩu mới</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu mới"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    className="w-full rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/60 px-3.5 py-2.5 pr-9 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-800 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-900 transition-colors"
                >
                  Cập nhật mật khẩu
                </button>
              </div>
            )}
          </div>

          {/* Quote */}
          <div className="rounded-3xl border border-emerald-100 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/40 p-5 text-xs text-stone-600 dark:text-stone-300">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-400 mb-1.5">
              <span>🌱 VeggiePal</span>
            </div>
            <p className="italic leading-relaxed">
              "Sống chậm lại để cảm nhận, ăn lành sạch để chữa lành, và mỉm cười để yêu thương trọn vẹn mỗi ngày."
            </p>
          </div>
        </div>

        {/* CỘT PHẢI */}
        <div className="lg:col-span-8 space-y-6">
          {/* Box 1: Chỉ số sức khỏe */}
          <div className="rounded-3xl border border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-800 dark:text-stone-100">Chỉ số sức khỏe</h3>
                  <p className="text-[11px] text-stone-400">
                    Theo dõi chiều cao, cân nặng và thể trạng cơ thể chuẩn khoa học
                  </p>
                </div>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                🌱 Cá nhân hóa
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-5">
              <div className="rounded-2xl border border-stone-100 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/60 p-3.5">
                <div className="flex justify-between items-center text-[11px] text-stone-400 font-bold mb-1">
                  <span>CHIỀU CAO</span>
                  <User className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-lg font-extrabold text-stone-800 dark:text-stone-100">
                  {healthData.height} <span className="text-xs font-normal text-stone-500">cm</span>
                </div>
                <span className="text-[10px] text-stone-400">Đo lần gần nhất</span>
              </div>

              <div className="rounded-2xl border border-stone-100 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/60 p-3.5">
                <div className="flex justify-between items-center text-[11px] text-stone-400 font-bold mb-1">
                  <span>CÂN NẶNG</span>
                  <Heart className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-lg font-extrabold text-stone-800 dark:text-stone-100">
                  {healthData.weight} <span className="text-xs font-normal text-stone-500">kg</span>
                </div>
                <span className="text-[10px] text-stone-400">Đo lần gần nhất</span>
              </div>

              <div className="rounded-2xl border border-stone-100 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/60 p-3.5">
                <div className="flex justify-between items-center text-[11px] text-stone-400 font-bold mb-1">
                  <span>CHỈ SỐ BMI</span>
                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700 dark:text-emerald-300">
                    Lý tưởng ✓
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400">{bmi}</span>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-300">Bình thường</span>
                </div>
                <span className="text-[10px] text-stone-400">Dải chuẩn: 18.5 - 22.9</span>
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-3.5 mb-4">
              <div className="flex-1 min-w-[130px]">
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Chiều cao (cm)</label>
                <input
                  type="number"
                  value={healthData.height}
                  onChange={(e) =>
                    setHealthData({ ...healthData, height: Number(e.target.value) })
                  }
                  className="w-full rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/60 px-3.5 py-2 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex-1 min-w-[130px]">
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Cân nặng (kg)</label>
                <input
                  type="number"
                  value={healthData.weight}
                  onChange={(e) =>
                    setHealthData({ ...healthData, weight: Number(e.target.value) })
                  }
                  className="w-full rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/60 px-3.5 py-2 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="button"
                className="flex items-center gap-1.5 rounded-2xl bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-900 transition-colors shadow-xs"
              >
                <Plus className="h-4 w-4" />
                Ghi nhận
              </button>
            </div>

            <div className="text-[11px] text-stone-400 flex items-center gap-1.5 pt-2 border-t border-stone-50 dark:border-stone-800">
              <Clock className="h-3.5 w-3.5" />
              <span>Lịch sử gần đây: Chưa có bản ghi nào.</span>
            </div>
          </div>

          {/* Box 2: Dị ứng & Kiêng khen */}
          <div className="rounded-3xl border border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-800 dark:text-stone-100">Thực phẩm dị ứng & Kiêng khen</h3>
                <p className="text-[11px] text-stone-400">
                  Chọn các thành phần thực phẩm bạn cần tránh để thực đơn lọc tự động
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {Object.entries(allergyCategories).map(([key, cat]) => {
                const isOpen = openAllergies[key];
                const selectedCount = cat.items.filter((item) =>
                  selectedAllergies.includes(item)
                ).length;

                return (
                  <div
                    key={key}
                    className="rounded-2xl border border-stone-100 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-800/40 overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => toggleAllergySection(key)}
                      className="flex w-full items-center justify-between p-3.5 text-left hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Wheat className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <span className="text-xs font-bold text-stone-800 dark:text-stone-100">{cat.name}</span>
                        {selectedCount > 0 ? (
                          <span className="rounded-full bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900">
                            {selectedCount} đã chọn
                          </span>
                        ) : (
                          <span className="rounded-full bg-stone-100 dark:bg-stone-800 px-2 py-0.5 text-[10px] text-stone-400">
                            Chưa chọn
                          </span>
                        )}
                      </div>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-stone-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-stone-400" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="p-3.5 pt-1 border-t border-stone-100/60 dark:border-stone-800 bg-white dark:bg-stone-900">
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mb-2.5">{cat.note}</p>
                        <div className="flex flex-wrap gap-2">
                          {cat.items.map((item) => {
                            const isSelected = selectedAllergies.includes(item);
                            return (
                              <button
                                key={item}
                                type="button"
                                onClick={() => toggleAllergyTag(item)}
                                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                                  isSelected
                                    ? "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 shadow-2xs"
                                    : "bg-stone-100/80 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200/70 dark:hover:bg-stone-700 border border-transparent"
                                }`}
                              >
                                {isSelected && <span>🚫</span>}
                                <span>{item}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar Bottom */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-400">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          <span>Lần chỉnh sửa gần nhất: 12 tháng 5, 2024</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-full bg-stone-100 dark:bg-stone-800 px-5 py-2.5 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
          >
            Hủy thay đổi
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            className="flex items-center gap-1.5 rounded-full bg-emerald-900 dark:bg-emerald-600 px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-950 dark:hover:bg-emerald-500 transition-colors"
          >
            <Save className="h-3.5 w-3.5" />
            Lưu thông tin
          </button>
        </div>
      </div>
    </div>
  );
}