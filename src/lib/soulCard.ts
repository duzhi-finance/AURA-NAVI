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

export interface SoulCardOptions {
  cardNumber: number;
  cardName: string;
  totem: string;
  totemSeed: number;
  kin: number;
  quote: string;
}

export const SOUL_CARD_WIDTH = 1080;
export const SOUL_CARD_HEIGHT = 1920;

/** Draws the soul card synchronously onto an already-sized (1080x1920) canvas. */
export function drawSoulCard(canvas: HTMLCanvasElement, opts: SoulCardOptions): void {
  const W = SOUL_CARD_WIDTH;
  const H = SOUL_CARD_HEIGHT;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const gold = "#c5a059";
  const ink = "#f2efe9";

  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, "#14131a");
  bgGrad.addColorStop(1, "#08070b");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // faint starfield
  let seedState = opts.kin * 9301 + 49297;
  const rand = () => {
    seedState = (seedState * 9301 + 49297) % 233280;
    return seedState / 233280;
  };
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 140; i++) {
    ctx.globalAlpha = 0.15 + rand() * 0.5;
    const r = 0.8 + rand() * 1.6;
    ctx.beginPath();
    ctx.arc(rand() * W, rand() * H, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

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

  ctx.fillStyle = "#b9b3a9";
  ctx.font = "300 28px 'Noto Serif TC', serif";
  ctx.fillText("全方位個人靈魂使用說明書", W / 2, 268);

  drawTotemEmblem(ctx, W / 2, 720, 260, opts.totemSeed, gold);

  ctx.fillStyle = gold;
  ctx.font = "500 44px 'Noto Serif TC', serif";
  ctx.fillText(`命數 ${opts.cardNumber}`, W / 2, 1080);

  ctx.fillStyle = ink;
  ctx.font = "400 96px 'Noto Serif TC', serif";
  ctx.fillText(opts.cardName, W / 2, 1180);

  ctx.fillStyle = "#d9d3c8";
  ctx.font = "300 34px 'Noto Serif TC', serif";
  ctx.fillText(`KIN ${opts.kin}．${opts.totem}`, W / 2, 1240);

  ctx.font = "300 38px 'Noto Sans TC', sans-serif";
  ctx.fillStyle = "#d9d3c8";
  const lines = wrapCjkText(ctx, opts.quote, 760);
  let ly = 1340;
  for (const line of lines) {
    ctx.fillText(line, W / 2, ly);
    ly += 56;
  }

  ctx.globalAlpha = 0.75;
  ctx.fillStyle = gold;
  ctx.font = "500 24px 'Noto Serif TC', serif";
  ctx.fillText("SOUL DECODE MANUAL", W / 2, H - margin - 60);
  ctx.globalAlpha = 1;
}

function fileStamp(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

/** Exports an already-drawn canvas to a downloaded PNG file, fully client-side. */
export async function downloadCanvasAsPng(canvas: HTMLCanvasElement, filenamePrefix = "aura-navi-soul-card"): Promise<void> {
  const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) return;

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filenamePrefix}-${fileStamp()}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
