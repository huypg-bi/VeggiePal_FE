import logo from "@/assets/img/logo.png";
import { FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from "./SocialIcons";

const SOCIALS = [
  { id: "facebook", Icon: FacebookIcon, label: "Facebook" },
  { id: "instagram", Icon: InstagramIcon, label: "Instagram" },
  { id: "youtube", Icon: YoutubeIcon, label: "Youtube" },
  { id: "tiktok", Icon: TiktokIcon, label: "TikTok" },
];

export default function HomeFooter() {
  return (
    <footer className="mt-12 px-6 sm:px-8">
      <div className="mx-auto flex w-full max-w-[1230px] flex-col items-center justify-between gap-4 rounded-3xl border border-border bg-surface px-6 py-6 shadow-sm md:flex-row md:items-end">

        <p className="order-3 text-xs text-subtle md:order-1 md:w-1/3 md:text-left">
          © 2026 VeggiePal đồng hành cùng bạn trên hành trình sống xanh.
        </p>

        <div className="order-1 flex flex-col items-center gap-1 md:order-2 md:w-1/3">
          <img src={logo} alt="VeggiePal" className="h-30 w-auto" />
          <p className="text-base font-medium text-[#5AA451]">
            Ăn xanh - Sống lành - Hạnh phúc hơn!
          </p>
        </div>

        <div className="order-2 flex items-center justify-center gap-4 md:order-3 md:w-1/3 md:justify-end">
          {SOCIALS.map(({ id, Icon, label }) => (
            <a
              key={id}
              href="#"
              aria-label={label}
              className="text-[#133E27] transition hover:opacity-75 dark:text-[#8fe0b3]"
            >
              <Icon className="h-7 w-7" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
