import { BookHeart, Compass, FolderOpen, SendHorizonal, Users } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import Footer from "./Footer";

const NAV_ITEMS = [
  { to: "/", label: "星軌儀表板", Icon: Compass, end: true },
  { to: "/relations", label: "頻率藝廊", Icon: Users, end: false },
  { to: "/prompt-station", label: "策略樞紐", Icon: SendHorizonal, end: false },
  { to: "/journal", label: "靈魂日誌", Icon: BookHeart, end: false },
  { to: "/archive", label: "靈魂典藏館", Icon: FolderOpen, end: false },
];

const STORAGE_NOTICE =
  "貼心提醒：所有靈魂印記皆安全儲存於此裝置與瀏覽器。換裝置或清除快取會導致資料遺失，請記得至靈魂印記典藏館進行【匯出備份】。";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-bg">
      <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-border md:p-7 md:gap-10">
        <Brand />
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>
        <p className="mt-auto text-xs text-text-tertiary leading-relaxed">{STORAGE_NOTICE}</p>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex flex-col gap-2 px-5 py-5 border-b border-border">
          <Brand compact />
          <p className="text-xs text-text-tertiary leading-relaxed">{STORAGE_NOTICE}</p>
        </header>

        <main className="flex-1 min-w-0 px-5 py-8 md:px-14 md:py-14 pb-24 md:pb-14">
          <div className="mx-auto w-full max-w-5xl">
            <Outlet />
            <Footer />
          </div>
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-bg border-t border-border">
          <div className="flex justify-around py-2">
            {NAV_ITEMS.map((item) => (
              <MobileNavItem key={item.to} {...item} />
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}

function Brand({ compact }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <Compass size={22} strokeWidth={1.5} className="text-text-primary" />
      <div>
        <div className={`font-serif font-normal text-text-primary leading-tight ${compact ? "text-base" : "text-lg"}`}>
          AURA-Navi
        </div>
        {!compact && (
          <div className="text-[11px] text-text-tertiary leading-tight mt-0.5">
            星際天賦與全人關係導航系統
          </div>
        )}
      </div>
    </div>
  );
}

function NavItem({
  to,
  label,
  Icon,
  end,
}: {
  to: string;
  label: string;
  Icon: typeof Compass;
  end: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm border-l-2 transition-colors ${
          isActive
            ? "border-text-primary bg-surface text-text-primary font-medium"
            : "border-transparent text-text-secondary hover:bg-bg-subtle hover:text-text-primary"
        }`
      }
    >
      <Icon size={17} strokeWidth={1.5} />
      <span>{label}</span>
    </NavLink>
  );
}

function MobileNavItem({
  to,
  label,
  Icon,
  end,
}: {
  to: string;
  label: string;
  Icon: typeof Compass;
  end: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] ${
          isActive ? "text-text-primary" : "text-text-tertiary"
        }`
      }
    >
      <Icon size={19} strokeWidth={1.5} />
      <span>{label}</span>
    </NavLink>
  );
}
