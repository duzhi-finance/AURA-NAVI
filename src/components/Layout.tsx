import { NavLink, Outlet } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "心靈地圖", icon: "🌌", end: true },
  { to: "/relations", label: "關係翻譯館", icon: "🔮", end: false },
  { to: "/prompt-station", label: "對焦傳輸站", icon: "🛰️", end: false },
  { to: "/archive", label: "DNA Archive", icon: "📂", end: false },
];

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:border-white/5 md:p-6 md:gap-8">
        <Brand />
        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>
        <div className="mt-auto text-xs text-ink-500 leading-relaxed">
          AURA-Navi
          <br />
          全人天賦與關係翻譯 AI 系統
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between px-4 py-4 border-b border-white/5">
          <Brand compact />
        </header>

        <main className="flex-1 min-w-0 px-4 py-6 md:px-10 md:py-10 pb-24 md:pb-10">
          <div className="mx-auto w-full max-w-5xl">
            <Outlet />
          </div>
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 glass-card border-t border-white/10 rounded-none">
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
    <div className="flex items-center gap-2">
      <span className="text-2xl">🧭</span>
      <div className={compact ? "text-sm" : ""}>
        <div className="font-semibold text-gradient-aura text-lg leading-tight">AURA-Navi</div>
        {!compact && (
          <div className="text-[11px] text-ink-500 leading-tight">星際天賦與全人關係導航系統</div>
        )}
      </div>
    </div>
  );
}

function NavItem({ to, label, icon, end }: { to: string; label: string; icon: string; end: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${
          isActive
            ? "bg-eagle-blue/15 text-eagle-blue glow-eagle"
            : "text-ink-300 hover:bg-white/5 hover:text-ink-100"
        }`
      }
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

function MobileNavItem({ to, label, icon, end }: { to: string; label: string; icon: string; end: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-[10px] ${
          isActive ? "text-eagle-blue" : "text-ink-500"
        }`
      }
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}
