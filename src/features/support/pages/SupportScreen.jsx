import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bot,
  ChefHat,
  ChevronDown,
  CircleHelp,
  CreditCard,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquareWarning,
  PhoneCall,
  Search,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  UserCheck,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import AppFooter from "@/shared/components/AppFooter";
import AppHeader from "@/shared/components/AppHeader";
import { cn } from "@/lib/utils";

// Danh mục chủ đề hỗ trợ lấy cảm hứng từ cấu trúc phân tầng của Apple Support & Shopee Help Center
const TOPIC_CATEGORIES = [
  {
    id: "account",
    title: "Tài khoản & Bảo mật",
    icon: UserCheck,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    desc: "Đăng ký, xác thực OTP email, đổi mật khẩu và bảo mật thông tin cá nhân.",
    popularQuestions: [
      "Cách khôi phục mật khẩu khi quên",
      "Xác thực email và tài khoản qua mã OTP",
      "Thay đổi thông tin hồ sơ và sở thích ăn chay",
    ],
  },
  {
    id: "meal-ai",
    title: "Thực đơn & AI Trợ lý",
    icon: UtensilsCrossed,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    desc: "Tạo thực đơn cá nhân hóa theo calo, tính chỉ số BMI và hỏi đáp trợ lý Bông Cải.",
    popularQuestions: [
      "Cách AI tạo kế hoạch thực đơn 7 ngày",
      "Hỏi đáp dinh dưỡng với Trợ lý Bông Cải 24/7",
      "Tính toán chỉ số BMI và nhu cầu calo khuyến nghị",
    ],
  },
  {
    id: "recipes",
    title: "Công thức & Dinh dưỡng",
    icon: ChefHat,
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    desc: "Khám phá món chay, tính hàm lượng macro (đạm, béo, carb) và lưu công thức yêu thích.",
    popularQuestions: [
      "Cách lưu công thức vào bộ sưu tập yêu thích",
      "Xem chi tiết phân tích dinh dưỡng trên 100g",
      "Đóng góp công thức món chay mới cho cộng đồng",
    ],
  },
  {
    id: "community",
    title: "Cộng đồng & Bài viết",
    icon: Users,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    desc: "Đăng tải chia sẻ kinh nghiệm sống xanh, video ngắn và quy chuẩn kiểm duyệt nội dung.",
    popularQuestions: [
      "Tiêu chuẩn cộng đồng và quy trình AI kiểm duyệt",
      "Thời gian duyệt bài viết và video mới",
      "Bình luận, tương tác và thả tim bài viết",
    ],
  },
  {
    id: "payment",
    title: "Gói hội viên & Thanh toán",
    icon: CreditCard,
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    desc: "Đặc quyền gói Premium VIP, tra cứu lịch sử hóa đơn, phương thức thanh toán PayOS.",
    popularQuestions: [
      "Quyền lợi nâng cấp tài khoản gói VIP",
      "Xem lịch sử và tải hóa đơn thanh toán",
      "Chính sách gia hạn và giải quyết sự cố giao dịch",
    ],
  },
  {
    id: "places",
    title: "Bản đồ quán ăn chay",
    icon: MapPin,
    color: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    desc: "Tìm kiếm nhà hàng chay uy tín gần bạn, chỉ dẫn đường và chia sẻ địa điểm ăn uống xanh.",
    popularQuestions: [
      "Cách tìm quán chay gần vị trí hiện tại",
      "Xem giờ mở cửa và đánh giá từ cộng đồng",
      "Đề xuất địa điểm nhà hàng chay mới",
    ],
  },
];

// Danh sách câu hỏi thường gặp (FAQs)
const FAQ_LIST = [
  {
    id: "faq-1",
    category: "meal-ai",
    question: "Làm thế nào để tạo thực đơn dinh dưỡng cá nhân bằng AI?",
    answer:
      "Bạn truy cập vào mục 'Thực Đơn' trên thanh điều hướng, nhập các thông tin về thể trạng (chiều cao, cân nặng, mức độ vận động) và mục tiêu dinh dưỡng (giảm cân, giữ dáng, tăng cơ thuần chay). Trợ lý AI sẽ tự động phân tích và tạo lịch trình bữa ăn chi tiết cho cả tuần kèm hàm lượng calo và dinh dưỡng chính xác.",
  },
  {
    id: "faq-2",
    category: "meal-ai",
    question: "Trợ lý AI Bông Cải có thể hỗ trợ những gì?",
    answer:
      "Trợ lý Bông Cải là AI chuyên sâu về ẩm thực và dinh dưỡng thực vật. Bạn có thể hỏi Bông Cải cách nấu một món chay từ những nguyên liệu có sẵn trong tủ lạnh, tư vấn thay thế nguồn đạm động vật, hoặc giải đáp các thắc mắc về chế độ ăn chay trường, thuần chay (Vegan) hay ăn chay bán phần (Flexitarian).",
  },
  {
    id: "faq-3",
    category: "payment",
    question: "Gói hội viên VIP mang lại những quyền lợi đặc biệt nào?",
    answer:
      "Khi nâng cấp lên Gói hội viên VIP, bạn sẽ được mở khóa không giới hạn số lượt tạo thực đơn tự động bằng AI cao cấp, ưu tiên trò chuyện cùng Trợ lý Bông Cải với tốc độ phản hồi nhanh hơn, quyền truy cập sớm vào các công thức độc quyền từ chuyên gia dinh dưỡng và huy hiệu VIP nổi bật trên trang cá nhân.",
  },
  {
    id: "faq-4",
    category: "account",
    question: "Tôi không nhận được mã OTP xác thực email thì phải làm sao?",
    answer:
      "Mã OTP thường được gửi đến hòm thư của bạn trong vòng 1-2 phút. Vui lòng kiểm tra kỹ cả thư mục 'Spam' hoặc 'Thư rác'. Nếu sau 2 phút vẫn chưa nhận được, bạn có thể bấm nút 'Gửi lại mã OTP'. Nếu sự cố vẫn tiếp diễn, hãy liên hệ đội ngũ hỗ trợ qua email support@veggiepal.vn.",
  },
  {
    id: "faq-5",
    category: "community",
    question: "Tại sao bài viết hoặc bình luận của tôi bị giữ lại ở trạng thái 'Chờ duyệt'?",
    answer:
      "Để bảo vệ môi trường sống xanh lành mạnh và tích cực cho mọi người, VeggiePal áp dụng hệ thống kiểm duyệt tự động bằng AI kết hợp với ban quản trị. Các nội dung chứa ngôn từ nhạy cảm, quảng cáo không rõ nguồn gốc hoặc có dấu hiệu spam sẽ được chuyển vào hàng đợi kiểm duyệt thủ công và phản hồi trong vòng 24 giờ.",
  },
  {
    id: "faq-6",
    category: "places",
    question: "Dữ liệu bản đồ nhà hàng chay được cập nhật như thế nào?",
    answer:
      "Dữ liệu bản đồ được đội ngũ VeggiePal và cộng đồng người ăn chay tại Việt Nam liên tục cập nhật, xác thực địa chỉ, giờ mở cửa và các món ăn tiêu biểu. Bạn có thể dễ dàng định vị các quán ăn chay ngon, sạch quanh khu vực của mình trên bản đồ tương tác.",
  },
  {
    id: "faq-7",
    category: "payment",
    question: "VeggiePal hỗ trợ những phương thức thanh toán nào?",
    answer:
      "Chúng tôi tích hợp cổng thanh toán trực tuyến an toàn PayOS, hỗ trợ quét mã VietQR qua tất cả các ứng dụng ngân hàng tại Việt Nam (Vietcombank, MB, Techcombank, VPBank,...) cũng như các ví điện tử phổ biến. Giao dịch được xử lý và kích hoạt gói ngay lập tức.",
  },
];

const FILTER_TABS = [
  { id: "all", label: "Tất cả câu hỏi" },
  { id: "meal-ai", label: "Thực đơn & AI" },
  { id: "account", label: "Tài khoản" },
  { id: "payment", label: "Gói VIP & Thanh toán" },
  { id: "community", label: "Cộng đồng" },
  { id: "places", label: "Bản đồ quán chay" },
];

export default function SupportScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedFaqId, setExpandedFaqId] = useState("faq-1");
  const [feedbackGiven, setFeedbackGiven] = useState({});

  // Form gửi thắc mắc liên hệ nhanh
  const [contactSubject, setContactSubject] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactContent, setContactContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lọc câu hỏi thường gặp theo từ khóa tìm kiếm và danh mục được chọn
  const filteredFaqs = useMemo(() => {
    return FAQ_LIST.filter((faq) => {
      const matchCategory =
        activeCategory === "all" || faq.category === activeCategory;
      if (!matchCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, activeCategory]);

  const toggleFaq = (id) => {
    setExpandedFaqId((prev) => (prev === id ? null : id));
  };

  const handleFeedback = (faqId, isHelpful) => {
    if (feedbackGiven[faqId] != null) return;
    setFeedbackGiven((prev) => ({ ...prev, [faqId]: isHelpful }));
    toast.success(
      isHelpful
        ? "Cảm ơn bạn đã đánh giá câu trả lời hữu ích!"
        : "Cảm ơn bạn đã phản hồi! Chúng tôi sẽ cải thiện câu trả lời này."
    );
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactContent.trim()) {
      toast.error("Vui lòng nhập nội dung cần hỗ trợ.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setContactSubject("");
      setContactEmail("");
      setContactContent("");
      toast.success(
        "Yêu cầu hỗ trợ / Báo cáo sự cố của bạn đã được gửi thành công. Đội ngũ VeggiePal sẽ kiểm tra và phản hồi sớm nhất qua email!"
      );
    }, 600);
  };

  return (
    <div className="min-h-dvh flex flex-col bg-canvas text-ink">
      <AppHeader />

      <main className="flex-1 pb-16">
        {/* ========================================================== */}
        {/* 1. HERO SECTION & THANH TÌM KIẾM (Phong cách Apple / Shopee) */}
        {/* ========================================================== */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-brand-soft/40 via-surface to-canvas py-14 px-4 sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand-soft px-3.5 py-1 text-xs font-semibold text-brand shadow-2xs">
              <Sparkles className="size-3.5" />
              Trung tâm Trợ giúp & Hỗ trợ VeggiePal
            </span>

            <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Chúng tôi có thể giúp gì cho bạn?
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-subtle sm:text-base">
              Tìm kiếm hướng dẫn sử dụng, giải đáp các thắc mắc về dinh dưỡng,
              thực đơn AI, gói hội viên và các quy định cộng đồng sống xanh.
            </p>

            {/* Hộp tìm kiếm thông minh */}
            <div className="relative mx-auto mt-8 max-w-2xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-subtle" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm câu hỏi, từ khóa: gói VIP, tạo thực đơn, đổi mật khẩu, calo..."
                aria-label="Tìm kiếm trong Trung tâm trợ giúp"
                className="h-14 w-full rounded-full border border-border bg-card pl-12 pr-4 text-base text-ink shadow-md outline-none transition placeholder:text-subtle focus:border-brand/50 focus:ring-4 focus:ring-brand/15"
              />
            </div>

            {/* Gợi ý từ khóa tìm kiếm nhanh */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-subtle">
              <span className="font-medium text-ink">Từ khóa gợi ý:</span>
              {[
                "Tạo thực đơn AI",
                "Gói hội viên VIP",
                "Quên mật khẩu",
                "Dinh dưỡng 100g",
                "Bản đồ quán chay",
              ].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setSearchQuery(term)}
                  className="rounded-full border border-border bg-card px-3 py-1 text-subtle transition hover:border-brand/40 hover:bg-brand-soft/40 hover:text-brand cursor-pointer shadow-2xs"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-[1240px] px-4 pt-12 sm:px-6">
          {/* ========================================================== */}
          {/* 2. CÁC CHỦ ĐỀ TRỢ GIÚP NỔI BẬT (Grid Topic Cards)           */}
          {/* ========================================================== */}
          <section aria-labelledby="topics-heading" className="space-y-6">
            <div className="text-center sm:text-left">
              <h2
                id="topics-heading"
                className="font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl"
              >
                Khám phá theo chủ đề
              </h2>
              <p className="mt-1 text-sm text-subtle">
                Chọn danh mục bạn cần giải đáp để xem tài liệu và câu hỏi liên quan.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {TOPIC_CATEGORIES.map((topic) => {
                const Icon = topic.icon;
                return (
                  <div
                    key={topic.id}
                    onClick={() => {
                      setActiveCategory(topic.id);
                      const el = document.getElementById("faq-section");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="group relative flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:border-brand/40 hover:shadow-md cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "grid size-12 shrink-0 place-items-center rounded-2xl",
                            topic.color
                          )}
                        >
                          <Icon className="size-6" />
                        </span>
                        <h3 className="font-heading text-lg font-bold text-ink group-hover:text-brand transition-colors">
                          {topic.title}
                        </h3>
                      </div>

                      <p className="mt-3 text-xs leading-relaxed text-subtle">
                        {topic.desc}
                      </p>

                      <div className="mt-4 space-y-2 border-t border-border/60 pt-3">
                        {topic.popularQuestions.map((q, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-xs text-subtle group-hover:text-ink transition-colors"
                          >
                            <span className="size-1 rounded-full bg-brand shrink-0" />
                            <span className="line-clamp-1">{q}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand">
                      <span>Xem chi tiết</span>
                      <ChevronDown className="size-3.5 -rotate-90 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ========================================================== */}
          {/* 3. CÂU HỎI THƯỜNG GẶP (Accordion FAQs - Shopee style)      */}
          {/* ========================================================== */}
          <section
            id="faq-section"
            aria-labelledby="faq-heading"
            className="mt-16 space-y-6 scroll-mt-24"
          >
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2
                  id="faq-heading"
                  className="font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl"
                >
                  Câu hỏi thường gặp (FAQs)
                </h2>
                <p className="mt-1 text-sm text-subtle">
                  Giải đáp nhanh các thắc mắc phổ biến nhất của cộng đồng người dùng.
                </p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div
              role="tablist"
              className="no-scrollbar flex gap-2 overflow-x-auto border-b border-border pb-3 text-xs font-semibold"
            >
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={cn(
                    "whitespace-nowrap rounded-full px-4 py-2 transition cursor-pointer shadow-2xs",
                    activeCategory === tab.id
                      ? "bg-brand text-brand-foreground shadow-xs font-bold"
                      : "border border-border bg-card text-subtle hover:bg-surface hover:text-ink"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Accordion FAQ items */}
            {filteredFaqs.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center text-sm text-subtle">
                <CircleHelp className="mx-auto size-8 text-subtle/60" />
                <p className="mt-2 font-medium text-ink">
                  Không tìm thấy câu hỏi phù hợp với từ khóa "{searchQuery}"
                </p>
                <p className="mt-1 text-xs text-subtle">
                  Vui lòng thử từ khóa khác hoặc gửi yêu cầu hỗ trợ trực tiếp bên dưới.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFaqs.map((faq) => {
                  const isExpanded = expandedFaqId === faq.id;
                  const feedback = feedbackGiven[faq.id];

                  return (
                    <div
                      key={faq.id}
                      className={cn(
                        "overflow-hidden rounded-2xl border transition-all duration-200 bg-card",
                        isExpanded
                          ? "border-brand/40 shadow-sm ring-1 ring-brand/10"
                          : "border-border hover:border-border/80"
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(faq.id)}
                        aria-expanded={isExpanded}
                        className="flex w-full items-center justify-between gap-4 p-5 text-left font-medium text-ink transition hover:bg-surface/50 cursor-pointer"
                      >
                        <span className="font-heading text-base font-semibold sm:text-lg">
                          {faq.question}
                        </span>
                        <span
                          className={cn(
                            "grid size-8 shrink-0 place-items-center rounded-full bg-surface text-subtle transition-transform duration-200",
                            isExpanded && "rotate-180 bg-brand-soft text-brand"
                          )}
                        >
                          <ChevronDown className="size-4" />
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-border/50 bg-surface/30 px-5 pb-5 pt-3 text-sm text-body leading-relaxed animate-in fade-in-50 duration-200">
                          <p className="whitespace-pre-line">{faq.answer}</p>

                          {/* Đánh giá độ hữu ích */}
                          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-3 text-xs text-subtle">
                            <span>Câu trả lời này có hữu ích với bạn không?</span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={feedback != null}
                                onClick={() => handleFeedback(faq.id, true)}
                                className={cn(
                                  "inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 font-medium transition cursor-pointer",
                                  feedback === true
                                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                                    : "hover:bg-surface text-subtle"
                                )}
                              >
                                <ThumbsUp className="size-3" />
                                <span>Có</span>
                              </button>
                              <button
                                type="button"
                                disabled={feedback != null}
                                onClick={() => handleFeedback(faq.id, false)}
                                className={cn(
                                  "inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 font-medium transition cursor-pointer",
                                  feedback === false
                                    ? "bg-rose-500/10 text-rose-600 border-rose-500/30"
                                    : "hover:bg-surface text-subtle"
                                )}
                              >
                                <ThumbsDown className="size-3" />
                                <span>Chưa hữu ích</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* ========================================================== */}
          {/* 4. KÊNH HỖ TRỢ TRỰC TIẾP (Apple Direct Contact Section)     */}
          {/* ========================================================== */}
          <section
            id="contact"
            aria-labelledby="contact-heading"
            className="mt-16 scroll-mt-24 rounded-3xl border border-border bg-gradient-to-br from-card via-card to-brand-soft/20 p-6 sm:p-10 shadow-sm"
          >
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
                <MessageSquareWarning className="size-3.5" />
                Liên hệ hỗ trợ & Báo cáo sự cố
              </span>
              <h2
                id="contact-heading"
                className="mt-3 font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl"
              >
                Liên hệ hỗ trợ hoặc Báo cáo sự cố
              </h2>
              <p className="mt-1 text-sm text-subtle leading-relaxed">
                Nếu bạn cần giải đáp thêm ngoài kho tài liệu hoặc gặp sự cố kỹ thuật trong quá trình trải nghiệm,
                hãy liên hệ với đội ngũ VeggiePal qua các kênh dưới đây hoặc gửi biểu mẫu báo cáo.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Kênh 1: AI Bông Cải 24/7 */}
              <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-2xs">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-xl bg-brand text-brand-foreground">
                      <Bot className="size-6" />
                    </span>
                    <div>
                      <h3 className="font-heading font-bold text-ink">
                        Trợ lý AI Bông Cải
                      </h3>
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        • Trực tuyến 24/7
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-subtle">
                    Giải đáp ngay lập tức mọi thắc mắc về công thức, tính calo,
                    cách ăn chay khoa học và hướng dẫn sử dụng website.
                  </p>
                </div>
                <div className="mt-5">
                  <Button
                    asChild
                    className="w-full gap-2 rounded-xl bg-brand font-semibold text-brand-foreground shadow-xs hover:bg-brand/90 cursor-pointer"
                  >
                    <Link to="/chatbot">
                      <MessageCircle className="size-4" />
                      Chat với Bông Cải ngay
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Kênh 2: Email hỗ trợ */}
              <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-2xs">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <Mail className="size-6" />
                    </span>
                    <div>
                      <h3 className="font-heading font-bold text-ink">
                        Hỗ trợ qua Email
                      </h3>
                      <span className="text-[11px] text-subtle">
                        Phản hồi trong 24h làm việc
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-subtle">
                    Gửi yêu cầu hỗ trợ về các vấn đề tài khoản, khiếu nại bản
                    quyền nội dung hoặc thắc mắc thanh toán hóa đơn.
                  </p>
                </div>
                <div className="mt-5">
                  <a
                    href="mailto:support@veggiepal.vn"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-2.5 text-xs font-semibold text-ink transition hover:bg-surface hover:text-brand cursor-pointer"
                  >
                    <Mail className="size-4" />
                    support@veggiepal.vn
                  </a>
                </div>
              </div>

              {/* Kênh 3: Hotline hỗ trợ */}
              <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-2xs">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <PhoneCall className="size-6" />
                    </span>
                    <div>
                      <h3 className="font-heading font-bold text-ink">
                        Tổng đài hỗ trợ
                      </h3>
                      <span className="text-[11px] text-subtle">
                        08:00 - 20:00 (Thứ 2 - CN)
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-subtle">
                    Hỗ trợ nhanh các trường hợp khẩn cấp liên quan đến gói hội
                    viên hoặc sự cố gián đoạn dịch vụ hệ thống.
                  </p>
                </div>
                <div className="mt-5">
                  <a
                    href="tel:19008888"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-2.5 text-xs font-semibold text-ink transition hover:bg-surface hover:text-brand cursor-pointer"
                  >
                    <PhoneCall className="size-4" />
                    Hotline: 1900 8888
                  </a>
                </div>
              </div>
            </div>

            {/* Form gửi câu hỏi trực tuyến hoặc báo cáo sự cố */}
            <div className="mt-8 rounded-2xl border border-border bg-surface/60 p-6 sm:p-8">
              <h3 className="font-heading text-lg font-bold text-ink">
                Gửi yêu cầu hỗ trợ & Báo cáo sự cố
              </h3>
              <p className="mt-1 text-xs text-subtle">
                Điền thông tin thắc mắc hoặc mô tả sự cố gặp phải để đội ngũ hỗ trợ kỹ thuật kiểm tra và phản hồi sớm nhất.
              </p>

              <form onSubmit={handleContactSubmit} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5">
                      Tiêu đề vấn đề
                    </label>
                    <input
                      type="text"
                      required
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      placeholder="Ví dụ: Lỗi thanh toán gói VIP..."
                      className="h-10 w-full rounded-xl border border-border bg-card px-3.5 text-xs text-ink outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/15 placeholder:text-subtle"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5">
                      Email liên hệ nhận phản hồi
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="email.cua.ban@gmail.com"
                      className="h-10 w-full rounded-xl border border-border bg-card px-3.5 text-xs text-ink outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/15 placeholder:text-subtle"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    Mô tả chi tiết nội dung cần trợ giúp
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={contactContent}
                    onChange={(e) => setContactContent(e.target.value)}
                    placeholder="Vui lòng mô tả chi tiết sự cố bạn đang gặp phải..."
                    className="w-full rounded-xl border border-border bg-card p-3 text-xs text-ink outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/15 placeholder:text-subtle"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-brand px-6 text-xs font-semibold text-brand-foreground shadow-xs hover:bg-brand/90 cursor-pointer"
                  >
                    {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu / Báo cáo sự cố"}
                  </Button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
