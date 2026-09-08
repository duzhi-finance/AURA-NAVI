# AURA-Navi

星際天賦與全人關係導航系統 — 一個輕量化、去中心化的圖卡引導與高精準 Prompt 產生器。

系統不直接呼叫 AI LLM API，而是引導使用者至 [glowing.cc](https://glowing.cc) 取得瑪雅印記圖卡後，
依據使用者選擇的情境合成專屬的高維解析指令，並一鍵導向 [Gemini](https://gemini.google.com)
進行免費且深度的全人人生分析。

## 核心頁面

1. **星際心靈地圖 (Dashboard)** — 今日流年頻率燈號、瑪雅印記小卡、快捷入口
2. **關係解碼與翻譯館 (Relation Alignment Hub)** — 雙人天賦比對與關係 Prompt 生成
3. **高維對焦傳輸站 (Quantum Prompt Station)** — 四步驟生成情境化 Navigation Prompt
4. **Talent DNA Archive** — 自己與關係人的天賦檔案典藏庫（新增／編輯／刪除）

所有天賦檔案資料儲存於瀏覽器 `localStorage`，無需後端伺服器。

## 開發

```bash
npm install
npm run dev      # 開發伺服器
npm run build    # 產出正式版
```

## 技術棧

React + TypeScript + Vite + React Router + Tailwind CSS v4
