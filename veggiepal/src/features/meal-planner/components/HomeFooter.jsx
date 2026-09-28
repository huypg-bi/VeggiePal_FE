import logo from "@/assets/img/logo.png";
import { FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from "./SocialIcons";

const SOCIALS = [
  { id: "facebook", Icon: FacebookIcon, label: "Facebook" },
  { id: "instagram", Icon: InstagramIcon, label: "Instagram" },
  { id: "youtube", Icon: YoutubeIcon, label: "Youtube" },
  { id: "tiktok", Icon: TiktokIcon, label: "TikTok" },
];

const FOOTER_LINKS = [
  { id: "about", label: "Giới thiệu" },
  { id: "policy", label: "Chính sách dinh dưỡng" },
  { id: "community", label: "Cộng đồng thuần chay" },
  { id: "contact", label: "Liên hệ & Góp ý" },
];

export default function HomeFooter() {
  return (
    <footer className="mt-12 border-t border-border px-6 sm:px-8">
      <div className="mx-auto flex w-full max-w-[1230px] flex-col gap-6 py-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col items-center gap-1 md:items-start">
              <img src={logo} alt="VeggiePal" className="h-9 w-auto" />
            <p className="text-sm text-brand">
              Ăn xanh - Sống lành - Hạnh phúc hơn!
            </p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-subtle">
            {FOOTER_LINKS.map(({ id, label }) => (
              <a key={id} href="#" className="transition hover:text-ink">
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {SOCIALS.map(({ id, Icon, label }) => (
              <a
                key={id}
                href="#"
                aria-label={label}
                className="text-brand transition hover:opacity-75"
              >
                <Icon className="h-6 w-6" />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 border-t border-border pt-4 text-xs text-subtle sm:flex-row sm:justify-between">
          <p>© 2026 VeggiePal đồng hành cùng bạn trên hành trình sống xanh.</p>
          <p>Được tư vấn bởi trí tuệ nhân tạo Bé Bông Cải</p>
        </div>
      </div>
    </footer>
  );
}
