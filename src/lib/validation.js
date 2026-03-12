/**
 * Form validation utilities
 * Email validation, phone validation, device info, etc.
 * Used by all forms across the site.
 */

import { checkMX } from "@/lib/api";

// ===========================
// DISPOSABLE EMAIL DOMAINS
// ===========================

const DISPOSABLE_DOMAINS = [
  "tempmail.com","temp-mail.org","guerrillamail.com","guerrillamail.de",
  "guerrillamail.net","guerrillamail.org","sharklasers.com","grr.la",
  "guerrilla.ml","yopmail.com","yopmail.fr","mailinator.com",
  "trashmail.com","trashmail.net","throwaway.email","fakeinbox.com",
  "mailnesia.com","maildrop.cc","dispostable.com","getairmail.com",
  "mailcatch.com","tempr.email","discard.email","mailsac.com",
  "10minutemail.com","tempail.com","burpcollaborator.net",
  "temp-mail.io","mohmal.com","getnada.com","emailondeck.com",
  "tmail.ws","tmpmail.net","tmpmail.org","binkmail.com","trashmail.me",
  "guerrillamailblock.com","mailexpire.com","throwam.com",
  "filzmail.com","anonaddy.com","spamgourmet.com","mytemp.email",
  "tempinbox.com","tempmailaddress.com","emailfake.com","crazymailing.com",
  "armyspy.com","dayrep.com","einrot.com","fleckens.hu","gustr.com",
  "jourrapide.com","rhyta.com","superrito.com","teleworm.us",
];

// ===========================
// EMAIL TYPO MAP
// ===========================

const TYPO_MAP = {
  "gmial.com":"gmail.com","gmal.com":"gmail.com","gmaill.com":"gmail.com",
  "gamil.com":"gmail.com","gnail.com":"gmail.com","gmail.co":"gmail.com",
  "gmail.con":"gmail.com","gmail.om":"gmail.com","gmail.cm":"gmail.com",
  "gmai.com":"gmail.com","gmil.com":"gmail.com","gmail.comm":"gmail.com",
  "gmail.in":"gmail.com","gmail.cim":"gmail.com","gmail.cpm":"gmail.com",
  "gmail.xom":"gmail.com","gmail.vom":"gmail.com","gmaul.com":"gmail.com",
  "gmakl.com":"gmail.com","yaho.com":"yahoo.com","yahooo.com":"yahoo.com",
  "yahoo.co":"yahoo.com","yahoo.con":"yahoo.com","yahoo.om":"yahoo.com",
  "yhaoo.com":"yahoo.com","yaoo.com":"yahoo.com","yahoo.cm":"yahoo.com",
  "yahoo.comm":"yahoo.com","hotmal.com":"hotmail.com","hotmial.com":"hotmail.com",
  "hotmail.con":"hotmail.com","hotmail.co":"hotmail.com","hotmali.com":"hotmail.com",
  "hotmai.com":"hotmail.com","outloo.com":"outlook.com","outlok.com":"outlook.com",
  "outlook.co":"outlook.com","outlook.con":"outlook.com","outllook.com":"outlook.com",
  "outlokk.com":"outlook.com","rediffmal.com":"rediffmail.com",
  "rediffmail.co":"rediffmail.com","redifmail.com":"rediffmail.com",
  "reddiffmail.com":"rediffmail.com","protonmal.com":"protonmail.com",
  "protonmail.co":"protonmail.com","protonmail.con":"protonmail.com",
  "icloud.co":"icloud.com","icloud.con":"icloud.com","icoud.com":"icloud.com",
};

// ===========================
// EMAIL VALIDATION (SYNC)
// ===========================

export function validateEmailSync(email) {
  email = email.trim().toLowerCase();
  if (!email) return { valid: false, msg: "", type: "" };

  if (!/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email))
    return { valid: false, msg: "Yeh email format sahi nahi lag raha", type: "error" };

  const domain = email.split("@")[1];

  if (DISPOSABLE_DOMAINS.includes(domain))
    return { valid: false, msg: "Temporary/disposable email allowed nahi hai. Apna real email use karo.", type: "error" };

  if (TYPO_MAP[domain]) {
    const fix = email.split("@")[0] + "@" + TYPO_MAP[domain];
    return { valid: false, msg: `Kya tumhara matlab <strong>${fix}</strong> tha?`, type: "typo", suggestion: fix };
  }

  if (domain.length < 4)
    return { valid: false, msg: "Yeh domain sahi nahi lagta", type: "error" };

  return { valid: true, msg: "✓ Email looks good", type: "success" };
}

// ===========================
// EMAIL VALIDATION (ASYNC with MX)
// ===========================

export async function validateEmailFull(email) {
  const syncResult = validateEmailSync(email);
  if (!syncResult.valid) return syncResult;

  const domain = email.trim().toLowerCase().split("@")[1];
  const mxOk = await checkMX(domain);

  return mxOk
    ? { valid: true, msg: "✓ Email verified", type: "success" }
    : { valid: false, msg: "Yeh email domain exist nahi karta. Real email use karo.", type: "error" };
}

// ===========================
// PHONE VALIDATION (INDIAN)
// ===========================

export function validatePhone(phone) {
  phone = phone.trim();
  if (!phone) return { valid: false, msg: "", type: "" };

  const cleaned = phone.replace(/[\s\-\(\)\.]/g, "");

  const patterns = [
    /^\+91[6-9]\d{9}$/,
    /^91[6-9]\d{9}$/,
    /^0[6-9]\d{9}$/,
    /^[6-9]\d{9}$/,
  ];

  if (patterns.some((p) => p.test(cleaned)))
    return { valid: true, msg: "✓ Phone number valid hai", type: "success" };

  if (/^\+?\d{5,}$/.test(cleaned)) {
    if (cleaned.length < 10) return { valid: false, msg: "Phone number chhota hai — 10 digits hone chahiye", type: "error" };
    if (cleaned.length > 13) return { valid: false, msg: "Phone number zyada lamba hai", type: "error" };
    const first = cleaned.replace(/^\+?91/, "").charAt(0);
    if (first && "012345".includes(first))
      return { valid: false, msg: "Indian mobile numbers 6, 7, 8 ya 9 se start hote hain", type: "error" };
    return { valid: false, msg: "Sahi phone number daalo (+91 XXXXX XXXXX)", type: "error" };
  }

  return { valid: false, msg: "Yeh phone number sahi nahi lag raha", type: "error" };
}

export function formatPhoneDisplay(phone) {
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, "");
  let digits;
  if (cleaned.startsWith("+91")) digits = cleaned.slice(3);
  else if (cleaned.startsWith("91") && cleaned.length === 12) digits = cleaned.slice(2);
  else if (cleaned.startsWith("0")) digits = cleaned.slice(1);
  else digits = cleaned;
  if (digits.length === 10) return "+91 " + digits.slice(0, 5) + " " + digits.slice(5);
  return phone;
}

// ===========================
// DEVICE INFO
// ===========================

export function getDeviceInfo() {
  if (typeof window === "undefined") return {};

  const ua = navigator.userAgent;
  const info = {
    user_agent: ua,
    platform: navigator.platform || "unknown",
    language: navigator.language || "unknown",
    screen: screen.width + "x" + screen.height,
    viewport: window.innerWidth + "x" + window.innerHeight,
    pixel_ratio: window.devicePixelRatio || 1,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown",
    touch: "ontouchstart" in window || navigator.maxTouchPoints > 0,
    connection: navigator.connection?.effectiveType || "unknown",
    referrer: document.referrer || "direct",
    page: window.location.href,
    timestamp: new Date().toISOString(),
  };

  // Device type
  if (/Mobile|Android|iPhone|iPad/i.test(ua))
    info.device_type = /iPad|tablet/i.test(ua) ? "tablet" : "mobile";
  else info.device_type = "desktop";

  // Browser
  if (/Edg\//i.test(ua)) info.browser = "Edge";
  else if (/OPR\/|Opera/i.test(ua)) info.browser = "Opera";
  else if (/Chrome\//i.test(ua)) info.browser = "Chrome";
  else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) info.browser = "Safari";
  else if (/Firefox\//i.test(ua)) info.browser = "Firefox";
  else info.browser = "Other";

  // OS
  if (/Windows/i.test(ua)) info.os = "Windows";
  else if (/Mac OS/i.test(ua)) info.os = "macOS";
  else if (/Android/i.test(ua)) info.os = "Android";
  else if (/iOS|iPhone|iPad/i.test(ua)) info.os = "iOS";
  else if (/Linux/i.test(ua)) info.os = "Linux";
  else info.os = "Other";

  return info;
}
