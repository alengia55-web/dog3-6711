/**
 * Notification email for form submissions.
 * Uses Resend when RESEND_API_KEY is set; otherwise it logs and reports back that
 * no email was sent (the submission is always stored in the database).
 */
const NOTIFY_TO = process.env.NOTIFY_EMAIL ?? "sarantiath@gmail.com";
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
  to = NOTIFY_TO,
}: SendEmailOptions): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY missing — submission stored but not emailed:", subject);
    return { sent: false, error: "email_not_configured" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [to],
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
  const body = rows
    .filter(([, value]) => value !== undefined && value !== null && `${value}`.trim() !== "")
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee;font-weight:600;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:6px 12px;border-bottom:1px solid #eee">${String(
          value,
        ).replace(/\n/g, "<br/>")}</td></tr>`,
    )
    .join("");
  return `<div style="font-family:system-ui,sans-serif;color:#131211">
    <h2 style="margin:0 0 12px">${title}</h2>
    <table style="border-collapse:collapse;font-size:14px;max-width:640px">${body}</table>
    <p style="margin-top:16px;font-size:12px;color:#777">Κυνοκομείο Δήμου Μετεώρων</p>
  </div>`;
}
