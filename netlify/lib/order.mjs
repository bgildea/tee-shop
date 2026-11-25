// Turns a Netlify "order" form submission into a checked order and the two emails.
import shop from "../../public/shop.json" with { type: "json" };

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = (n, lang) => (lang === "th" ? `${n.toLocaleString("th-TH")} บาท` : `฿${n.toLocaleString("en-US")}`);

// Never trust the browser's total: rebuild it from shop.json.
export function checkOrder(data) {
  let items = [];
  try { items = JSON.parse(data.items || "[]"); } catch { items = []; }
  const lines = [];
  for (const it of items) {
    const design = shop.designs.find((d) => d.id === it.id);
    const colour = shop.colours.find((c) => c.id === it.colour);
    const size = shop.sizes.find((s) => s.id === it.size);
    const qty = Math.max(0, Math.min(50, parseInt(it.qty, 10) || 0));
    if (design && colour && size && qty && (!design.colours || design.colours.includes(colour.id))) lines.push({ design, colour, size: size.id, qty });
  }
  const qty = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = qty * shop.pricePerTee;
  const delivery = qty === 0 || qty >= shop.freeDeliveryFrom ? 0 : shop.delivery;
  const total = subtotal + delivery;
  return {
    number: String(data.order_number || "").slice(0, 32),
    lang: data.lang === "th" ? "th" : "en",
    lines, qty, subtotal, delivery, total,
    clientTotal: Number(data.total),
    totalMismatch: Number(data.total) !== total,
    customer: {
      name: data.name, email: data.email, phone: data.phone,
      address: data.address, province: data.province, postcode: data.postcode, notes: data.notes,
    },
  };
}

const copy = {
  en: {
    subject: (n) => `Your order ${n}: pay by PromptPay to start printing`,
    hello: (name) => `Hi ${name},`,
    thanks: "Thanks for your order. Here's what you picked and the QR code to pay for it.",
    pay: (a) => `Scan this QR code with any Thai banking app to pay ${a}. The amount is already filled in.`,
    after: "As soon as the payment shows up, your tees go to print. Printing takes 7 to 10 working days, then we post them with tracking and they take another 3 to 5 working days to reach you.",
    print: (cm) => `print ${cm} cm wide`,
    tees: "Tees", delivery: "Delivery", free: "Free", total: "Total",
    sendTo: "We'll send it to",
    reply: (e) => `Questions? Reply to this email or write to ${e}.`,
  },
  th: {
    subject: (n) => `คำสั่งซื้อ ${n}: จ่ายด้วยพร้อมเพย์เพื่อเริ่มพิมพ์`,
    hello: (name) => `สวัสดีคุณ ${name}`,
    thanks: "ขอบคุณที่สั่งซื้อ นี่คือรายการที่คุณเลือกและ QR สำหรับจ่ายเงิน",
    pay: (a) => `สแกน QR นี้ด้วยแอปธนาคารเพื่อจ่าย ${a} ยอดเงินใส่ไว้ให้แล้ว`,
    after: "เมื่อได้รับเงินแล้ว เสื้อจะเข้าพิมพ์ทันที การพิมพ์ใช้เวลา 7 ถึง 10 วันทำการ จากนั้นเราจะส่งพร้อมเลขพัสดุ ใช้เวลาอีก 3 ถึง 5 วันทำการ",
    print: (cm) => `ลายกว้าง ${cm} ซม.`,
    tees: "ค่าเสื้อ", delivery: "ค่าส่ง", free: "ฟรี", total: "รวม",
    sendTo: "ที่อยู่จัดส่ง",
    reply: (e) => `มีคำถาม ตอบกลับอีเมลนี้หรือเขียนถึง ${e}`,
  },
};

const wrap = (inner) => `<!doctype html><html><body style="margin:0;background:#EEEFEA;font-family:Helvetica,Arial,sans-serif;color:#1F2A44">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" style="max-width:560px;background:#fff;border-radius:6px" cellpadding="0" cellspacing="0"><tr><td style="padding:28px">${inner}</td></tr></table>
</td></tr></table></body></html>`;

export function customerEmail(o, siteUrl) {
  const c = copy[o.lang];
  const nm = (d) => (o.lang === "th" ? d.nameTh : d.name);
  const cn = (x) => (o.lang === "th" ? x.nameTh : x.name);
  const rows = o.lines.map((l) => `<tr>
    <td style="padding:10px 0;border-bottom:1px solid #E3E4E0" width="120"><img src="${siteUrl}/mockups/${l.design.id}-${l.colour.id}.jpg" width="110" alt="" style="display:block;border-radius:4px"></td>
    <td style="padding:10px 12px;border-bottom:1px solid #E3E4E0"><strong>${esc(nm(l.design))}</strong><br><span style="color:#5B6273">${esc(cn(l.colour))}, ${l.size}, ${c.print(l.design.widthCm)}</span></td>
    <td style="padding:10px 0;border-bottom:1px solid #E3E4E0;text-align:right;white-space:nowrap">${l.qty} × ${money(shop.pricePerTee, o.lang)}</td></tr>`).join("");
  const html = wrap(`
    <p style="font-size:20px;font-weight:bold;margin:0 0 4px">${esc(o.number)}</p>
    <p style="margin:0 0 16px">${esc(c.hello(o.customer.name))}</p>
    <p style="margin:0 0 16px">${c.thanks}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px">
      <tr><td>${c.tees}</td><td align="right">${money(o.subtotal, o.lang)}</td></tr>
      <tr><td>${c.delivery}</td><td align="right">${o.delivery ? money(o.delivery, o.lang) : c.free}</td></tr>
      <tr><td style="font-weight:bold;padding-top:6px">${c.total}</td><td align="right" style="font-weight:bold;padding-top:6px">${money(o.total, o.lang)}</td></tr>
    </table>
    <p style="margin:24px 0 8px">${c.pay(money(o.total, o.lang))}</p>
    <img src="cid:promptpay-qr" width="240" height="240" alt="PromptPay QR" style="display:block;border:1px solid #E3E4E0;border-radius:4px">
    <p style="margin:16px 0">${c.after}</p>
    <p style="margin:0;color:#5B6273">${c.sendTo}:<br>${esc(o.customer.name)}<br>${esc(o.customer.address).replace(/\n/g, "<br>")}<br>${esc(o.customer.province)} ${esc(o.customer.postcode)}<br>${esc(o.customer.phone)}</p>
    <p style="margin:20px 0 0;color:#5B6273">${c.reply(esc(shop.brand.contactEmail))}</p>`);
  return { subject: c.subject(o.number), html };
}

// Owner copy: everything needed to forward the job to the printer.
export function ownerEmail(o, siteUrl) {
  const rows = o.lines.map((l) => {
    const n = `${l.design.id}-${l.colour.id}`;
    return `<li style="margin-bottom:10px"><strong>${l.qty} × ${esc(l.design.name)}</strong>, ${esc(l.colour.name)} shirt, size ${l.size}, left chest, print ${l.design.widthCm} cm wide<br>
      <a href="${siteUrl}/print/${n}.png">300 dpi PNG</a> / <a href="${siteUrl}/print/${n}.svg">SVG</a> / <a href="${siteUrl}/mockups/${n}.jpg">proof</a></li>`;
  }).join("");
  const warn = o.totalMismatch ? `<p style="color:#A3261B"><strong>Check this one:</strong> the browser sent a total of ${esc(o.clientTotal)} but the shop prices give ${o.total}. The customer was emailed a QR for ${o.total}.</p>` : "";
  const html = wrap(`
    <p style="font-size:20px;font-weight:bold;margin:0 0 12px">New order ${esc(o.number)}: ${money(o.total, "en")}</p>${warn}
    <ul style="padding-left:18px">${rows}</ul>
    <p>Tees ${money(o.subtotal, "en")}, delivery ${money(o.delivery, "en")}, total <strong>${money(o.total, "en")}</strong>. Customer language: ${o.lang.toUpperCase()}.</p>
    <p><strong>${esc(o.customer.name)}</strong><br>${esc(o.customer.email)}<br>${esc(o.customer.phone)}<br>${esc(o.customer.address).replace(/\n/g, "<br>")}<br>${esc(o.customer.province)} ${esc(o.customer.postcode)}</p>
    ${o.customer.notes ? `<p>Notes: ${esc(o.customer.notes)}</p>` : ""}`);
  return { subject: `New order ${o.number}: ${o.qty} tee${o.qty === 1 ? "" : "s"}, ${money(o.total, "en")}`, html };
}

export { shop };
