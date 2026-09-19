import { BookHeart, Compass, FolderOpen, SendHorizonal, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { isOnboardingDone, listProfiles, markOnboardingDone, saveProfile } from "../lib/store";
import type { TalentProfile } from "../types/talent";
import { IssueLabel } from "./Editorial";
import { AppFooter } from "./Footer";
import OnboardingWizard from "./OnboardingWizard";

const NAV_ITEMS = [
  { to: "/app", label: "星軌儀表板", chapter: "01", Icon: Compass, end: true },
  { to: "/app/journal", label: "靈魂日誌", chapter: "02", Icon: BookHeart, end: false },
  { to: "/app/relations", label: "頻率藝廊", chapter: "03", Icon: Users, end: false },
  { to: "/app/prompt-station", label: "策略樞紐", chapter: "04", Icon: SendHorizonal, end: false },
  { to: "/app/archive", label: "靈魂典藏館", chapter: "05", Icon: FolderOpen, end: false },
];

export interface OnboardingContext {
  /** True until the user has copied their first navigation prompt on Prompt Station. */
  firstRunPending: boolean;
  completeFirstRun: () => void;
}

export default function Layout() {
  const location = useLocation();
  const [profiles, setProfiles] = useState<TalentProfile[] | null>(null);
  const [onboardingDone, setOnboardingDone] = useState(true);

  useEffect(() => {
    setProfiles(listProfiles());
    setOnboardingDone(isOnboardingDone());
  }, []);

  // avoid a flash of the locked/gated UI before localStorage has been read
  if (profiles === null) return null;

  if (profiles.length === 0) {
    return (
      <OnboardingWizard
        onProfileSaved={(profile) => {
          saveProfile(profile);
          setProfiles(listProfiles());
        }}
      />
    );
  }

  if (!onboardingDone && location.pathname !== "/app/prompt-station") {
    return <Navigate to="/app/prompt-station" replace />;
  }

  const onboardingContext: OnboardingContext = {
    firstRunPending: !onboardingDone,
    completeFirstRun: () => {
      markOnboardingDone();
      setOnboardingDone(true);
    },
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-bg">
      <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-border md:p-7 md:gap-10">
        <div className="flex flex-col gap-3">
          <IssueLabel text="AURA-Navi Journal ── ISSUE VOL.01 / AUTUMN" />
          <Brand />
        </div>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>

        <Link
          to="/"
          className="mt-auto text-[11px] text-text-tertiary hover:text-text-secondary underline"
        >
          認識 AURA-Navi Journal
        </Link>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex flex-col gap-2 px-5 py-5 border-b border-border">
          <IssueLabel text="AURA-Navi Journal ── ISSUE VOL.01 / AUTUMN" />
          <Brand compact />
        </header>

        <main className="flex-1 min-w-0 px-5 py-8 md:px-14 md:py-14 pb-24 md:pb-14">
          <div className="mx-auto w-full max-w-5xl">
            <Outlet context={onboardingContext} />
            <AppFooter />
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
  chapter,
  Icon,
  end,
}: {
  to: string;
  label: string;
  chapter: string | null;
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
      {chapter && (
        <span className="font-sans text-[10px] font-light tracking-[0.1em] text-text-tertiary">
          {chapter}
        </span>
      )}
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
  chapter?: string | null;
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
