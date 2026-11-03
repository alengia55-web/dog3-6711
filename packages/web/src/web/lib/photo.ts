import { client } from "./api";

/** Card format used across the site — portrait, same as the original photos. */
const WIDTH = 1000;
const HEIGHT = 1250;
const QUALITY = 0.82;

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image"));
    };
    image.src = url;
  });
}

/**
 * Centre-crops and resizes any photo the staff pick to 1000x1250 JPEG, so the
 * cards stay aligned and the upload stays small — the same treatment the
 * original photos got by hand.
 */
export async function prepareDogPhoto(file: File): Promise<Blob> {
  const image = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not available");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const scale = Math.max(WIDTH / image.width, HEIGHT / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, (WIDTH - drawWidth) / 2, (HEIGHT - drawHeight) / 2, drawWidth, drawHeight);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", QUALITY),
  );
  if (!blob) throw new Error("Could not process that image");
  return blob;
}

/** Crops, uploads through a presigned PUT, and returns the permanent site URL. */
export async function uploadDogPhoto(file: File, folder: string) {
  const blob = await prepareDogPhoto(file);
  const { url, publicUrl } = await client.upload.presign({
    folder: folder || "dogs",
    contentType: "image/jpeg",
  });
  const response = await fetch(url, {
    method: "PUT",
    body: blob,
    headers: { "content-type": "image/jpeg" },
  });
  if (!response.ok) throw new Error(`Upload failed (${response.status})`);
  return publicUrl;
}
