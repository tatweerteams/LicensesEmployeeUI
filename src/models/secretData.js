import CryptoJS from "crypto-js";

const key = "82f2ceed4c503896c8a291e560bd4326";
const iv = "tatweerDev";

export function aesEncrypt(txt) {
  const cipher = CryptoJS.AES.encrypt(txt, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
  });

  return cipher.toString();
}

export function aesDencrypt(txt) {
  const cipher = CryptoJS.AES.decrypt(txt, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
  });

  return CryptoJS.enc.Utf8.stringify(cipher).toString();
}

