// GET /qr/promptpay/<amount>.png  ->  PromptPay QR for that exact amount in THB.
// Needs PROMPTPAY_ID (Thai mobile number or 13-digit national/tax ID).
import QRCode from "qrcode";
import { promptPayPayload } from "../lib/promptpay.mjs";

export default async (req, context) => {
  const id = process.env.PROMPTPAY_ID;
  if (!id) return new Response("PromptPay is not set up yet (PROMPTPAY_ID missing).", { status: 503 });

  const m = /^(\d{1,6}(?:\.\d{1,2})?)\.png$/.exec(context.params.file || "");
  const amount = m ? Number(m[1]) : NaN;
  if (!(amount > 0 && amount <= 100000)) return new Response("Bad amount", { status: 400 });

  const png = await QRCode.toBuffer(promptPayPayload(id, amount), { type: "png", width: 480, margin: 2, errorCorrectionLevel: "M" });
  return new Response(png, {
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" },
  });
};

export const config = { path: "/qr/promptpay/:file" };
