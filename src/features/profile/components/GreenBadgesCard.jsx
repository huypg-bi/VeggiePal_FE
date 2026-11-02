import { Link } from "react-router-dom";
import { Award, BadgeCheck, Heart } from "lucide-react";

import { CHALLENGE_BADGE_NAME } from "@/features/blog/utils/challenge";
import { useProfile } from "@/features/profile/hooks/useProfile";

// Huy hiệu còn hiệu lực lấy từ `badges` của GET /users/me; loại lạ do BE thêm sau thì hiện chung một kiểu.
const BADGE_STYLES = {
  ACHIEVEMENT: {
    title: CHALLENGE_BADGE_NAME,
    desc: "Hoàn thành thử thách 7 ngày sống thuần chay",
    icon: Heart,
    color: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400",
  },
  VERIFIED: {
    title: "Tài khoản được xác minh",
    desc: "Quản trị viên VeggiePal đã xác minh tài khoản này",
    icon: BadgeCheck,
    color: "bg-brand-soft text-brand",
  },
};

const FALLBACK_STYLE = {
  title: "Huy hiệu VeggiePal",
  desc: "Huy hiệu do VeggiePal trao tặng",
  icon: Award,
  color: "bg-surface text-subtle",
};

const formatGrantedDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("vi-VN");
};

export default function GreenBadgesCard() {
  const { profile } = useProfile();
  const badges = profile?.badges ?? [];

  return (
    <div className="bg-card rounded-3xl p-5 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-brand" />
          <h3 className="font-bold text-ink text-sm">Huy Hiệu Xanh</h3>
        </div>
        <span className="text-[11px] text-subtle">{badges.length} đạt được</span>
      </div>

      {badges.length === 0 ? (
        <p className="rounded-2xl bg-surface p-3 text-[11px] leading-relaxed text-subtle">
          Bạn chưa có huy hiệu nào. Hoàn thành thử thách 7 ngày ở{" "}
          <Link to="/blog" className="font-semibold text-brand hover:underline">
            trang Cộng đồng
          </Link>{" "}
          để nhận huy hiệu đầu tiên.
        </p>
      ) : (
        <div className="space-y-3">
          {badges.map((badge) => {
            const style = BADGE_STYLES[badge.type] ?? FALLBACK_STYLE;
            const Icon = style.icon;
            const grantedOn = formatGrantedDate(badge.grantedAt);
            return (
              <div key={badge.id} className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-surface transition-colors">
                <div className={`w-9 h-9 rounded-xl ${style.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink">{style.title}</h4>
                  <p className="text-[11px] text-subtle leading-tight mt-0.5">{style.desc}</p>
                  {grantedOn && <p className="text-[10px] text-subtle mt-1">Nhận ngày {grantedOn}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
