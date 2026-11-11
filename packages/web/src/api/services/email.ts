/**
 * Notification email for form submissions.
 * Uses Resend when RESEND_API_KEY is set; otherwise it logs and reports back that
 * no email was sent (the submission is always stored in the database).
 */
import { eq } from "drizzle-orm";
import { db } from "../database";
import * as schema from "../database/schema";

const NOTIFY_TO = process.env.NOTIFY_EMAIL ?? "info@kinokomeiodimoumeteoron.gr";
const FROM = process.env.NOTIFY_FROM ?? "Κυνοκομείο Δήμου Μετεώρων <onboarding@resend.dev>";

export interface SendEmailOptions {
  subject: string;
  html: string;
  replyTo?: string;
  to?: string;
}

export async function sendNotification({
  subject,
  html,
  replyTo,
  to,
}: SendEmailOptions): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY missing — submission stored but not emailed:", subject);
    return { sent: false, error: "email_not_configured" };
  }

  try {
    const [contact] = await db.select().from(schema.settings).where(eq(schema.settings.key, "email")).limit(1);
    const recipient = to ?? (contact?.value.trim() || NOTIFY_TO);
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [recipient],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("[email] send failed", res.status, body);
      return { sent: false, error: `resend_${res.status}` };
    }
    return { sent: true };
  } catch (error) {
    console.error("[email] send threw", error);
    return { sent: false, error: "network_error" };
  }
}

/** Renders a label/value list as a simple HTML table for notification emails. */
export function renderRows(title: string, rows: Array<[string, string | undefined | null]>) {
  const escape = (value: string) => value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
  const body = rows
    .filter(([, value]) => value !== undefined && value !== null && `${value}`.trim() !== "")
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee;font-weight:600;vertical-align:top;white-space:nowrap">${escape(label)}</td><td style="padding:6px 12px;border-bottom:1px solid #eee">${escape(String(
          value,
        )).replace(/\n/g, "<br/>")}</td></tr>`,
    )
    .join("");
  return `<div style="font-family:system-ui,sans-serif;color:#131211">
    <h2 style="margin:0 0 12px">${escape(title)}</h2>
    <table style="border-collapse:collapse;font-size:14px;max-width:640px">${body}</table>
    <p style="margin-top:16px;font-size:12px;color:#777">Κυνοκομείο Δήμου Μετεώρων</p>
  </div>`;
}
