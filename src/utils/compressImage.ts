type CompressOptions = {
  maxWidth?: number;
  maxHeight?: number;
  maxBytes?: number;
  mimeType?: "image/jpeg" | "image/webp";
};

const DEFAULT_OPTS: Required<CompressOptions> = {
  maxWidth: 1600,
  maxHeight: 1600,
  maxBytes: 220_000,
  mimeType: "image/jpeg",
};

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image file"));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Image compression failed"));
          return;
        }
        resolve(blob);
      },
      type,
      quality
    );
  });
}

/** Resize/compress photos so KYC uploads stay under typical nginx limits. */
export async function compressImageFile(file: File, options?: CompressOptions): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  const opts = { ...DEFAULT_OPTS, ...options };
  if (file.size <= opts.maxBytes && file.type === opts.mimeType) return file;

  const img = await loadImage(file);
  const scale = Math.min(1, opts.maxWidth / img.width, opts.maxHeight / img.height);
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(img, 0, 0, width, height);

  let quality = 0.88;
  let blob = await canvasToBlob(canvas, opts.mimeType, quality);

  while (blob.size > opts.maxBytes && quality > 0.45) {
    quality -= 0.08;
    blob = await canvasToBlob(canvas, opts.mimeType, quality);
  }

  const baseName = file.name.replace(/\.[^.]+$/, "") || "document";
  return new File([blob], `${baseName}.jpg`, { type: opts.mimeType, lastModified: Date.now() });
}

export async function compressKycFiles(files: {
  identityFront?: File;
  identityBack?: File;
  proofOfAddress?: File;
  selfieWithId?: File;
  portraitPhoto?: File;
}): Promise<typeof files> {
  const entries = await Promise.all(
    (Object.entries(files) as [keyof typeof files, File | undefined][]).map(async ([key, file]) => {
      if (!file) return [key, file] as const;
      const compressed = await compressImageFile(file);
      return [key, compressed] as const;
    })
  );
  return Object.fromEntries(entries) as typeof files;
}
