// Expected payloads come from published examples:
// dtinth/promptpay-qr index.test.js and kittinan/php-promptpay-qr README.
import { test } from "node:test";
import assert from "node:assert/strict";
import { promptPayPayload } from "../netlify/lib/promptpay.mjs";

test("phone number, no amount (dtinth test case)", () => {
  assert.equal(promptPayPayload("0801234567"), "00020101021129370016A000000677010111011300668012345675802TH530376463046197");
});
test("phone number, no amount (php-promptpay-qr README)", () => {
  assert.equal(promptPayPayload("0899999999"), "00020101021129370016A000000677010111011300668999999995802TH53037646304FE29");
});
test("phone number with amount 420 (php-promptpay-qr README)", () => {
  assert.equal(promptPayPayload("089-999-9999", 420), "00020101021229370016A000000677010111011300668999999995802TH53037645406420.006304CF9E");
});
