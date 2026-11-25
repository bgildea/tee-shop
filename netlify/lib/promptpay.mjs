// PromptPay QR payload (EMVCo merchant-presented QR, Thai PromptPay profile).
// Field order follows the widely used reference implementation
// (dtinth/promptpay-qr) so output can be checked against its published examples.

const f = (id, value) => id + String(value.length).padStart(2, "0") + value;

function crc16(str) {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let b = 0; b < 8; b++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

// id: Thai mobile number (10 digits), national/tax ID (13 digits) or e-wallet ID (15 digits).
export function promptPayPayload(id, amount) {
  const digits = String(id).replace(/\D/g, "");
  let account;
  if (digits.length >= 15) account = f("03", digits);
  else if (digits.length >= 13) account = f("02", digits);
  else account = f("01", ("0000000000000" + digits.replace(/^0/, "66")).slice(-13));

  const hasAmount = amount !== undefined && amount !== null && Number(amount) > 0;
  const data = [
    f("00", "01"),
    f("01", hasAmount ? "12" : "11"),
    f("29", f("00", "A000000677010111") + account),
    f("58", "TH"),
    f("53", "764"),
    hasAmount ? f("54", Number(amount).toFixed(2)) : "",
  ].join("") + "6304";
  return data + crc16(data);
}
