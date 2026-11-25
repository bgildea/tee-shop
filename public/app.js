import { shirtSVG } from "/js/shirt.js";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- Copy (Thai is a first draft: needs a native speaker check) ---------- */
const T = {
  en: {
    skip: "Skip to the tees",
    preview: "Preview shop. Prices are placeholders and orders are not live yet.",
    announce: (n) => [`Free delivery anywhere in Thailand when you buy ${n} or more`, "Every tee is printed to order in Thailand", "Pay in seconds with PromptPay"],
    navShop: "Shop all", navPlaces: "Shop by place", navSizes: "Sizes", navStory: "Our story", navHelp: "Help", bag: "Bag",
    headline: "Drawn from real places in Thailand.",
    lede: "Mountains in the north, limestone in the south, Bangkok in between. Line-art tees on soft 100% cotton, printed when you order.",
    heroShop: "Shop the tees", heroPlaces: "Shop by place",
    f1h: "Printed to order", f1p: "in Thailand, no warehouse of unsold stock",
    f2h: (n) => `Free delivery from ${n} tees`, f2p: "anywhere in Thailand, with tracking",
    f3h: "Pay by PromptPay", f3p: "from any Thai banking app",
    f4h: "Sizes S to 3XL", f4p: "with a height and weight guide",
    placesH: "Shop by place", placesP: "Every design starts with somewhere real. Pick a corner of the country.",
    shopH: "The tees", all: "All",
    tee: (name) => `${name} T-Shirt`, teeColour: (c) => `, ${c}`,
    best: "Best seller", newB: "New",
    pressTag: "Hot off the press", pressBtn: "See the tee",
    storiesH: "Every tee has a place behind it", storyLink: (n) => `Shop ${n}`,
    pillarsH: "How we make them",
    p1h: "Drawn from real places", p1p: "Each design is a spot you can visit: a summit, a beach, a park bench in Bangkok. No generic sunsets.",
    p2h: "Printed when you order", p2p: "Nothing sits in a warehouse. Your tee is printed for you, which is why it takes a little longer.",
    p3h: "Made in Thailand", p3p: "Designed in Bangkok and printed by a Thai print partner on 100% cotton.",
    sizesH: "Find your size", sizesP: "Start with your height and weight. If you are between sizes, or like a looser fit, go one up.",
    height: "Height", weight: "Weight", chest: "Chest, flat", length: "Length", cm: "cm", kg: "kg", sizeCol: "Size",
    sizeHow: "Measuring a tee you already own works best: lay it flat, measure across the chest from armpit to armpit, and from the top of the shoulder to the hem.",
    sizeNote: "Height and weight ranges are a guide for a regular fit. Shirt measurements are typical for a 100% cotton tee and will be updated with our print partner's exact blanks.",
    howH: "How ordering works",
    s1h: "Order", s1p: "Add tees to your bag and tell us where to send them. You get an order number straight away.",
    s2h: "Pay by PromptPay", s2p: "Scan the QR code on screen, or the one in your email, with any Thai banking app. The amount is already filled in.",
    s3h: "We print it", s3p: "Once the payment shows up, your tee goes to print. Printing takes 7 to 10 working days.",
    s4h: "It arrives", s4p: "We post it with tracking, and it takes another 3 to 5 working days to reach you. Allow about 3 weeks from order to door.",
    faqH: "Questions",
    q1: "What are the tees made of?", a1: "100% cotton, regular fit, crew neck. The designs are printed straight onto the fabric, so they stay soft.",
    q2: "How big is the print?", a2: "Front prints are 25 to 28 cm wide, across the chest. Small chest prints are about 9 cm. Each tee lists its exact size and shows it against a ruler.",
    q3: "What if it doesn't fit?", a3: "Each tee is printed for you, so we can't take back the wrong size. If it arrives damaged or misprinted, email us a photo within 7 days and we'll send a new one.",
    q4: "How do I wash it?", a4: "Inside out, cool water, no tumble dryer. Don't iron over the print.",
    q5: "Can I pay another way?", a5: "Not yet. PromptPay works with every Thai bank app, and card payments are coming later.",
    signupH: "New places, first", signupP: "One short email when a new design is out. Nothing else.",
    emailPh: "Your email", signupBtn: "Sign up", signedUp: "You're on the list.", signupFail: "That didn't go through. Try again in a moment.",
    footLine: "Line-art tees drawn from real places in Thailand.", footShop: "Shop", footHelp: "Help", footFaq: "Questions and returns", footPay: "We accept",
    close: "Close", colour: "Colour", size: "Size", sizeGuide: "Size guide",
    sizeFits: (h, w) => `Fits most people ${h} cm tall and ${w} kg.`,
    add: "Add to bag", added: (n) => `Added. You have ${n} in your bag.`, pickSize: "Pick a size first.",
    dFront: (cm) => `Front print, ${cm} cm wide`, dChest: (cm) => `Small chest print, ${cm} cm wide, on the left side`,
    dCotton: "100% cotton, regular fit, crew neck", dPrinted: "Printed to order in Thailand, ready to post in 7 to 10 working days",
    scaleCap: (cm) => `The print is ${cm} cm wide, shown against a ruler at the same scale.`,
    viewFlat: "Whole tee", viewClose: "Close-up of the print",
    bagTitle: "Your bag", empty: "Your bag is empty. Pick a tee to get started.",
    subtotal: "Tees", delivery: "Delivery", free: "Free", total: "Total",
    addMore: (n) => (n === 1 ? "Add 1 more tee for free delivery." : `Add ${n} more tees for free delivery.`),
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
    announce: (n) => [`ส่งฟรีทั่วประเทศเมื่อซื้อ ${n} ตัวขึ้นไป`, "เสื้อทุกตัวพิมพ์ตามสั่งในประเทศไทย", "จ่ายง่ายด้วยพร้อมเพย์"],
    navShop: "เสื้อทั้งหมด", navPlaces: "เลือกตามสถานที่", navSizes: "ไซซ์", navStory: "เรื่องของเรา", navHelp: "ช่วยเหลือ", bag: "ตะกร้า",
    headline: "วาดจากสถานที่จริง\nในเมืองไทย",
    lede: "ภูเขาทางเหนือ หินปูนทางใต้ และกรุงเทพฯ ตรงกลาง เสื้อลายเส้นบนผ้าคอตตอน 100% เนื้อนุ่ม พิมพ์เมื่อคุณสั่ง",
    heroShop: "ดูเสื้อทั้งหมด", heroPlaces: "เลือกตามสถานที่",
    f1h: "พิมพ์ตามสั่ง", f1p: "ในประเทศไทย ไม่มีของค้างสต็อก",
    f2h: (n) => `ส่งฟรีเมื่อซื้อ ${n} ตัว`, f2p: "ทั่วประเทศ พร้อมเลขพัสดุ",
    f3h: "จ่ายด้วยพร้อมเพย์", f3p: "ผ่านแอปธนาคารไหนก็ได้",
    f4h: "ไซซ์ S ถึง 3XL", f4p: "พร้อมตารางเทียบส่วนสูงและน้ำหนัก",
    placesH: "เลือกตามสถานที่", placesP: "ทุกลายเริ่มจากสถานที่จริง เลือกมุมไหนของประเทศก็ได้",
    shopH: "เสื้อทั้งหมด", all: "ทั้งหมด",
    tee: (name) => `เสื้อยืด ${name}`, teeColour: (c) => ` สี${c}`,
    best: "ขายดี", newB: "ใหม่",
    pressTag: "มาใหม่ล่าสุด", pressBtn: "ดูเสื้อตัวนี้",
    storiesH: "เสื้อทุกตัวมีสถานที่อยู่เบื้องหลัง", storyLink: (n) => `ดูเสื้อ ${n}`,
    pillarsH: "เราทำเสื้ออย่างไร",
    p1h: "วาดจากสถานที่จริง", p1p: "ทุกลายคือที่ที่คุณไปได้จริง ยอดดอย ชายหาด หรือม้านั่งในสวนกลางกรุง ไม่ใช่พระอาทิตย์ตกทั่วไป",
    p2h: "พิมพ์เมื่อคุณสั่ง", p2p: "ไม่มีเสื้อกองในโกดัง เสื้อของคุณพิมพ์ให้คุณโดยเฉพาะ จึงใช้เวลานานขึ้นนิดหน่อย",
    p3h: "ผลิตในประเทศไทย", p3p: "ออกแบบในกรุงเทพฯ และพิมพ์โดยโรงพิมพ์ไทยบนผ้าคอตตอน 100%",
    sizesH: "เลือกไซซ์ที่ใช่", sizesP: "เริ่มจากส่วนสูงและน้ำหนัก ถ้าอยู่ระหว่างสองไซซ์ หรือชอบใส่หลวม ให้เลือกไซซ์ใหญ่ขึ้น",
    height: "ส่วนสูง", weight: "น้ำหนัก", chest: "อก (วางราบ)", length: "ความยาว", cm: "ซม.", kg: "กก.", sizeCol: "ไซซ์",
    sizeHow: "วิธีที่ดีที่สุดคือวัดเสื้อตัวที่ใส่พอดี วางราบ วัดอกจากรักแร้ถึงรักแร้ และวัดความยาวจากบ่าถึงชายเสื้อ",
    sizeNote: "ช่วงส่วนสูงและน้ำหนักเป็นแนวทางสำหรับทรงปกติ ขนาดเสื้อเป็นค่าทั่วไปของเสื้อคอตตอน 100% และจะอัปเดตเมื่อยืนยันเสื้อเปล่ากับโรงพิมพ์แล้ว",
    howH: "สั่งซื้ออย่างไร",
    s1h: "สั่งซื้อ", s1p: "ใส่เสื้อลงตะกร้าแล้วกรอกที่อยู่จัดส่ง คุณจะได้เลขคำสั่งซื้อทันที",
    s2h: "จ่ายด้วยพร้อมเพย์", s2p: "สแกน QR บนหน้าจอหรือในอีเมลด้วยแอปธนาคาร ยอดเงินใส่ไว้ให้แล้ว",
    s3h: "เราพิมพ์เสื้อ", s3p: "เมื่อได้รับเงินแล้ว เสื้อของคุณจะเข้าพิมพ์ การพิมพ์ใช้เวลา 7 ถึง 10 วันทำการ",
    s4h: "ได้รับเสื้อ", s4p: "เราส่งพร้อมเลขพัสดุ ใช้เวลาอีก 3 ถึง 5 วันทำการ รวมแล้วประมาณ 3 สัปดาห์นับจากวันสั่ง",
    faqH: "คำถามที่พบบ่อย",
    q1: "เสื้อทำจากผ้าอะไร", a1: "คอตตอน 100% ทรงปกติ คอกลม ลายพิมพ์ลงบนเนื้อผ้าโดยตรงจึงยังนุ่มอยู่",
    q2: "ลายใหญ่แค่ไหน", a2: "ลายหน้าอกเต็มกว้าง 25 ถึง 28 ซม. ลายเล็กบนอกประมาณ 9 ซม. ทุกตัวบอกขนาดจริงและเทียบกับไม้บรรทัดให้ดู",
    q3: "ถ้าใส่ไม่พอดีทำอย่างไร", a3: "เสื้อทุกตัวพิมพ์ให้คุณโดยเฉพาะ เราจึงรับคืนกรณีเลือกไซซ์ผิดไม่ได้ ถ้าเสื้อเสียหายหรือพิมพ์ผิด ส่งรูปมาทางอีเมลภายใน 7 วัน เราจะส่งตัวใหม่ให้",
    q4: "ซักอย่างไร", a4: "กลับด้านเสื้อ ซักน้ำเย็น ไม่อบแห้ง และไม่รีดทับลาย",
    q5: "จ่ายทางอื่นได้ไหม", a5: "ตอนนี้ยังไม่ได้ พร้อมเพย์ใช้ได้กับแอปธนาคารทุกแห่ง และจะเพิ่มการจ่ายด้วยบัตรในภายหลัง",
    signupH: "รู้ก่อนเมื่อมีลายใหม่", signupP: "อีเมลสั้นๆ หนึ่งฉบับเมื่อมีลายใหม่ ไม่มีอย่างอื่น",
    emailPh: "อีเมลของคุณ", signupBtn: "สมัคร", signedUp: "สมัครเรียบร้อยแล้ว", signupFail: "สมัครไม่สำเร็จ ลองใหม่อีกครั้ง",
    footLine: "เสื้อลายเส้นที่วาดจากสถานที่จริงในเมืองไทย", footShop: "ร้านค้า", footHelp: "ช่วยเหลือ", footFaq: "คำถามและการคืนสินค้า", footPay: "ช่องทางชำระเงิน",
    close: "ปิด", colour: "สี", size: "ไซซ์", sizeGuide: "ตารางไซซ์",
    sizeFits: (h, w) => `เหมาะกับคนสูง ${h} ซม. น้ำหนัก ${w} กก.`,
    add: "ใส่ตะกร้า", added: (n) => `เพิ่มแล้ว ตอนนี้มี ${n} ตัวในตะกร้า`, pickSize: "กรุณาเลือกไซซ์ก่อน",
    dFront: (cm) => `ลายหน้าอก กว้าง ${cm} ซม.`, dChest: (cm) => `ลายเล็กบนอกซ้าย กว้าง ${cm} ซม.`,
    dCotton: "คอตตอน 100% ทรงปกติ คอกลม", dPrinted: "พิมพ์ตามสั่งในประเทศไทย พร้อมส่งใน 7 ถึง 10 วันทำการ",
    scaleCap: (cm) => `ลายกว้าง ${cm} ซม. เทียบกับไม้บรรทัดในสัดส่วนเดียวกัน`,
    viewFlat: "เสื้อทั้งตัว", viewClose: "ภาพใกล้ของลาย",
    bagTitle: "ตะกร้าของคุณ", empty: "ตะกร้ายังว่าง เลือกเสื้อได้เลย",
    subtotal: "ค่าเสื้อ", delivery: "ค่าส่ง", free: "ฟรี", total: "รวม",
    addMore: (n) => `เพิ่มอีก ${n} ตัวเพื่อส่งฟรี`,
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
let shop, prints = {}, lang = "en", bag = [], filter = "all";
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const t = (k, ...a) => { const v = T[lang][k] ?? T.en[k]; return typeof v === "function" ? v(...a) : v; };
const money = (n) => (lang === "th" ? `${n.toLocaleString("th-TH")} บาท` : `฿${n.toLocaleString("en-US")}`);
const L = (o, key = "name") => (lang === "th" ? o[key + "Th"] || o[key] : o[key]);
const design = (id) => shop.designs.find((d) => d.id === id);
const colour = (id) => shop.colours.find((c) => c.id === id);
const coll = (id) => shop.collections.find((c) => c.id === id);
const backdrop = (d) => coll(d.collections[0]).backdrop;
const teeName = (d, c) => t("tee", L(d)) + (c ? t("teeColour", L(c)) : "");

function totals() {
  const qty = bag.reduce((s, l) => s + l.qty, 0);
  const sub = qty * shop.pricePerTee;
  const del = qty === 0 || qty >= shop.freeDeliveryFrom ? 0 : shop.delivery;
  return { qty, sub, del, total: sub + del };
}

let uidN = 0;
function shirt(d, cId, opts = {}) {
  const c = colour(cId);
  return shirtSVG({
    fabric: c.fabric, uid: `u${++uidN}`, backdrop: opts.backdrop || backdrop(d), view: opts.view || "flat",
    title: teeName(d, c), print: { svg: prints[`${d.id}-${c.id}`], widthCm: d.widthCm, placement: d.placement },
  });
}
const lightColour = (d) => d.colours.find((c) => ["white", "sand"].includes(c)) || d.colours[0];
const artInline = (d) => {
  const svg = prints[`${d.id}-${lightColour(d)}`];
  return svg.replace(/width="[^"]+" height="[^"]+"/, "").replace(/id="clip-/g, `id="clip-a${++uidN}-`).replace(/url\(#clip-/g, `url(#clip-a${uidN}-`);
};

/* ---------- Rendering ---------- */
let announceTimer;
function renderAnnounce() {
  const msgs = t("announce", shop.freeDeliveryFrom);
  let i = 0;
  const el = $("#announce");
  el.textContent = msgs[0];
  clearInterval(announceTimer);
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  announceTimer = setInterval(() => {
    i = (i + 1) % msgs.length;
    el.style.opacity = 0;
    setTimeout(() => { el.textContent = msgs[i]; el.style.opacity = 1; }, 300);
  }, 4500);
}

function renderStatic() {
  document.documentElement.lang = lang;
  $$("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  $$("[data-i18n-aria]").forEach((el) => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
  $$("[data-i18n-ph]").forEach((el) => el.setAttribute("placeholder", t(el.dataset.i18nPh)));
  $$("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
  $$("[data-brand]").forEach((el) => { el.textContent = L(shop.brand); });
  $(".hero h1").style.whiteSpace = lang === "th" ? "pre-line" : "";
  $("#f2h").textContent = t("f2h", shop.freeDeliveryFrom);
}

function renderPlaces() {
  const reps = { north: "doi-inthanon", bangkok: "bangkok-skyline", islands: "railay", wildlife: "similan-turtle" };
  $("#places-menu").innerHTML = shop.collections.map((c) => `<li><a href="#shop" data-filter="${c.id}">${L(c)}<small>${L(c, "blurb")}</small></a></li>`).join("");
  $("#place-grid").innerHTML = shop.collections.map((c) => `<li class="place-card"><a href="#shop" data-filter="${c.id}">
      <div class="place-art" style="background:${c.backdrop}">${artInline(design(reps[c.id]))}</div>
      <div class="place-text"><h3>${L(c)}</h3><p>${L(c, "blurb")}</p></div></a></li>`).join("");
  $("#foot-places").innerHTML = shop.collections.map((c) => `<li><a href="#shop" data-filter="${c.id}">${L(c)}</a></li>`).join("");
}

const cardColour = {};
function renderGrid() {
  $("#chips").innerHTML = [{ id: "all" }, ...shop.collections].map((c) =>
    `<button type="button" data-chip="${c.id}" aria-pressed="${filter === c.id}">${c.id === "all" ? t("all") : L(c)}</button>`).join("");
  const list = shop.designs.filter((d) => filter === "all" || d.collections.includes(filter));
  $("#grid").innerHTML = list.map((d) => {
    const cId = cardColour[d.id] || d.colours[0];
    const c = colour(cId);
    const badge = d.badge ? `<span class="badge ${d.badge === "new" ? "new" : ""}">${t(d.badge === "new" ? "newB" : "best")}</span>` : "";
    return `<li class="card">
      <button type="button" data-open="${d.id}" data-colour="${cId}">
        <div class="card-img">${badge}<div class="v">${shirt(d, cId)}</div><div class="v v2">${shirt(d, cId, { view: "close" })}</div></div>
        <p class="card-name">${t("tee", L(d))}<span>${t("teeColour", L(c))}</span></p>
        <p class="card-price">${money(shop.pricePerTee)}</p>
      </button>
      <div class="card-swatches">${d.colours.map((x) => `<button type="button" class="dot" style="background:${colour(x).fabric}" data-card="${d.id}" data-swatch="${x}" aria-pressed="${x === cId}" aria-label="${L(colour(x))}"></button>`).join("")}</div>
    </li>`;
  }).join("");
}

function renderPress() {
  const d = shop.designs.find((x) => x.badge === "new" && x.story) || shop.designs[0];
  const [a, b] = [d.colours[0], d.colours[1] || d.colours[0]];
  $("#press").innerHTML = `<div class="press-in">
    <div class="press-imgs"><div>${shirt(d, a)}</div><div>${shirt(d, a, { view: "close" })}</div><div>${shirt(d, b)}</div></div>
    <div class="press-copy"><span class="press-tag">${t("pressTag")}</span>
      <h2 id="press-h">${L(d)}</h2><p>${L(d, "story") || L(d, "blurb")}</p>
      <button type="button" class="btn" data-open="${d.id}" data-colour="${a}">${t("pressBtn")}</button></div></div>`;
}

function renderStories() {
  const list = shop.designs.filter((d) => d.story && d.badge !== "new").slice(0, 2);
  $("#story-list").innerHTML = list.map((d) => `<article class="story">
    <div class="story-img">${shirt(d, d.colours[0])}</div>
    <div class="story-text"><h3>${L(d)}</h3><blockquote>${L(d, "story")}</blockquote>
      <a href="#" class="small-link" data-open-link="${d.id}">${t("storyLink", L(d))}</a></div></article>`).join("");
}

function renderHero() {
  const d = design("doi-inthanon");
  $("#hero-tee").innerHTML = shirt(d, "black", { backdrop: "#D8CFBF" });
  $("#hero-tee").setAttribute("aria-label", teeName(d, colour("black")));
}

// Six figures drawn to scale with the size they would wear.
function renderPeople() {
  const sizes = shop.sizes;
  const k = 1.5; // px per cm of height
  const baseY = 320, gap = 140;
  const figs = sizes.map((s, i) => {
    const [lo, hi] = s.height.split("–").map(Number);
    const h = ((lo + hi) / 2) * k;
    const [wlo, whi] = s.weight.split("–").map(Number);
    const girth = 0.75 + ((wlo + whi) / 2 - 50) / 120; // wider for heavier
    const x = 70 + i * gap, top = baseY - h;
    const headR = h * 0.065, shoulder = 26 * girth, hip = 20 * girth;
    const neckY = top + headR * 2.2, waistY = top + h * 0.52, legY = baseY;
    return `<g>
      <circle cx="${x}" cy="${top + headR}" r="${headR}" fill="#BDB5A6"/>
      <path d="M${x - shoulder - 9} ${neckY + 42}L${x - shoulder - 13} ${waistY + 22}M${x + shoulder + 9} ${neckY + 42}L${x + shoulder + 13} ${waistY + 22}" stroke="#BDB5A6" stroke-width="${7 * Math.min(girth, 1.15)}" stroke-linecap="round"/>
      <path d="M${x - hip + 1} ${waistY}L${x - hip + 2} ${legY}H${x - 2}L${x} ${waistY + 26}L${x + 2} ${legY}H${x + hip - 2}L${x + hip - 1} ${waistY}Z" fill="#8E877A"/>
      <path d="M${x - shoulder} ${neckY + 6}L${x - shoulder - 14} ${neckY + 40}L${x - shoulder - 4} ${neckY + 46}L${x - hip} ${neckY + 30}L${x - hip} ${waistY + 8}H${x + hip}L${x + hip} ${neckY + 30}L${x + shoulder + 4} ${neckY + 46}L${x + shoulder + 14} ${neckY + 40}L${x + shoulder} ${neckY + 6}C${x + 10} ${neckY} ${x - 10} ${neckY} ${x - shoulder} ${neckY + 6}Z" fill="${i % 2 ? "#2E4537" : "#1F1F21"}"/>
      <text x="${x}" y="${baseY + 34}" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="600" font-size="24" fill="#1E1E1F">${s.id}</text>
      <text x="${x}" y="${baseY + 56}" text-anchor="middle" font-size="13" fill="#615C53">${s.height} ${t("cm")}</text>
      <text x="${x}" y="${baseY + 74}" text-anchor="middle" font-size="13" fill="#615C53">${s.weight} ${t("kg")}</text>
    </g>`;
  }).join("");
  $("#people").innerHTML = `<svg viewBox="0 0 ${70 * 2 + gap * (sizes.length - 1)} ${baseY + 84}" font-family="Bai Jamjuree, sans-serif">
    <path d="M10 ${baseY}H${60 * 2 + gap * (sizes.length - 1) + 10}" stroke="#DED8CC" stroke-width="2"/>${figs}</svg>`;
}

function renderSizeTable() {
  const row = (label, fn) => `<tr><th scope="row">${label}</th>${shop.sizes.map((s) => `<td>${fn(s)}</td>`).join("")}</tr>`;
  $("#size-table").innerHTML = `<caption class="sr">${t("sizesH")}</caption>
    <thead><tr><th scope="col">${t("sizeCol")}</th>${shop.sizes.map((s) => `<th scope="col">${s.id}</th>`).join("")}</tr></thead>
    <tbody>
      ${row(`${t("height")} (${t("cm")})`, (s) => s.height)}
      ${row(`${t("weight")} (${t("kg")})`, (s) => s.weight)}
      ${row(`${t("chest")} (${t("cm")})`, (s) => s.chest)}
      ${row(`${t("length")} (${t("cm")})`, (s) => s.length)}
    </tbody>`;
}

// Print above a centimetre ruler, both at one scale.
function scaleSVG(d) {
  const k = d.widthCm > 12 ? 12 : 26;
  const art = prints[`${d.id}-${lightColour(d)}`];
  const vb = art.match(/viewBox="([^"]+)"/)[1].split(" ").map(Number);
  const pw = d.widthCm * k, ph = pw * (vb[3] / vb[2]);
  const len = Math.ceil(d.widthCm) + 2, x0 = 10, top = ph + 14, w = len * k;
  const inner = art.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").replace(/id="clip-/g, `id="clip-s${++uidN}-`).replace(/url\(#clip-/g, `url(#clip-s${uidN}-`);
  let ticks = "", nums = "";
  const step = d.widthCm > 12 ? 5 : 1;
  for (let mm = 0; mm <= len * 10; mm++) {
    const x = x0 + (mm * k) / 10;
    if (d.widthCm > 12 && mm % 5) continue;
    const h = mm % 10 === 0 ? 14 : 8;
    ticks += `M${x} ${top}v${h}`;
    if (mm % (10 * step) === 0) nums += `<text x="${x}" y="${top + 30}" text-anchor="middle">${mm / 10}</text>`;
  }
  return `<svg viewBox="0 0 ${w + x0 * 2 + 30} ${top + 40}" role="img" aria-label="${t("scaleCap", d.widthCm)}">
    <svg x="${x0}" y="0" width="${pw}" height="${ph}" viewBox="${vb.join(" ")}">${inner}</svg>
    <rect x="${x0 - 6}" y="${top}" width="${w + 12}" height="36" rx="3" fill="#fff" stroke="#CBC4B6"/>
    <path d="${ticks}" stroke="#1E1E1F" stroke-width="1"/>
    <g fill="#615C53" font-family="Bai Jamjuree, sans-serif" font-size="11" font-weight="500">${nums}<text x="${x0 + w + 12}" y="${top + 30}">${t("cm")}</text></g></svg>`;
}

const sel = { id: null, colour: null, size: null, view: "flat" };
function openSheet(id, cId) {
  const d = design(id);
  Object.assign(sel, { id, colour: cId && d.colours.includes(cId) ? cId : d.colours[0], size: null, view: "flat" });
  $("#sheet-msg").textContent = "";
  renderSheet();
  if (!$("#sheet").open) $("#sheet").showModal();
}
function renderSheet() {
  const d = design(sel.id), c = colour(sel.colour);
  $("#gallery-main").innerHTML = shirt(d, c.id, { view: sel.view });
  $("#thumbs").innerHTML = ["flat", "close"].map((v) => `<button type="button" data-view="${v}" aria-pressed="${sel.view === v}" aria-label="${t(v === "flat" ? "viewFlat" : "viewClose")}">${shirt(d, c.id, { view: v })}</button>`).join("");
  $("#sheet-place").textContent = d.collections.map((x) => L(coll(x))).join(" · ");
  $("#sheet-title").textContent = t("tee", L(d));
  $("#sheet-price").textContent = money(shop.pricePerTee);
  $("#sheet-blurb").textContent = L(d, "blurb");
  $("#colour-name").textContent = L(c);
  $("#sheet-colours").innerHTML = d.colours.map((x) => `<button type="button" class="dot" style="background:${colour(x).fabric}" data-pick-colour="${x}" aria-pressed="${x === c.id}" aria-label="${L(colour(x))}" title="${L(colour(x))}"></button>`).join("");
  $("#sheet-sizes").innerHTML = shop.sizes.map((s) => `<button type="button" data-pick-size="${s.id}" aria-pressed="${s.id === sel.size}">${s.id}</button>`).join("");
  const s = shop.sizes.find((x) => x.id === sel.size);
  $("#size-hint").textContent = s ? t("sizeFits", s.height, s.weight) : "";
  $("#details").innerHTML = [d.placement === "chest" ? t("dChest", d.widthCm) : t("dFront", d.widthCm), t("dCotton"), t("dPrinted")].map((x) => `<li>${x}</li>`).join("");
  $("#scale-cap").textContent = t("scaleCap", d.widthCm);
  $("#scale-svg").innerHTML = scaleSVG(d);
}

function renderBag() {
  const { qty, sub, del, total } = totals();
  const count = $("#bag-count");
  count.textContent = qty; count.classList.toggle("has", qty > 0);
  $("#empty").hidden = qty > 0 || !$("#done").hidden;
  $("#checkout").hidden = qty === 0 || !$("#done").hidden;
  $("#lines").innerHTML = bag.map((l, i) => {
    const d = design(l.id), c = colour(l.colour);
    return `<li class="line">
      <div class="line-img">${shirt(d, c.id)}</div>
      <div><div class="line-name">${t("tee", L(d))}</div><div class="line-sub">${L(c)}, ${l.size}</div>
        <div class="qty"><button type="button" data-qty="${i}" data-step="-1" aria-label="${t("remove")}">−</button><span>${l.qty}</span><button type="button" data-qty="${i}" data-step="1" aria-label="${t("addAnother")}">+</button></div></div>
      <div class="line-price">${money(l.qty * shop.pricePerTee)}</div></li>`;
  }).join("");
  if (!qty) { $("#totals").innerHTML = ""; return; }
  const need = shop.freeDeliveryFrom - qty;
  $("#totals").innerHTML = `<dt>${t("subtotal")}</dt><dd>${money(sub)}</dd>
    <dt>${t("delivery")}</dt><dd>${del ? money(del) : t("free")}</dd>
    ${need > 0 ? `<p class="hint">${t("addMore", need)}</p>` : ""}
    <dt class="grand">${t("total")}</dt><dd class="grand">${money(total)}</dd>`;
}

function renderAll() {
  renderStatic(); renderAnnounce(); renderHero(); renderPlaces(); renderGrid(); renderPress();
  renderStories(); renderPeople(); renderSizeTable(); renderBag();
  if ($("#sheet").open) renderSheet();
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
  const d = new Date(Date.now() + 7 * 3600e3);
  const ymd = d.toISOString().slice(2, 10).replaceAll("-", "");
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rand = [...crypto.getRandomValues(new Uint8Array(4))].map((b) => chars[b % chars.length]).join("");
  return `${shop.orderPrefix}-${ymd}-${rand}`;
}

const postForm = (form) => fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(new FormData(form)).toString() });

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
    const res = await postForm(form);
    if (!res.ok) throw new Error(res.status);
    $("#done-num").textContent = num;
    $("#done-pay").textContent = t("donePay", money(total));
    $("#done-qr").src = `/qr/promptpay/${total}.png`;
    $("#done-qr").alt = t("donePay", money(total));
    $("#done").hidden = false;
    bag = []; store.set("bag", bag); form.reset(); renderBag();
  } catch {
    $("#form-msg").textContent = t("failed");
  } finally {
    btn.disabled = false; btn.textContent = t("place");
  }
}

async function signup(e) {
  e.preventDefault();
  const form = e.currentTarget;
  try { const r = await postForm(form); if (!r.ok) throw 0; form.reset(); $("#signup-msg").textContent = t("signedUp"); }
  catch { $("#signup-msg").textContent = t("signupFail"); }
}

function setFilter(f) {
  filter = f; renderGrid();
  $("#places-menu").hidden = true; $("#places-btn").setAttribute("aria-expanded", "false");
}

/* ---------- Boot ---------- */
async function boot() {
  shop = await (await fetch("/shop.json")).json();
  const names = shop.designs.flatMap((d) => d.colours.map((c) => `${d.id}-${c}`));
  const files = await Promise.all(names.map((n) => fetch(`/print/${n}.svg`).then((r) => r.text())));
  names.forEach((n, i) => { prints[n] = files[i]; });

  bag = store.get("bag", []).filter((l) => design(l.id) && design(l.id).colours.includes(l.colour) && shop.sizes.some((s) => s.id === l.size));
  lang = store.get("lang", null) || ((navigator.language || "").toLowerCase().startsWith("th") ? "th" : "en");
  $("#preview").hidden = shop.pricesConfirmed;
  const link = $("#contact-link");
  link.href = `mailto:${shop.brand.contactEmail}`; link.textContent = shop.brand.contactEmail;

  renderAll();

  document.addEventListener("click", (e) => {
    const b = e.target.closest("button, a");
    if (!b) return;
    const ds = b.dataset;
    if (ds.lang) { lang = ds.lang; store.set("lang", lang); renderAll(); }
    else if (ds.open) openSheet(ds.open, ds.colour);
    else if (ds.openLink) { e.preventDefault(); openSheet(ds.openLink); }
    else if (ds.swatch) { cardColour[ds.card] = ds.swatch; renderGrid(); $(`[data-card="${ds.card}"][data-swatch="${ds.swatch}"]`).focus(); }
    else if (ds.chip) setFilter(ds.chip);
    else if (ds.filter) setFilter(ds.filter);
    else if (ds.navAll !== undefined) setFilter("all");
    else if (ds.view) { sel.view = ds.view; renderSheet(); $(`[data-view="${ds.view}"]`).focus(); }
    else if (ds.pickColour) { sel.colour = ds.pickColour; renderSheet(); $(`[data-pick-colour="${sel.colour}"]`).focus(); }
    else if (ds.pickSize) { sel.size = ds.pickSize; $("#sheet-msg").textContent = ""; renderSheet(); $(`[data-pick-size="${sel.size}"]`).focus(); }
    else if (ds.qty) { const l = bag[+ds.qty]; l.qty += +ds.step; if (l.qty < 1) bag.splice(+ds.qty, 1); save(); }
    else if (b.id === "size-guide-link") $("#sheet").close();
    else if (b.id === "places-btn") {
      const open = b.getAttribute("aria-expanded") === "true";
      b.setAttribute("aria-expanded", String(!open)); $("#places-menu").hidden = open;
    }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#places-menu").hidden) setFilter(filter); });
  $("#add-to-bag").addEventListener("click", addToBag);
  $("#open-bag").addEventListener("click", () => { $("#done").hidden = true; renderBag(); $("#bag").showModal(); });
  $("#checkout").addEventListener("submit", placeOrder);
  $("#signup").addEventListener("submit", signup);
  for (const dlg of ["#sheet", "#bag"]) $(dlg).addEventListener("click", (e) => { if (e.target === e.currentTarget) e.currentTarget.close(); });
}
boot();
