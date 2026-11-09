import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

const FILE_BASE = "loveflix-nosso-date";

export async function renderPng(node: HTMLElement): Promise<string> {
  // Primeira chamada "aquece" fontes/imagens (bug conhecido no Safari)
  await toPng(node, { pixelRatio: 1, cacheBust: true }).catch(() => null);
  return toPng(node, {
    pixelRatio: 3,
    cacheBust: true,
    backgroundColor: "#0b0507",
  });
}

export function pngToPdfBlob(dataUrl: string, width: number, height: number): Blob {
  const pdf = new jsPDF({
    orientation: height >= width ? "portrait" : "landscape",
    unit: "px",
    format: [width, height],
    hotfixes: ["px_scaling"],
    compress: true,
  });
  pdf.setProperties({ title: "Loveflix — nosso date", creator: "Loveflix" });
  pdf.addImage(dataUrl, "PNG", 0, 0, width, height, undefined, "FAST");
  return pdf.output("blob");
}

export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export interface ShareAssets {
  pdf: File;
  png: File;
}

export async function buildAssets(node: HTMLElement): Promise<ShareAssets> {
  const { width, height } = node.getBoundingClientRect();
  const png = await renderPng(node);
  const pdfBlob = pngToPdfBlob(png, Math.round(width), Math.round(height));
  const pngBlob = await dataUrlToBlob(png);
  return {
    pdf: new File([pdfBlob], `${FILE_BASE}.pdf`, { type: "application/pdf" }),
    png: new File([pngBlob], `${FILE_BASE}.png`, { type: "image/png" }),
  };
}

export type ShareOutcome = "shared" | "downloaded" | "cancelled";

/** Tenta abrir a folha de compartilhamento nativa (Instagram, WhatsApp...). */
export async function shareFile(file: File, text: string): Promise<ShareOutcome> {
  const data: ShareData = { files: [file], title: "Loveflix 💘", text };
  if (typeof navigator !== "undefined" && navigator.canShare?.(data)) {
    try {
      await navigator.share(data);
      return "shared";
    } catch (err) {
      if ((err as Error)?.name === "AbortError") return "cancelled";
    }
  }
  downloadBlob(file, file.name);
  return "downloaded";
}
