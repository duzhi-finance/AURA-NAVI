/** Full legal/disclaimer footer -- sales-page only. See AppFooter for the tool's minimal in-product reminder. */
export default function Footer() {
  return (
    <footer className="desc-text mt-16 pt-6 border-t border-border text-[11px] text-text-tertiary leading-[1.6]">
      <p>
        身心靈免責：本工具內容結合星際瑪雅曆與生命靈數，僅供自我探索與策略參考，不能取代專業心理諮商、醫療或法律建議。
      </p>
      <p className="mt-1.5">
        數位退換貨政策：本產品為數位軟體與指令內容，一經交付發送即視同完成服務，恕不接受退換貨。
      </p>
      <p className="mt-1.5">
        © AURA-Navi. 本產品僅供購買者個人使用，禁止轉售、出租、改作或公開散布原始檔案與連結。
      </p>
    </footer>
  );
}

/** Minimal in-product reminder used across the app tool -- storage only, no legal/sales copy. */
export function AppFooter() {
  return (
    <footer className="desc-text mt-16 pt-6 border-t border-border text-[11px] text-text-tertiary leading-[1.6]">
      <p>資料僅儲存於本機瀏覽器，請定期匯出備份。</p>
    </footer>
  );
}
