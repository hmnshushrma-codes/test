/**
 * Country codes + phone validation rules
 * Country code is auto-detected via IP, shown in dropdown
 */

export const COUNTRY_CODES = [
  { code: "+91", flag: "🇮🇳", name: "India", iso: "IN", minDigits: 10, maxDigits: 10, startsWith: /^[6-9]/ },
  { code: "+1", flag: "🇺🇸", name: "USA", iso: "US", minDigits: 10, maxDigits: 10 },
  { code: "+1", flag: "🇨🇦", name: "Canada", iso: "CA", minDigits: 10, maxDigits: 10 },
  { code: "+44", flag: "🇬🇧", name: "UK", iso: "GB", minDigits: 10, maxDigits: 11 },
  { code: "+971", flag: "🇦🇪", name: "UAE", iso: "AE", minDigits: 9, maxDigits: 9 },
  { code: "+61", flag: "🇦🇺", name: "Australia", iso: "AU", minDigits: 9, maxDigits: 9 },
  { code: "+49", flag: "🇩🇪", name: "Germany", iso: "DE", minDigits: 10, maxDigits: 12 },
  { code: "+33", flag: "🇫🇷", name: "France", iso: "FR", minDigits: 9, maxDigits: 9 },
  { code: "+81", flag: "🇯🇵", name: "Japan", iso: "JP", minDigits: 10, maxDigits: 11 },
  { code: "+65", flag: "🇸🇬", name: "Singapore", iso: "SG", minDigits: 8, maxDigits: 8 },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia", iso: "SA", minDigits: 9, maxDigits: 9 },
  { code: "+974", flag: "🇶🇦", name: "Qatar", iso: "QA", minDigits: 8, maxDigits: 8 },
  { code: "+968", flag: "🇴🇲", name: "Oman", iso: "OM", minDigits: 8, maxDigits: 8 },
  { code: "+977", flag: "🇳🇵", name: "Nepal", iso: "NP", minDigits: 10, maxDigits: 10 },
  { code: "+880", flag: "🇧🇩", name: "Bangladesh", iso: "BD", minDigits: 10, maxDigits: 10 },
  { code: "+94", flag: "🇱🇰", name: "Sri Lanka", iso: "LK", minDigits: 9, maxDigits: 9 },
  { code: "+60", flag: "🇲🇾", name: "Malaysia", iso: "MY", minDigits: 9, maxDigits: 10 },
  { code: "+86", flag: "🇨🇳", name: "China", iso: "CN", minDigits: 11, maxDigits: 11 },
  { code: "+82", flag: "🇰🇷", name: "South Korea", iso: "KR", minDigits: 10, maxDigits: 11 },
  { code: "+234", flag: "🇳🇬", name: "Nigeria", iso: "NG", minDigits: 10, maxDigits: 11 },
  { code: "+254", flag: "🇰🇪", name: "Kenya", iso: "KE", minDigits: 9, maxDigits: 10 },
  { code: "+27", flag: "🇿🇦", name: "South Africa", iso: "ZA", minDigits: 9, maxDigits: 9 },
  { code: "+55", flag: "🇧🇷", name: "Brazil", iso: "BR", minDigits: 10, maxDigits: 11 },
  { code: "+52", flag: "🇲🇽", name: "Mexico", iso: "MX", minDigits: 10, maxDigits: 10 },
  { code: "+7", flag: "🇷🇺", name: "Russia", iso: "RU", minDigits: 10, maxDigits: 10 },
  { code: "+39", flag: "🇮🇹", name: "Italy", iso: "IT", minDigits: 9, maxDigits: 10 },
  { code: "+34", flag: "🇪🇸", name: "Spain", iso: "ES", minDigits: 9, maxDigits: 9 },
  { code: "+31", flag: "🇳🇱", name: "Netherlands", iso: "NL", minDigits: 9, maxDigits: 9 },
  { code: "+46", flag: "🇸🇪", name: "Sweden", iso: "SE", minDigits: 9, maxDigits: 10 },
  { code: "+41", flag: "🇨🇭", name: "Switzerland", iso: "CH", minDigits: 9, maxDigits: 9 },
  { code: "+48", flag: "🇵🇱", name: "Poland", iso: "PL", minDigits: 9, maxDigits: 9 },
  { code: "+92", flag: "🇵🇰", name: "Pakistan", iso: "PK", minDigits: 10, maxDigits: 10 },
  { code: "+62", flag: "🇮🇩", name: "Indonesia", iso: "ID", minDigits: 10, maxDigits: 12 },
  { code: "+66", flag: "🇹🇭", name: "Thailand", iso: "TH", minDigits: 9, maxDigits: 9 },
  { code: "+84", flag: "🇻🇳", name: "Vietnam", iso: "VN", minDigits: 9, maxDigits: 10 },
  { code: "+63", flag: "🇵🇭", name: "Philippines", iso: "PH", minDigits: 10, maxDigits: 10 },
];

/**
 * Find country by ISO code (from IP geolocation)
 */
export function findCountryByISO(iso) {
  return COUNTRY_CODES.find((c) => c.iso === iso) || COUNTRY_CODES[0]; // default India
}

/**
 * Clean phone number — strip ALL non-digit characters
 * This handles autofill, copy-paste, spaces, dashes, etc.
 */
export function cleanPhoneNumber(raw) {
  return raw.replace(/[^\d]/g, "");
}

/**
 * Validate phone number against country rules
 * Input should be JUST digits (no country code, no special chars)
 */
export function validatePhoneForCountry(digits, country) {
  if (!digits) return { valid: false, msg: "", type: "" };

  // Remove leading 0 (common in many countries)
  let cleaned = digits;
  if (cleaned.startsWith("0")) cleaned = cleaned.slice(1);

  // Remove country code if user accidentally typed it
  const codeDigits = country.code.replace("+", "");
  if (cleaned.startsWith(codeDigits)) {
    cleaned = cleaned.slice(codeDigits.length);
  }

  if (cleaned.length < country.minDigits) {
    return { valid: false, msg: `Number too short — need ${country.minDigits} digits`, type: "error" };
  }

  if (cleaned.length > country.maxDigits) {
    return { valid: false, msg: `Number too long — max ${country.maxDigits} digits`, type: "error" };
  }

  // Country-specific first-digit check (e.g., India: must start with 6-9)
  if (country.startsWith && !country.startsWith.test(cleaned)) {
    return { valid: false, msg: `${country.name} numbers must start with ${country.startsWith.source.replace(/[\^\[\]]/g, "")}`, type: "error" };
  }

  return { valid: true, msg: "✓ Valid number", type: "success" };
}

/**
 * Format phone for display: +91 98765 43210
 */
export function formatPhoneForDisplay(digits, country) {
  let cleaned = digits;
  if (cleaned.startsWith("0")) cleaned = cleaned.slice(1);
  const codeDigits = country.code.replace("+", "");
  if (cleaned.startsWith(codeDigits)) cleaned = cleaned.slice(codeDigits.length);

  // Simple grouping: split into chunks
  if (cleaned.length >= 10) {
    return `${country.code} ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  if (cleaned.length >= 8) {
    return `${country.code} ${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
  }
  return `${country.code} ${cleaned}`;
}
