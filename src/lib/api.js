/**
 * Centralized API service for oyenino.com
 * All API calls go through here — single source of truth.
 */

const FORM_API = "https://forms.oyenino.com";
const MX_API = "https://dns.google/resolve";
const LOCATION_API = "https://ipapi.co/json/";

// ===========================
// FORM SUBMISSION
// ===========================

export async function submitForm(payload) {
  const response = await fetch(FORM_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Form submission failed: ${response.status}`);
  }

  return response;
}

// ===========================
// MX (EMAIL DOMAIN) CHECK
// ===========================

const mxCache = {};

export async function checkMX(domain) {
  if (mxCache[domain] !== undefined) return mxCache[domain];

  try {
    const res = await fetch(
      `${MX_API}?name=${encodeURIComponent(domain)}&type=MX`
    );
    const data = await res.json();
    const ok = data.Status === 0 && data.Answer && data.Answer.length > 0;
    mxCache[domain] = ok;
    return ok;
  } catch {
    mxCache[domain] = true;
    return true;
  }
}

// ===========================
// LOCATION INFO
// ===========================

export async function getLocationInfo() {
  try {
    const res = await fetch(LOCATION_API);
    const d = await res.json();
    if (d && !d.error) {
      return {
        ip: d.ip || "",
        city: d.city || "",
        region: d.region || "",
        country: d.country_name || "",
        country_code: d.country_code || "",
        lat: d.latitude || "",
        lon: d.longitude || "",
        timezone: d.timezone || "",
        org: d.org || "",
        postal: d.postal || "",
      };
    }
    return null;
  } catch {
    return null;
  }
}
