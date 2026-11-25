import { shirtSVG } from "/js/shirt.js";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- Copy ---------- */
// Thai copy is a first draft and needs a native speaker check before launch.
const T = {
  en: {
    skip: "Skip to the tees",
    preview: "Preview shop. Prices are placeholders and orders are not live yet.",
    navShop: "Tees", navSizes: "Sizes", navHelp: "Help", bag: "Bag",
    headline: "Small prints, close to the heart.",
    lede: "Small prints for the left side of your chest, on soft 100% cotton. Each tee is printed when you order it and sent anywhere in Thailand.",
    heroCta: "See the tees",
    priceFrom: (p) => `${p} a tee`,
    heroCap: "Mango sticky rice on a black tee. The print is 6 cm wide.",
    fact1: "Printed to order in Thailand",
    factDelivery: (n) => `Free delivery when you buy ${n} or more`,
    fact3: "Pay with any Thai banking app by PromptPay",
    shopH: "The tees",
    shopP: "Pick a print, then the shirt colour and size. Every design comes on black or white.",
    printWide: (cm) => `Print ${cm} cm wide`,
    on: (c) => `on ${c}`,
    sizesH: "Find your size",
    sizesP: "Lay a tee that fits you well flat on a table. Measure across the chest, armpit to armpit, and from the top of the shoulder to the hem. Pick the size closest to your numbers.",
    chest: "Chest", length: "Length", sizeCol: "Size", cm: "cm",
    sizeCaption: "Shirt measurements in centimetres, measured flat",
    sizeNote: "These are typical numbers for a 100% cotton tee. We'll replace them with exact measurements once our print partner's blanks are confirmed.",
    howH: "How ordering works",
    s1h: "Order", s1p: "Add tees to your bag and fill in where to send them. You get an order number straight away.",
    s2h: "Pay by PromptPay", s2p: "Scan the QR code on screen, or the one in your email, with any Thai banking app. The amount is already filled in.",
    s3h: "We print it", s3p: "Once the payment shows up, your tee goes to print. Printing takes 7 to 10 working days.",
    s4h: "It arrives", s4p: "We post it with tracking, and it takes another 3 to 5 working days to reach you. Allow about 3 weeks from order to door.",
    faqH: "Questions",
    q1: "Why only small prints?", a1: "A small print looks good with everything and doesn't crack across your chest after a few washes. We think it's the better tee.",
    q2: "How big is the print?", a2: "Each design lists its width. Most are 4.5 cm or 6 cm wide. Open a design to see it against a ruler.",
    q3: "What if it doesn't fit?", a3: "Each tee is printed for you, so we can't take back the wrong size. If it arrives damaged or misprinted, email us a photo within 7 days and we'll send a new one.",
    q4: "How do I wash it?", a4: "Inside out, cool water, no tumble dryer. Don't iron over the print.",
    q5: "Can I pay another way?", a5: "Not yet. PromptPay works with every Thai bank app, and card payments are coming later.",
    footLine: "Small prints, printed in Thailand.",
    contact: "Questions about an order?",
    close: "Close",
    colour: "Shirt colour", size: "Size", sizeGuide: "Size guide",
    add: "Add to bag", added: (n) => `Added. You have ${n} in your bag.`, pickSize: "Pick a size first.",
    scaleCap: (cm) => `The print is ${cm} cm wide, shown against a ruler at the same scale.`,
    bagTitle: "Your bag", empty: "Your bag is empty. Pick a tee to get started.",
    subtotal: "Tees", delivery: "Delivery", free: "Free", total: "Total",
    addOne: (n) => `Add ${n} more tee for free delivery.`, addMany: (n) => `Add ${n} more tees for free delivery.`,
    remove: "Remove one", addAnother: "Add one",
    sendTo: "Where should we send it?",
    fName: "Full name", fEmail: "Email", fEmailHelp: "We'll send your order and payment QR here.",
    fPhone: "Phone", fPhoneHelp: "For the delivery driver.", fAddress: "Address",
    fProvince: "Province", fPostcode: "Postcode", fNotes: "Notes (optional)",
    place: "Place order", placing: "Placing order…",
    failed: "The order didn't go through. Check your connection and press Place order again.",
    doneH: "Order placed", doneNum: "Your order number is",
    donePay: (a) => `Scan this QR code with your banking app to pay ${a}.`,
    doneNote: "We've also emailed you this QR code and your order details. Your tee goes to print as soon as the payment shows up.",
  },
  th: {
    skip: "ข้ามไปที่เสื้อ",
    preview: "ร้านตัวอย่าง ราคายังไม่ใช่ราคาจริง และยังไม่เปิดรับคำสั่งซื้อ",
    navShop: "เสื้อ", navSizes: "ไซซ์", navHelp: "ช่วยเหลือ", bag: "ตะกร้า",
    headline: "ลายเล็ก\nใกล้หัวใจ",
    lede: "ลายเล็กบนอกซ้าย บนเสื้อคอตตอน 100% เนื้อนุ่ม เราพิมพ์เสื้อทุกตัวหลังคุณสั่ง แล้วส่งให้ทั่วประเทศไทย",
    heroCta: "ดูเสื้อทั้งหมด",
    priceFrom: (p) => `ตัวละ ${p}`,
    heroCap: "ข้าวเหนียวมะม่วงบนเสื้อสีดำ ลายกว้าง 6 ซม.",
    fact1: "พิมพ์ตามสั่งในประเทศไทย",
    factDelivery: (n) => `ส่งฟรีเมื่อซื้อ ${n} ตัวขึ้นไป`,
    fact3: "จ่ายด้วยพร้อมเพย์ผ่านแอปธนาคารไหนก็ได้",
    shopH: "เสื้อทั้งหมด",
    shopP: "เลือกลาย แล้วเลือกสีเสื้อและไซซ์ ทุกลายมีเสื้อสีดำและสีขาว",
    printWide: (cm) => `ลายกว้าง ${cm} ซม.`,
    on: (c) => `เสื้อสี${c}`,
    sizesH: "เลือกไซซ์ที่ใช่",
    sizesP: "วางเสื้อตัวที่ใส่พอดีบนโต๊ะ วัดรอบอกจากรักแร้ถึงรักแร้ และวัดความยาวจากบ่าถึงชายเสื้อ แล้วเลือกไซซ์ที่ใกล้เคียงที่สุด",
    chest: "อก", length: "ยาว", sizeCol: "ไซซ์", cm: "ซม.",
    sizeCaption: "ขนาดเสื้อเป็นเซนติเมตร วัดแบบวางราบ",
    sizeNote: "ตัวเลขนี้เป็นขนาดทั่วไปของเสื้อคอตตอน 100% เราจะเปลี่ยนเป็นขนาดจริงเมื่อยืนยันเสื้อเปล่ากับโรงพิมพ์แล้ว",
    howH: "สั่งซื้ออย่างไร",
    s1h: "สั่งซื้อ", s1p: "ใส่เสื้อลงตะกร้าแล้วกรอกที่อยู่จัดส่ง คุณจะได้เลขคำสั่งซื้อทันที",
    s2h: "จ่ายด้วยพร้อมเพย์", s2p: "สแกน QR บนหน้าจอหรือในอีเมลด้วยแอปธนาคาร ยอดเงินใส่ไว้ให้แล้ว",
    s3h: "เราพิมพ์เสื้อ", s3p: "เมื่อได้รับเงินแล้ว เสื้อของคุณจะเข้าพิมพ์ การพิมพ์ใช้เวลา 7 ถึง 10 วันทำการ",
    s4h: "ได้รับเสื้อ", s4p: "เราส่งพร้อมเลขพัสดุ ใช้เวลาอีก 3 ถึง 5 วันทำการ รวมแล้วประมาณ 3 สัปดาห์นับจากวันสั่ง",
    faqH: "คำถามที่พบบ่อย",
    q1: "ทำไมมีแต่ลายเล็ก", a1: "ลายเล็กใส่กับอะไรก็เข้า และไม่แตกลายหลังซักไม่กี่ครั้ง เราคิดว่าแบบนี้คือเสื้อที่ดีกว่า",
    q2: "ลายใหญ่แค่ไหน", a2: "ทุกลายบอกความกว้างไว้ ส่วนใหญ่กว้าง 4.5 หรือ 6 ซม. เปิดดูแต่ละลายเพื่อเทียบกับไม้บรรทัด",
    q3: "ถ้าใส่ไม่พอดีทำอย่างไร", a3: "เสื้อทุกตัวพิมพ์ให้คุณโดยเฉพาะ เราจึงรับคืนกรณีเลือกไซซ์ผิดไม่ได้ ถ้าเสื้อเสียหายหรือพิมพ์ผิด ส่งรูปมาทางอีเมลภายใน 7 วัน เราจะส่งตัวใหม่ให้",
    q4: "ซักอย่างไร", a4: "กลับด้านเสื้อ ซักน้ำเย็น ไม่อบแห้ง และไม่รีดทับลาย",
    q5: "จ่ายทางอื่นได้ไหม", a5: "ตอนนี้ยังไม่ได้ พร้อมเพย์ใช้ได้กับแอปธนาคารทุกแห่ง และจะเพิ่มการจ่ายด้วยบัตรในภายหลัง",
    footLine: "ลายเล็ก พิมพ์ในประเทศไทย",
    contact: "มีคำถามเรื่องคำสั่งซื้อ",
    close: "ปิด",
    colour: "สีเสื้อ", size: "ไซซ์", sizeGuide: "ตารางไซซ์",
    add: "ใส่ตะกร้า", added: (n) => `เพิ่มแล้ว ตอนนี้มี ${n} ตัวในตะกร้า`, pickSize: "กรุณาเลือกไซซ์ก่อน",
    scaleCap: (cm) => `ลายกว้าง ${cm} ซม. เทียบกับไม้บรรทัดในสัดส่วนเดียวกัน`,
    bagTitle: "ตะกร้าของคุณ", empty: "ตะกร้ายังว่าง เลือกเสื้อได้เลย",
    subtotal: "ค่าเสื้อ", delivery: "ค่าส่ง", free: "ฟรี", total: "รวม",
    addOne: (n) => `เพิ่มอีก ${n} ตัวเพื่อส่งฟรี`, addMany: (n) => `เพิ่มอีก ${n} ตัวเพื่อส่งฟรี`,
    remove: "ลดหนึ่งตัว", addAnother: "เพิ่มหนึ่งตัว",
    sendTo: "ส่งไปที่ไหน",
    fName: "ชื่อ-นามสกุล", fEmail: "อีเมล", fEmailHelp: "เราจะส่งรายละเอียดคำสั่งซื้อและ QR สำหรับจ่ายเงินไปที่นี่",
    fPhone: "เบอร์โทร", fPhoneHelp: "สำหรับพนักงานส่งของ", fAddress: "ที่อยู่",
    fProvince: "จังหวัด", fPostcode: "รหัสไปรษณีย์", fNotes: "หมายเหตุ (ไม่บังคับ)",
    place: "ยืนยันคำสั่งซื้อ", placing: "กำลังส่งคำสั่งซื้อ…",
    failed: "ส่งคำสั่งซื้อไม่สำเร็จ ตรวจสอบอินเทอร์เน็ตแล้วกดยืนยันคำสั่งซื้ออีกครั้ง",
    doneH: "สั่งซื้อเรียบร้อย", doneNum: "เลขคำสั่งซื้อของคุณคือ",
    donePay: (a) => `สแกน QR นี้ด้วยแอปธนาคารเพื่อจ่าย ${a}`,
    doneNote: "เราส่ง QR และรายละเอียดคำสั่งซื้อไปทางอีเมลด้วย เสื้อจะเข้าพิมพ์ทันทีที่ได้รับเงิน",
  },
};

/* ---------- State ---------- */
let shop, prints = {};
let lang = "en";
let bag = [];
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const t = (k, ...a) => { const v = T[lang][k] ?? T.en[k]; return typeof v === "function" ? v(...a) : v; };
const money = (n) => (lang === "th" ? `${n.toLocaleString("th-TH")} บาท` : `฿${n.toLocaleString("en-US")}`);
const dname = (d) => (lang === "th" ? d.nameTh : d.name);
const cname = (c) => (lang === "th" ? c.nameTh : c.name);
const design = (id) => shop.designs.find((d) => d.id === id);
const colour = (id) => shop.colours.find((c) => c.id === id);

function totals() {
  const qty = bag.reduce((s, l) => s + l.qty, 0);
  const sub = qty * shop.pricePerTee;
  const del = qty === 0 || qty >= shop.freeDeliveryFrom ? 0 : shop.delivery;
  return { qty, sub, del, total: sub + del };
}

/* ---------- Rendering ---------- */
const TILE_VIEW = "900 330 760 950"; // 4:5 crop around the print
const shirt = (d, c, opts = {}) =>
  shirtSVG({ fabric: c.fabric, print: { svg: prints[`${d.id}-${c.id}`], widthCm: d.widthCm }, uid: `${d.id}-${c.id}-${opts.uid || "x"}`, title: `${dname(d)}, ${cname(c)}`, ...opts });

function applyLang() {
  document.documentElement.lang = lang;
  $$("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  $$("[data-i18n-aria]").forEach((el) => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
  $$("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
  $$("[data-brand]").forEach((el) => { el.textContent = lang === "th" ? shop.brand.nameTh : shop.brand.name; });
  $("#price-from").textContent = t("priceFrom", money(shop.pricePerTee));
  $("#fact-delivery").textContent = t("factDelivery", shop.freeDeliveryFrom);
  renderHero(); renderGrid(); renderSizes(); renderBag();
  if ($("#sheet").open) renderSheet();
}

function renderHero() {
  const d = design("mango-sticky-rice"), c = colour("black");
  $("#hero-shirt").innerHTML = shirt(d, c, { uid: "hero", annotate: true, cmLabel: t("cm"), viewBox: "280 270 1440 1080" });
}

const tileColour = {};
function renderGrid() {
  $("#grid").innerHTML = shop.designs.map((d) => {
    const c = colour(tileColour[d.id] || shop.colours[0].id);
    return `<li class="tile">
      <button type="button" data-open="${d.id}" aria-label="${dname(d)}, ${money(shop.pricePerTee)}">
        <div class="tile-img">${shirt(d, c, { uid: "tile", viewBox: TILE_VIEW })}</div>
        <div class="tile-meta"><div><div class="tile-name">${dname(d)}</div><div class="tile-size">${t("printWide", d.widthCm)}</div></div>
        <div class="tile-price">${money(shop.pricePerTee)}</div></div>
      </button>
      <div class="tile-swatches">${shop.colours.map((x) => `<button type="button" class="dot" style="background:${x.fabric}" data-tile="${d.id}" data-colour="${x.id}" aria-pressed="${x.id === c.id}" aria-label="${t("on", cname(x))}"></button>`).join("")}</div>
    </li>`;
  }).join("");
}

function renderSizes() {
  $("#size-table").innerHTML = `<caption class="sr">${t("sizeCaption")}</caption>
    <thead><tr><th scope="col">${t("sizeCol")}</th>${shop.sizes.map((s) => `<th scope="col">${s.id}</th>`).join("")}</tr></thead>
    <tbody>
      <tr><th scope="row">${t("chest")} (${t("cm")})</th>${shop.sizes.map((s) => `<td>${s.chest}</td>`).join("")}</tr>
      <tr><th scope="row">${t("length")} (${t("cm")})</th>${shop.sizes.map((s) => `<td>${s.length}</td>`).join("")}</tr>
    </tbody>`;
}

// The print above a centimetre ruler, both at one scale.
function scaleSVG(d) {
  const k = 30; // px per cm
  const pw = d.widthCm * k;
  const art = prints[`${d.id}-white`];
  const vb = art.match(/viewBox="([^"]+)"/)[1].split(" ").map(Number);
  const ph = pw * (vb[3] / vb[2]);
  const len = Math.ceil(d.widthCm) + 2; // ruler length in cm
  const x0 = 10, top = ph + 16, w = len * k;
  const inner = art.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  let ticks = "", nums = "";
  for (let mm = 0; mm <= len * 10; mm++) {
    const x = x0 + (mm * k) / 10, h = mm % 10 === 0 ? 16 : mm % 5 === 0 ? 11 : 6;
    ticks += `M${x} ${top}v${h}`;
    if (mm % 10 === 0) nums += `<text x="${x}" y="${top + 34}" text-anchor="middle">${mm / 10}</text>`;
  }
  return `<svg viewBox="0 0 ${w + x0 * 2 + 30} ${top + 44}" role="img" aria-label="${t("scaleCap", d.widthCm)}">
    <svg x="${x0}" y="0" width="${pw}" height="${ph}" viewBox="${vb.join(" ")}">${inner}</svg>
    <rect x="${x0 - 6}" y="${top}" width="${w + 12}" height="40" rx="3" fill="#fff" stroke="#C3C6C0"/>
    <path d="${ticks}" stroke="#1F2A44" stroke-width="1"/>
    <g fill="#5B6273" font-family="Bai Jamjuree, sans-serif" font-size="12" font-weight="500">${nums}
      <text x="${x0 + w + 14}" y="${top + 34}">${t("cm")}</text></g></svg>`;
}

const sel = { id: null, colour: "white", size: null };
function openSheet(id) {
  sel.id = id; sel.colour = tileColour[id] || shop.colours[0].id; sel.size = null;
  $("#sheet-msg").textContent = "";
  renderSheet();
  $("#sheet").showModal();
}
function renderSheet() {
  const d = design(sel.id), c = colour(sel.colour);
  $("#sheet-title").textContent = dname(d);
  $("#sheet-price").textContent = money(shop.pricePerTee);
  $("#sheet-blurb").textContent = lang === "th" ? d.blurbTh : d.blurb;
  $("#sheet-visual").innerHTML = shirt(d, c, { uid: "sheet", viewBox: "780 420 1020 930" });
  $("#sheet-colours").innerHTML = shop.colours.map((x) => `<button type="button" class="dot" style="background:${x.fabric}" data-pick-colour="${x.id}" aria-pressed="${x.id === c.id}" aria-label="${cname(x)}" title="${cname(x)}"></button>`).join("");
  $("#sheet-sizes").innerHTML = shop.sizes.map((s) => `<button type="button" data-pick-size="${s.id}" aria-pressed="${s.id === sel.size}">${s.id}</button>`).join("");
  $("#scale-cap").textContent = t("scaleCap", d.widthCm);
  $("#scale-svg").innerHTML = scaleSVG(d);
}

function renderBag() {
  const { qty, sub, del, total } = totals();
  const count = $("#bag-count");
  count.textContent = qty; count.classList.toggle("has", qty > 0);
  $("#empty").hidden = qty > 0;
  $("#checkout").hidden = qty === 0 || !$("#done").hidden;
  $("#lines").innerHTML = bag.map((l, i) => {
    const d = design(l.id), c = colour(l.colour);
    return `<li class="line">
      <div class="line-img">${shirt(d, c, { uid: `line${i}`, viewBox: TILE_VIEW })}</div>
      <div><div class="line-name">${dname(d)}</div><div class="line-sub">${cname(c)}, ${l.size}</div>
        <div class="qty"><button type="button" data-qty="${i}" data-step="-1" aria-label="${t("remove")}">−</button><span>${l.qty}</span><button type="button" data-qty="${i}" data-step="1" aria-label="${t("addAnother")}">+</button></div></div>
      <div class="line-price">${money(l.qty * shop.pricePerTee)}</div></li>`;
  }).join("");
  if (!qty) { $("#totals").innerHTML = ""; return; }
  const need = shop.freeDeliveryFrom - qty;
  $("#totals").innerHTML = `<dt>${t("subtotal")}</dt><dd>${money(sub)}</dd>
    <dt>${t("delivery")}</dt><dd>${del ? money(del) : t("free")}</dd>
    ${need > 0 ? `<p class="hint">${need === 1 ? t("addOne", need) : t("addMany", need)}</p>` : ""}
    <dt class="grand">${t("total")}</dt><dd class="grand">${money(total)}</dd>`;
}

/* ---------- Actions ---------- */
function save() { store.set("bag", bag); renderBag(); }

function addToBag() {
  if (!sel.size) { $("#sheet-msg").textContent = t("pickSize"); return; }
  const hit = bag.find((l) => l.id === sel.id && l.colour === sel.colour && l.size === sel.size);
  if (hit) hit.qty += 1; else bag.push({ id: sel.id, colour: sel.colour, size: sel.size, qty: 1 });
  save();
  $("#sheet-msg").textContent = t("added", totals().qty);
}

function orderNumber() {
  const d = new Date(Date.now() + 7 * 3600e3); // Bangkok date
  const ymd = d.toISOString().slice(2, 10).replaceAll("-", "");
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rand = [...crypto.getRandomValues(new Uint8Array(4))].map((b) => chars[b % chars.length]).join("");
  return `${shop.orderPrefix}-${ymd}-${rand}`;
}

async function placeOrder(e) {
  e.preventDefault();
  const form = e.currentTarget;
  if (!form.reportValidity()) return;
  const { total } = totals();
  const num = orderNumber();
  form.order_number.value = num;
  form.items.value = JSON.stringify(bag.map(({ id, colour, size, qty }) => ({ id, colour, size, qty })));
  form.total.value = total;
  form.lang.value = lang;
  const btn = $("#place-order");
  btn.disabled = true; btn.textContent = t("placing"); $("#form-msg").textContent = "";
  try {
    const res = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(new FormData(form)).toString() });
    if (!res.ok) throw new Error(res.status);
    $("#done-num").textContent = num;
    $("#done-pay").textContent = t("donePay", money(total));
    $("#done-qr").src = `/qr/promptpay/${total}.png`;
    $("#done-qr").alt = t("donePay", money(total));
    $("#done").hidden = false;
    bag = []; store.set("bag", bag); form.reset(); renderBag();
    $("#lines").innerHTML = ""; $("#totals").innerHTML = ""; $("#empty").hidden = true;
  } catch {
    $("#form-msg").textContent = t("failed");
  } finally {
    btn.disabled = false; btn.textContent = t("place");
  }
}

/* ---------- Boot ---------- */
async function boot() {
  shop = await (await fetch("/shop.json")).json();
  const names = shop.designs.flatMap((d) => shop.colours.map((c) => `${d.id}-${c.id}`));
  const files = await Promise.all(names.map((n) => fetch(`/print/${n}.svg`).then((r) => r.text())));
  names.forEach((n, i) => { prints[n] = files[i]; });

  bag = store.get("bag", []).filter((l) => design(l.id) && colour(l.colour));
  const saved = store.get("lang", null);
  lang = saved || ((navigator.language || "").toLowerCase().startsWith("th") ? "th" : "en");

  $("#preview").hidden = shop.pricesConfirmed;
  const link = $("#contact-link");
  link.href = `mailto:${shop.brand.contactEmail}`; link.textContent = shop.brand.contactEmail;

  applyLang();

  document.addEventListener("click", (e) => {
    const b = e.target.closest("button, a");
    if (!b) return;
    if (b.dataset.lang) { lang = b.dataset.lang; store.set("lang", lang); applyLang(); }
    else if (b.dataset.open) openSheet(b.dataset.open);
    else if (b.dataset.tile) { tileColour[b.dataset.tile] = b.dataset.colour; renderGrid(); $(`[data-tile="${b.dataset.tile}"][data-colour="${b.dataset.colour}"]`).focus(); }
    else if (b.dataset.pickColour) { sel.colour = b.dataset.pickColour; renderSheet(); $(`[data-pick-colour="${sel.colour}"]`).focus(); }
    else if (b.dataset.pickSize) { sel.size = b.dataset.pickSize; $("#sheet-msg").textContent = ""; renderSheet(); $(`[data-pick-size="${sel.size}"]`).focus(); }
    else if (b.dataset.qty) { const l = bag[+b.dataset.qty]; l.qty += +b.dataset.step; if (l.qty < 1) bag.splice(+b.dataset.qty, 1); save(); }
    else if (b.id === "size-guide-link") { $("#sheet").close(); }
  });
  $("#add-to-bag").addEventListener("click", addToBag);
  $("#open-bag").addEventListener("click", () => { $("#done").hidden = true; renderBag(); $("#bag").showModal(); });
  $("#checkout").addEventListener("submit", placeOrder);
  for (const dlg of ["#sheet", "#bag"]) $(dlg).addEventListener("click", (e) => { if (e.target === e.currentTarget) e.currentTarget.close(); });
}
boot();
