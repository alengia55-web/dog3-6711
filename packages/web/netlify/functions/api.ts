import app from "../../src/api";

/** Node-based Netlify adapter. The original /api path is preserved. */
export default async function handler(request: Request): Promise<Response> {
  const siteUrl = process.env.WEBSITE_URL;
  if (!siteUrl) {
    return Response.json({ error: "WEBSITE_URL is not configured" }, { status: 503 });
  }

  let siteOrigin: string;
  let pathname: string;
  try {
    siteOrigin = new URL(siteUrl).origin;
    pathname = decodeURIComponent(new URL(request.url).pathname).replace(/\/+/g, "/");
  } catch {
    return Response.json({ error: "Invalid URL configuration or request" }, { status: 400 });
  }

  // Better Auth's public HTTP signup must not bypass staff.register's invite code.
  // Internal auth.api.signUpEmail calls from that procedure remain available.
  if (/^\/api\/auth\/sign-up(?:\/|$)/.test(pathname)) {
    return Response.json({ error: "Use staff registration with an invite code" }, { status: 403 });
  }

  // The existing API uses reflected CORS; enforce the canonical site here.
  const origin = request.headers.get("origin");
  if (origin && origin !== siteOrigin) {
    return Response.json({ error: "Origin not allowed" }, { status: 403 });
  }

  try {
    return await app.fetch(request);
  } catch {
    console.error("[netlify-api] Request failed; inspect backend configuration.");
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const config = {
  path: ["/api", "/api/*"],
};