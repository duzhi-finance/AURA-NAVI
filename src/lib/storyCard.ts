import { cardSeedIndex, type DailyCard } from "./dailyCard";

function wrapCjkText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let current = "";
  for (const ch of text) {
    const test = current + ch;
    if (current && ctx.measureText(test).width > maxWidth) {
      lines.push(current);
      current = ch;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawTotemEmblem(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  seed: number,
  color: string
) {
  const spokeCount = 8 + (seed % 5) * 2;
  const rotation = ((seed * 17) % 360) * (Math.PI / 180);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.strokeStyle = color;
  ctx.lineWidth = radius * 0.012;

  ctx.globalAlpha = 0.45;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.95, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.65, 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < spokeCount; i++) {
    const angle = ((Math.PI * 2) / spokeCount) * i;
    const x1 = Math.cos(angle) * radius * 0.68;
    const y1 = Math.sin(angle) * radius * 0.68;
    const x2 = Math.cos(angle) * radius * 0.87;
    const y2 = Math.sin(angle) * radius * 0.87;

    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.save();
    ctx.translate(x2, y2);
    ctx.rotate(Math.PI / 4);
    const d = radius * 0.032;
    ctx.globalAlpha = 0.65;
    ctx.fillStyle = color;
    ctx.fillRect(-d, -d, d * 2, d * 2);
    ctx.restore();
  }
  ctx.restore();

  ctx.globalAlpha = 0.08;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.42, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 0.65;
  ctx.strokeStyle = color;
  ctx.lineWidth = radius * 0.014;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.42, 0, Math.PI * 2);
  ctx.stroke();

  ctx.globalAlpha = 1;
}

function todayFileStamp(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

export interface StoryCardOptions {
  dateLabel: string;
  frequencyLabel: string;
  frequencyColor: string;
  card: DailyCard;
}

export async function exportDailyStoryCard(opts: StoryCardOptions): Promise<void> {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const W = 1080;
  const H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const gold = "#b8935a";
  const ink = "#2c2c2a";

  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, "#fffdf8");
  bgGrad.addColorStop(1, "#faf9f6");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  const margin = 64;
  ctx.strokeStyle = gold;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.8;
  ctx.strokeRect(margin, margin, W - margin * 2, H - margin * 2);
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.4;
  ctx.strokeRect(margin + 14, margin + 14, W - (margin + 14) * 2, H - (margin + 14) * 2);
  ctx.globalAlpha = 1;

  ctx.textAlign = "center";

  ctx.fillStyle = gold;
  ctx.font = "500 32px 'Noto Serif TC', serif";
  ctx.fillText("A U R A · N A V I", W / 2, 220);

  ctx.fillStyle = "#888888";
  ctx.font = "300 30px 'Noto Serif TC', serif";
  ctx.fillText(opts.dateLabel, W / 2, 270);

  ctx.fillStyle = opts.frequencyColor;
  ctx.font = "500 52px 'Noto Serif TC', serif";
  ctx.fillText(`今日流年 · ${opts.frequencyLabel}`, W / 2, 380);

  const seed = cardSeedIndex(opts.card);
  drawTotemEmblem(ctx, W / 2, 760, 260, seed, gold);

  ctx.fillStyle = ink;
  ctx.font = "400 96px 'Noto Serif TC', serif";
  ctx.fillText(opts.card.name, W / 2, 1180);

  ctx.font = "300 40px 'Noto Sans TC', sans-serif";
  ctx.fillStyle = "#5a5a56";
  const lines = wrapCjkText(ctx, opts.card.insight, 720);
  let ly = 1280;
  for (const line of lines) {
    ctx.fillText(line, W / 2, ly);
    ly += 58;
  }

  ctx.globalAlpha = 0.75;
  ctx.fillStyle = gold;
  ctx.font = "500 24px 'Noto Serif TC', serif";
  ctx.fillText("CELESTIAL SYNASTRY CHRONOGRAPH", W / 2, H - margin - 60);
  ctx.globalAlpha = 1;

  const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) return;

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `aura-navi-story-${todayFileStamp()}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
