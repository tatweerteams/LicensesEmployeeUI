import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

const TokenKey = "Token";
const user_info = "user_info";
const XAntiForgeryKet="XAntiForgery"

const key = "82f2ceed4c503896c8a291e560bd4325"; // change to your key
const iv = "sinasinasisinaaa"; // change to your iv

export function getToken() {
  let tokenDencrypt = aesEncrypt(TokenKey);
  var result = Cookies.get(tokenDencrypt);
  if (!result) return;
  var valueToken = aesDencrypt(result);

  return valueToken;
}

export function setToken(token) {
  let tokenEncrype = aesEncrypt(TokenKey);
  let tokenValue = aesEncrypt(token);
  return Cookies.set(tokenEncrype, tokenValue);
}


export function removeToken() {
  removeUserInfo();
  removeXAntiForgery();
  let tokenDencrypt = aesEncrypt(TokenKey);
  return Cookies.remove(tokenDencrypt);
}



export function SetXAntiForgery(token) {
  let tokenEncrype = aesEncrypt(XAntiForgeryKet);
  let tokenValue = aesEncrypt(token);
  return Cookies.set(tokenEncrype, tokenValue);
}

export function getXAntiForgeryWithKey() {
  let tokenDencrypt = aesEncrypt(XAntiForgeryKet);
  var result = Cookies.get(tokenDencrypt);
  if (!result) return;
  var valueToken = aesDencrypt(result);
  return valueToken;
}
export function removeXAntiForgery() {
  let tokenDencrypt = aesEncrypt(XAntiForgeryKet);
  return Cookies.remove(tokenDencrypt);
}


//userInfo

export async function getUserInfo() {
  let keyEncrype = aesEncrypt(user_info);
  var keyValueEncrype = Cookies.get(keyEncrype);

  if (!keyValueEncrype) return;
  var value = aesDencrypt(keyValueEncrype);

  var result = JSON.parse(value);
  return result;
}

export function setUserInfo(data) {
  let keyEncrype = aesEncrypt(user_info);
  let valueJson = JSON.stringify(data);
  let infoEncrype = aesEncrypt(valueJson);
  return Cookies.set(keyEncrype, infoEncrype);
}

function removeUserInfo() {
  let userInfo = aesEncrypt(user_info);
  return Cookies.remove(userInfo);
}

// encripy

function aesEncrypt(txt) {
  const cipher = CryptoJS.AES.encrypt(txt, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
  });

  return cipher.toString();
}

function aesDencrypt(txt) {
  const cipher = CryptoJS.AES.decrypt(txt, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
  });

  return CryptoJS.enc.Utf8.stringify(cipher).toString();
}
