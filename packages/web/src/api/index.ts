import type { RouterClient } from "@orpc/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { createApp } from "./__core/app";
import { auth } from "./auth";
import { s3, BUCKET } from "./lib/s3";
import { ping } from "./routes/ping";
import { dogs } from "./routes/dogs";
import { applications } from "./routes/applications";
import { settings } from "./routes/settings";
import { staff } from "./routes/staff";
import { upload } from "./routes/upload";
import { stats } from "./routes/stats";

// API features are oRPC procedures, one file per feature in ./routes/,
// composed into this router — typed end-to-end via the clients
// (web: src/web/lib/api.ts, mobile: lib/api.ts).
// Keep each routes/ file under 500 lines (`bun run lint` enforces this);
// split into more feature files as they grow.
// Patterns and examples: skills/app/references/api.md
export const router = {
  ping,
  dogs,
  applications,
  settings,
  staff,
  upload,
  stats,
};

export type AppRouter = typeof router;
/** Typed client for the router — used by the web and mobile api clients. */
export type AppRouterClient = RouterClient<AppRouter>;

const app = createApp(router);

// Better Auth owns every /api/auth/* route (sign in, sign out, session).
app.on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw));

/**
 * Permanent public URL for a photo in object storage. Uploads are presigned
 * (routes/upload.ts) but presigned reads expire, so the site reads through
 * here instead and the stored URL never goes stale.
 */
app.get("/api/media/*", async (c) => {
  const key = decodeURIComponent(c.req.path.replace("/api/media/", ""));
  if (!key || key.includes("..")) return c.text("Not found", 404);
  try {
    const object = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
    if (!object.Body) return c.text("Not found", 404);
    return new Response(object.Body.transformToWebStream(), {
      headers: {
        "content-type": object.ContentType ?? "image/jpeg",
        "cache-control": "public, max-age=31536000, immutable",
        ...(object.ETag ? { etag: object.ETag } : {}),
      },
    });
  } catch {
    return c.text("Not found", 404);
  }
});

export default app;
