import React, { useState } from 'react';
import { 
  Sparkles, 
  Video, 
  Settings, 
  Heart, 
  Watch, 
  Award, 
  ThumbsUp, 
  MessageSquare, 
  Bookmark, 
  Share2, 
  Play, 
  TrendingDown,
  Camera,
  Tag
} from 'lucide-react';

// Import trực tiếp các assets có sẵn trong dự án
import bgFrame from '@/assets/img/bg_site_frame.png';
import iconBmi from '@/assets/img/icon_bmi.png';
import iconFire from '@/assets/img/icon_fire.png';
import iconLeaf from '@/assets/img/icon_leaf.png';
import iconMacro from '@/assets/img/icon_macro.png';
import iconRun from '@/assets/img/icon_run.png';
import iconSleep from '@/assets/img/icon_sleep.png';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <div className="min-h-screen bg-[#F4F7F5] py-6 px-3 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* ================= 1. HEADER PROFILE ================= */}
        <section className="bg-white rounded-3xl shadow-sm border border-emerald-100 overflow-hidden">
          {/* Cover Banner */}
          <div className="h-48 sm:h-64 w-full relative overflow-hidden bg-emerald-900">
            <img 
              src={bgFrame} 
              alt="Farm Cover" 
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-medium flex items-center gap-1.5 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>VeggiePal Verified Profile</span>
            </div>
          </div>

          {/* Profile Meta Area */}
          <div className="px-6 pb-6 pt-0 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between -mt-16 md:-mt-20 gap-4 mb-5">
              {/* Avatar & Title */}
              <div className="flex items-end gap-4">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80" 
                    alt="Minh Thuận" 
                    className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white object-cover shadow-md"
                  />
                  <span className="absolute bottom-1 right-1 p-1.5 bg-emerald-600 rounded-full border-2 border-white text-white">
                    <img src={iconLeaf} alt="verified" className="w-3.5 h-3.5 invert" />
                  </span>
                </div>
                <div className="mb-2">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">Minh Thuận</h1>
                    <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                      Chuyên gia ẩm thực chay
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">@minhthuan_veganchef</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs md:text-sm font-medium px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition cursor-pointer">
                  <Video className="w-4 h-4" />
                  <span>Tạo Blog / Tải Video (AI Kiểm duyệt)</span>
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs md:text-sm font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 transition cursor-pointer">
                  <Settings className="w-4 h-4" />
                  <span>Chỉnh sửa hồ sơ</span>
                </button>
              </div>
            </div>

            {/* Bio Text */}
            <p className="text-gray-700 text-xs md:text-sm max-w-3xl leading-relaxed mb-6">
              Đam mê sáng tạo món chay thực dưỡng WFPB & ứng dụng AI nấu nướng 🌿 Đồng hành cùng thói quen sống xanh không rác thải.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100/70">
              <div className="text-center md:border-r border-emerald-100">
                <div className="text-xl font-bold text-gray-800">142</div>
                <div className="text-xs text-gray-500 mt-0.5">Công thức & Video</div>
              </div>
              <div className="text-center md:border-r border-emerald-100">
                <div className="text-xl font-bold text-gray-800">28.5k</div>
                <div className="text-xs text-gray-500 mt-0.5">Người theo dõi</div>
              </div>
              <div className="text-center md:border-r border-emerald-100">
                <div className="text-xl font-bold text-gray-800">1,250</div>
                <div className="text-xs text-gray-500 mt-0.5">Đang theo dõi</div>
              </div>
              <div className="text-center flex flex-col items-center justify-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold text-emerald-600">21.4</span>
                  <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-md font-semibold">
                    Chuẩn thể trạng
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">Chỉ số BMI</div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-6 mt-6 border-b border-gray-100 text-xs md:text-sm overflow-x-auto">
              <button 
                onClick={() => setActiveTab('posts')}
                className={`pb-3 border-b-2 font-semibold transition cursor-pointer ${
                  activeTab === 'posts' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Bài viết & Video (142)
              </button>
              <button 
                onClick={() => setActiveTab('moderation')}
                className={`pb-3 border-b-2 font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'moderation' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Trạng thái kiểm duyệt AI
                <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">1 đang chờ</span>
              </button>
              <button 
                onClick={() => setActiveTab('interactions')}
                className={`pb-3 border-b-2 font-semibold transition cursor-pointer ${
                  activeTab === 'interactions' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Bình luận & Bình chọn
              </button>
              <button 
                onClick={() => setActiveTab('calories')}
                className={`pb-3 border-b-2 font-semibold transition cursor-pointer ${
                  activeTab === 'calories' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Bộ sưu tập & Nhật ký Calo
              </button>
            </div>
          </div>
        </section>

        {/* ================= 2. BODY CHIA 2 CỘT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* CỘT TRÁI (4/12): Widgets Thể trạng, Media & Huy hiệu */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Widget Thể trạng & Thiết bị */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-emerald-600" />
                  Thể trạng & Thiết bị
                </h2>
                <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                  Live Sync
                </span>
              </div>

              {/* BMI & Calories Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 p-3 rounded-2xl flex items-center gap-3 border border-gray-100/70">
                  <img src={iconBmi} alt="BMI" className="w-9 h-9 object-contain" />
                  <div>
                    <div className="text-[11px] text-gray-500">Chỉ số BMI</div>
                    <div className="text-xs font-semibold text-gray-800">21.4 Chuẩn</div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-2xl flex items-center gap-3 border border-gray-100/70">
                  <img src={iconFire} alt="Calo" className="w-9 h-9 object-contain" />
                  <div>
                    <div className="text-[11px] text-gray-500">Năng lượng</div>
                    <div className="text-xs font-semibold text-gray-800">1,210/1,950 kcal</div>
                  </div>
                </div>
              </div>

              {/* Smartwatch Track Info */}
              <div className="flex items-center justify-between text-xs py-2.5 px-3 bg-gray-50 rounded-2xl border border-gray-100/80 mb-3">
                <span className="flex items-center gap-2 text-gray-600">
                  <Watch className="w-4 h-4 text-gray-700" />
                  Apple Watch Series 9
                </span>
                <span className="font-semibold text-gray-800 flex items-center gap-1">
                  <img src={iconRun} alt="steps" className="w-3.5 h-3.5" /> 7,650 bước
                </span>
              </div>

              {/* Habit Badges */}
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-emerald-50 text-emerald-700 text-[11px] px-2.5 py-1 rounded-xl font-medium flex items-center gap-1 border border-emerald-100">
                  <img src={iconLeaf} alt="vegan" className="w-3 h-3" /> Thuần chay 100% WFPB
                </span>
                <span className="bg-emerald-50 text-emerald-700 text-[11px] px-2.5 py-1 rounded-xl font-medium flex items-center gap-1 border border-emerald-100">
                  <img src={iconLeaf} alt="vegan" className="w-3 h-3" /> Không bột ngọt / Mì chính
                </span>
              </div>
            </div>

            {/* Widget Ảnh & Video gần đây */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-gray-800 text-sm">Ảnh & Video gần đây</h2>
                <a href="#all" className="text-xs text-emerald-600 hover:underline">Xem tất cả (142)</a>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=150&q=80",
                  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=150&q=80",
                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&q=80",
                  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=150&q=80",
                  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=150&q=80",
                  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&q=80"
                ].map((url, i) => (
                  <img 
                    key={i} 
                    src={url} 
                    alt="Món ăn" 
                    className="w-full h-20 object-cover rounded-2xl hover:opacity-90 transition cursor-pointer"
                  />
                ))}
              </div>
            </div>

            {/* Widget Huy hiệu thành tích */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="font-bold text-gray-800 text-sm mb-3.5 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                Huy hiệu thành tích
              </h2>
              <div className="space-y-3">
                {[
                  { title: "100 Ngày Ăn Xanh Liên Tục", desc: "Không bỏ lỡ bữa thuần chay / WFPB nào trong 14 tuần" },
                  { title: "Bếp Trưởng Zero-Waste", desc: "Tận dụng 95% cuống và vỏ rau củ làm nước dùng" },
                  { title: "AI Master Chef", desc: "Đã đóng góp 50+ công thức được VeggiePal AI tích hợp" }
                ].map((badge, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-2xl flex-shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-800">{badge.title}</div>
                      <div className="text-[11px] text-gray-500 leading-tight mt-0.5">{badge.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </aside>

          {/* CỘT PHẢI (8/12): Feed & Tính năng AI */}
          <section className="lg:col-span-8 space-y-6">
            
            {/* Hộp cảnh báo cơ chế AI kiểm duyệt */}
            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-3xl p-4 flex items-start gap-3.5">
              <div className="p-2 bg-emerald-600 text-white rounded-2xl shadow-sm flex-shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs text-gray-700 leading-relaxed">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900">Cơ chế kiểm duyệt nội dung thông minh</span>
                  <span className="bg-emerald-200 text-emerald-900 text-[10px] px-2 py-0.2 rounded-full font-medium">
                    AI Moderation Safe Guard
                  </span>
                </div>
                Nội dung mới đăng tải sẽ được hệ thống AI quét tự động trước khi hiển thị công khai. Nếu có dấu hiệu vi phạm sẽ được gửi tới Quản trị viên duyệt thủ công.
              </div>
            </div>

            {/* Thanh đăng bài nhanh */}
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" 
                  alt="Avatar" 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <input 
                  type="text" 
                  placeholder="Thuận ơi, hôm nay bạn có công thức chay ngon nào muốn chia sẻ?" 
                  className="bg-gray-50 hover:bg-gray-100/70 focus:bg-white text-xs md:text-sm px-4 py-2.5 rounded-2xl w-full border border-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-gray-50 gap-2">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-gray-100 transition cursor-pointer">
                    <Video className="w-4 h-4 text-emerald-600" />
                    <span>Đăng Video HD</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-gray-100 transition cursor-pointer">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>AI nhận diện nguyên liệu</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-gray-100 transition cursor-pointer">
                    <img src={iconMacro} alt="macro" className="w-4 h-4" />
                    <span>Gán thẻ Macro/Calo</span>
                  </button>
                </div>
                <button className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-emerald-700 transition cursor-pointer">
                  Đăng ngay
                </button>
              </div>
            </div>

            {/* Bài đăng 1: Video Recipe Card */}
            <article className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 pb-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" 
                      alt="Minh Thuận" 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-gray-800">Minh Thuận</h3>
                      <p className="text-[11px] text-gray-400">Hôm qua lúc 18:30 • Video công thức • Công khai</p>
                    </div>
                  </div>
                  <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium">
                    Đã kiểm duyệt AI
                  </span>
                </div>
                <p className="text-xs md:text-sm text-gray-800 leading-relaxed">
                  🍲 <strong>Súp bí đỏ hạt sen & Đậu hũ sốt chua ngọt chanh leo</strong> — Món ăn ấm bụng hoàn hảo cho bữa tối thanh đạm! Nước dùng từ củ cải trắng và ngô ngọt tự nhiên, không cần nêm thêm bột ngọt hay đường hóa học. Calo chỉ khoảng 380 kcal cho cả phần ăn.
                </p>
                <div className="flex gap-2 mt-2 text-xs text-emerald-600 font-medium">
                  <span>#WFPB</span>
                  <span>#VeggieComfortFood</span>
                  <span>#380Kcal</span>
                  <span>#18gProtein</span>
                </div>
              </div>

              {/* Video Player Mockup */}
              <div className="relative aspect-video bg-gray-900 group cursor-pointer overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80" 
                  alt="Súp bí đỏ" 
                  className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-14 h-14 bg-emerald-600/90 text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                    <Play className="w-7 h-7 fill-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-0.5 rounded text-[11px] text-white">
                  04:25 HD
                </div>
                <div className="absolute bottom-3 right-3 bg-black/60 px-2 py-0.5 rounded text-[11px] text-white">
                  4,250 lượt xem
                </div>
              </div>

              {/* Actions Bar */}
              <div className="px-5 py-3 flex items-center justify-between border-t border-gray-50 text-xs text-gray-600">
                <button className="flex items-center gap-1.5 hover:text-emerald-600 font-medium cursor-pointer">
                  <ThumbsUp className="w-4 h-4" /> 723 Thích
                </button>
                <button className="flex items-center gap-1.5 hover:text-emerald-600 font-medium cursor-pointer">
                  <MessageSquare className="w-4 h-4" /> 89 Bình luận
                </button>
                <button className="flex items-center gap-1.5 hover:text-emerald-600 font-medium cursor-pointer">
                  <Bookmark className="w-4 h-4" /> Lưu công thức
                </button>
                <button className="flex items-center gap-1.5 hover:text-emerald-600 font-medium cursor-pointer">
                  <Share2 className="w-4 h-4" /> Chia sẻ
                </button>
              </div>
            </article>

            {/* Bài đăng 2: Biểu đồ BMI */}
            <article className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4">
              <div className="flex items-center gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" 
                  alt="Minh Thuận" 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Minh Thuận</h3>
                  <p className="text-[11px] text-gray-400">3 ngày trước • Chia sẻ kinh nghiệm dinh dưỡng</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-sm md:text-base">
                  Hành trình 6 tháng cân bằng chỉ số BMI nhờ thực đơn AI VeggiePal 📊
                </h4>
                <p className="text-xs md:text-sm text-gray-600 mt-1.5 leading-relaxed">
                  Nhiều người nghĩ ăn chay sẽ thiếu hụt protein và khó kiểm soát cân nặng. Nhờ tính năng AI Meal Planner, chỉ số BMI của mình đã giảm đều từ 24.8 về mốc cân bằng 21.4 mà không hề mệt mỏi!
                </p>
              </div>

              {/* Chart Body */}
              <div className="p-4 bg-gradient-to-b from-emerald-50/50 to-white rounded-2xl border border-emerald-100/70">
                <div className="flex justify-between items-center text-xs mb-3">
                  <span className="font-semibold text-gray-700">Biến thiên BMI & Tỷ lệ Macro thực vật (6 tháng)</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" /> -3.4 BMI (An toàn)
                  </span>
                </div>
                
                {/* Bar Graph Simulation */}
                <div className="h-28 flex items-end justify-between gap-2 px-2 pt-4 border-b border-gray-200">
                  {[24.8, 24.2, 23.5, 22.8, 22.0, 21.4].map((val, idx) => (
                    <div key={idx} className="flex flex-col items-center flex-1">
                      <span className="text-[10px] text-gray-500 mb-1">{val}</span>
                      <div 
                        className="w-full bg-emerald-500/80 rounded-t-md hover:bg-emerald-600 transition" 
                        style={{ height: `${(val - 18) * 12}px` }}
                      />
                      <span className="text-[10px] text-gray-400 mt-1">T{idx + 1}</span>
                    </div>
                  ))}
                </div>

                {/* Macro percentages */}
                <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                  <div className="bg-white p-2 rounded-xl border border-gray-100">
                    <div className="text-[10px] text-gray-400">Carbs Phức</div>
                    <div className="text-xs font-bold text-gray-700">55%</div>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-gray-100">
                    <div className="text-[10px] text-gray-400">Đạm Đậu & Hạt</div>
                    <div className="text-xs font-bold text-gray-700">25%</div>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-gray-100">
                    <div className="text-[10px] text-gray-400">Chất béo Tốt</div>
                    <div className="text-xs font-bold text-gray-700">20%</div>
                  </div>
                </div>
              </div>
            </article>

          </section>
        </div>

      </div>
    </div>
  );
}