// Runs on every Netlify Forms submission. For the "order" form it emails the
// customer (EN or TH) with a proof per item and a PromptPay QR for the exact total,
// and emails the owner the print files for each line.
//
// Environment variables:
//   PROMPTPAY_ID            Thai mobile number or 13-digit ID that receives payments
//   OWNER_EMAIL             where the owner copy goes (optional)
//   MAIL_FROM               e.g. "Tee Shop <orders@yourdomain>" (defaults to the SMTP user)
//   Gmail:  GMAIL_USER, GMAIL_APP_PASSWORD
//   Brevo:  BREVO_SMTP_USER, BREVO_SMTP_KEY   (used if set, instead of Gmail)
import nodemailer from "nodemailer";
import QRCode from "qrcode";
import { promptPayPayload } from "../lib/promptpay.mjs";
import { checkOrder, customerEmail, ownerEmail } from "../lib/order.mjs";

function transport() {
  const env = process.env;
  if (env.BREVO_SMTP_USER && env.BREVO_SMTP_KEY) {
    return { t: nodemailer.createTransport({ host: "smtp-relay.brevo.com", port: 587, auth: { user: env.BREVO_SMTP_USER, pass: env.BREVO_SMTP_KEY } }), from: env.MAIL_FROM || env.BREVO_SMTP_USER };
  }
  if (env.GMAIL_USER && env.GMAIL_APP_PASSWORD) {
    return { t: nodemailer.createTransport({ service: "gmail", auth: { user: env.GMAIL_USER, pass: env.GMAIL_APP_PASSWORD } }), from: env.MAIL_FROM || env.GMAIL_USER };
  }
  return null;
}

export default async (req) => {
  const { payload } = await req.json();
  if (payload?.form_name !== "order") return new Response("ignored");

  const order = checkOrder(payload.data || {});
  if (!order.lines.length) { console.log("Order with no valid lines", payload.data?.order_number); return new Response("no lines"); }

  const mail = transport();
  if (!mail) { console.log("No mail settings, order not emailed:", order.number); return new Response("no mail settings"); }
  const siteUrl = process.env.URL || "";

  const jobs = [];
  if (process.env.PROMPTPAY_ID && order.customer.email) {
    const qr = await QRCode.toBuffer(promptPayPayload(process.env.PROMPTPAY_ID, order.total), { type: "png", width: 480, margin: 2 });
    const { subject, html } = customerEmail(order, siteUrl);
    jobs.push(mail.t.sendMail({
      from: mail.from, to: order.customer.email, replyTo: process.env.OWNER_EMAIL || undefined, subject, html,
      attachments: [{ filename: `promptpay-${order.number}.png`, content: qr, cid: "promptpay-qr" }],
    }));
  } else {
    console.log("PROMPTPAY_ID or customer email missing, customer not emailed:", order.number);
  }
  if (process.env.OWNER_EMAIL) {
    const { subject, html } = ownerEmail(order, siteUrl);
    jobs.push(mail.t.sendMail({ from: mail.from, to: process.env.OWNER_EMAIL, replyTo: order.customer.email, subject, html }));
  }
  const results = await Promise.allSettled(jobs);
  results.filter((r) => r.status === "rejected").forEach((r) => console.error("Email failed:", r.reason?.message));
  return new Response("ok");
};
