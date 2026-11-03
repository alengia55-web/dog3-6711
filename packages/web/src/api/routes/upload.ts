import { z } from "zod";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { staffProcedure } from "../lib/guards";
import { s3, BUCKET } from "../lib/s3";
import { slugify } from "../lib/slug";

export const upload = {
  /**
   * Presigned PUT for a dog photo. The browser crops and resizes the image to
   * 1000x1250 JPEG before uploading, so only small files reach the bucket.
   */
  presign: staffProcedure
    .input(
      z.object({
        folder: z.string().min(1).max(60).default("dogs"),
        contentType: z.string().default("image/jpeg"),
      }),
    )
    .handler(async ({ input }) => {
      const folder = slugify(input.folder) || "dogs";
      const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
      const key = folder === "dogs" ? `dogs/${name}` : `dogs/${folder}/${name}`;

      const url = await getSignedUrl(
        s3,
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          ContentType: input.contentType,
        }),
        { expiresIn: 600 },
      );

      // Served back through /api/media/* so the public URL never expires.
      return { url, key, publicUrl: `/api/media/${key}` };
    }),
};
