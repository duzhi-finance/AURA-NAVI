import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import TotemEmblem from "../components/TotemEmblem";
import { buildChakraCard } from "../lib/chakraMap";
import { MAYA_TOTEMS } from "../lib/mayaOptions";
import { getSelfProfile } from "../lib/store";
import { computeCurrentCycleYear, computeWavespellYears, wavespellName } from "../lib/wavespellCycle";
import type { TalentProfile } from "../types/talent";

export default function DeepDivePage() {
  const [selfProfile, setSelfProfile] = useState<TalentProfile | undefined>(undefined);

  useEffect(() => {
    setSelfProfile(getSelfProfile());
  }, []);

  const years = useMemo(
    () => (selfProfile?.maya_kin ? computeWavespellYears(selfProfile.maya_kin) : []),
    [selfProfile]
  );
  const currentYear = useMemo(
    () => (selfProfile?.birth_date ? computeCurrentCycleYear(selfProfile.birth_date) : null),
    [selfProfile]
  );
  const chakraRows = useMemo(
    () => (selfProfile?.maya_kin ? buildChakraCard(selfProfile.maya_kin) : []),
    [selfProfile]
  );

  if (!selfProfile?.maya_kin) {
    return (
      <div>
        <PageHeader
          eyebrow="13-Year Cycle & Chakra Atlas"
          title="深度星軌模組"
          description="13 年生命大運時間軸，與身心靈三維脈輪卡。"
        />
        <div className="panel p-12 text-center text-text-secondary">
          <p>尚未建立你的靈魂印記。</p>
          <Link to="/app/archive" className="text-text-primary underline mt-2 inline-block">
            前往建立
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="13-Year Cycle & Chakra Atlas"
        title="深度星軌模組"
        description="13 年生命大運時間軸，與身心靈三維脈輪卡。"
      />

      <section className="mb-10">
        <h2 className="text-sm font-medium text-text-secondary mb-1">
          13 年生命大運波符｜{wavespellName(selfProfile.maya_kin)}
        </h2>
        {currentYear ? (
          <p className="desc-text text-xs text-text-tertiary mb-4">
            你目前處於第 {currentYear} 年。點擊任一年份查看核心學習課題與突破亮點。
          </p>
        ) : (
          <p className="desc-text text-xs text-text-tertiary mb-4">
            補上完整出生年月日即可標示你目前所在的年份。
            <Link to="/app/archive" className="text-text-primary underline ml-1">
              前往補填
            </Link>
          </p>
        )}

        <div className="flex flex-col gap-2.5">
          {years.map((y) => {
            const seed = MAYA_TOTEMS.indexOf(y.totem);
            const isCurrent = currentYear === y.year;
            return (
              <details
                key={y.year}
                open={isCurrent}
                className={`rounded-xl border px-4 py-3 ${
                  isCurrent ? "border-luxe-gold bg-bg-subtle/50" : "border-border"
                }`}
              >
                <summary className="cursor-pointer select-none flex items-center gap-3">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-serif font-semibold shrink-0 ${
                      isCurrent
                        ? "bg-luxe-gold text-white"
                        : "bg-bg border border-border text-text-secondary"
                    }`}
                  >
                    {y.year}
                  </span>
                  <TotemEmblem seed={seed >= 0 ? seed : 0} size={20} className="text-luxe-gold shrink-0" />
                  <span className="text-sm text-text-primary font-medium flex-1">
                    第 {y.year} 年｜{y.tone}．{y.totem}
                  </span>
                  <span className="text-[11px] text-text-tertiary font-serif">KIN {y.kin}</span>
                </summary>
                <div className="mt-3 pl-11 flex flex-col gap-2">
                  <div className="text-xs">
                    <span className="text-text-tertiary">核心學習課題：</span>
                    <span className="desc-text text-text-secondary">{y.coreLesson}</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-text-tertiary">突破亮點：</span>
                    <span className="desc-text text-text-secondary">{y.breakthrough}</span>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium text-text-secondary mb-1">身心靈三維脈輪卡</h2>
        <p className="desc-text text-xs text-text-tertiary mb-4">
          本命 KIN、PSI 隱藏推動與內在女神力，各自對應的脈輪與地球家族。
        </p>

        <div className="flex flex-col gap-4">
          {chakraRows.map((row) => {
            const seed = MAYA_TOTEMS.indexOf(row.totem);
            return (
              <div key={row.role} className="card-glass p-6 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <TotemEmblem seed={seed >= 0 ? seed : 0} size={32} className="text-luxe-gold shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-serif text-sm font-semibold text-text-primary">
                      {row.role}
                    </div>
                    <div className="text-[11px] text-text-tertiary mt-0.5">
                      KIN {row.kin}．{row.totem}｜{row.chakra}｜{row.earthFamily}
                    </div>
                  </div>
                </div>
                <p className="desc-text text-xs text-text-secondary leading-relaxed mt-1">
                  {row.trait}
                </p>
                <p className="desc-text text-xs text-text-tertiary leading-relaxed border-t border-border pt-2 mt-1">
                  {row.roleContext}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
