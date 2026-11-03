import { createAuthClient } from "better-auth/react";

/**
 * Staff authentication for the back office (email + password).
 * The site is previewed inside an iframe, where third-party cookies are often
 * blocked, so the session travels as a bearer token kept in localStorage.
 */
const TOKEN_KEY = "amores-perros-staff-token";

export function getAuthToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function storeToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* private mode — session simply stays in memory */
  }
}

export const authClient = createAuthClient({
  baseURL: window.location.origin,
  basePath: "/api/auth",
  fetchOptions: {
    auth: { type: "Bearer", token: () => getAuthToken() ?? "" },
    onSuccess: (ctx) => {
      const token = ctx.response.headers.get("set-auth-token");
      if (token) storeToken(token);
    },
  },
});

export async function signOutStaff() {
  try {
    await authClient.signOut();
  } catch {
    /* ignore — the local token is dropped either way */
  }
  storeToken(null);
}
