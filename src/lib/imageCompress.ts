export type CompressOptions = {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0..1
  mimeType?: string; // image/jpeg or image/webp
};

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export async function compressImageFile(
  file: File,
  { maxWidth = 2000, maxHeight = 2000, quality = 0.85, mimeType = "image/jpeg" }: CompressOptions = {}
): Promise<File> {
  // Fast path: small files
  if (file.size <= 9_000_000) return file;

  const url = URL.createObjectURL(file);
  try {
    const img = await createImage(url);
    const ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
    const targetW = Math.round(img.width * ratio);
    const targetH = Math.round(img.height * ratio);

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, targetW, targetH);

    let q = quality;
    let blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, mimeType, q));
    // If still too big, reduce quality iteratively
    while (blob && blob.size > 9_000_000 && q > 0.4) {
      q -= 0.15;
      blob = await new Promise((resolve) => canvas.toBlob(resolve, mimeType, q));
    }
    if (!blob) return file;
    const ext = mimeType === "image/webp" ? "webp" : "jpg";
    return new File([blob], (file.name.replace(/\.[^.]+$/, "") || "image") + "." + ext, { type: mimeType });
  } finally {
    URL.revokeObjectURL(url);
  }
}


