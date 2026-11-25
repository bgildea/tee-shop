import { test } from "node:test";
import assert from "node:assert/strict";
import { checkOrder, customerEmail, ownerEmail, shop } from "../netlify/lib/order.mjs";

const base = { order_number: "TD-261125-AB12", name: "Somchai <b>", email: "a@b.co", phone: "0812345678", address: "1 Soi 2", province: "Bangkok", postcode: "10110", lang: "th" };

test("one tee pays delivery", () => {
  const o = checkOrder({ ...base, items: JSON.stringify([{ id: "railay", colour: "black", size: "M", qty: 1 }]), total: shop.pricePerTee + shop.delivery });
  assert.equal(o.total, shop.pricePerTee + shop.delivery);
  assert.equal(o.totalMismatch, false);
});
test("two tees deliver free", () => {
  const o = checkOrder({ ...base, items: JSON.stringify([{ id: "railay", colour: "black", size: "M", qty: 2 }]) });
  assert.equal(o.delivery, 0);
  assert.equal(o.total, shop.pricePerTee * 2);
});
test("unknown designs are dropped and a tampered total is flagged", () => {
  const o = checkOrder({ ...base, items: JSON.stringify([{ id: "nope", colour: "black", size: "M", qty: 3 }, { id: "railay", colour: "white", size: "S", qty: 1 }]), total: 1 });
  assert.equal(o.lines.length, 1);
  assert.equal(o.totalMismatch, true);
});
test("emails escape customer input", () => {
  const o = checkOrder({ ...base, items: JSON.stringify([{ id: "railay", colour: "white", size: "S", qty: 1 }]) });
  assert.ok(!customerEmail(o, "https://x").html.includes("<b>"));
  assert.ok(ownerEmail(o, "https://x").html.includes("/print/railay-white.png"));
});
