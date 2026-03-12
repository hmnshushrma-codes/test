/**
 * Enhanced visitor fingerprinting
 * Captures maximum information about the visitor silently.
 */

// ===========================
// DEVICE + BROWSER INFO
// ===========================

export function getDeviceInfo() {
  if (typeof window === "undefined") return {};

  const ua = navigator.userAgent;
  const info = {
    user_agent: ua,
    platform: navigator.platform || "unknown",
    language: navigator.language || "unknown",
    languages: navigator.languages ? navigator.languages.join(",") : navigator.language,
    screen_resolution: `${screen.width}x${screen.height}`,
    screen_avail: `${screen.availWidth}x${screen.availHeight}`,
    color_depth: screen.colorDepth,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    pixel_ratio: window.devicePixelRatio || 1,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown",
    timezone_offset: new Date().getTimezoneOffset(),
    touch: "ontouchstart" in window || navigator.maxTouchPoints > 0,
    max_touch_points: navigator.maxTouchPoints || 0,
    connection: navigator.connection?.effectiveType || "unknown",
    downlink: navigator.connection?.downlink || "unknown",
    save_data: navigator.connection?.saveData || false,
    hardware_concurrency: navigator.hardwareConcurrency || "unknown",
    device_memory: navigator.deviceMemory || "unknown",
    referrer: document.referrer || "direct",
    page_url: window.location.href,
    page_path: window.location.pathname,
    timestamp: new Date().toISOString(),
    local_time: new Date().toLocaleString(),
    online: navigator.onLine,
    cookies_enabled: navigator.cookieEnabled,
    do_not_track: navigator.doNotTrack || "unset",
    pdf_viewer: navigator.pdfViewerEnabled || false,
  };

  // Device type
  if (/Mobile|Android|iPhone|iPad/i.test(ua))
    info.device_type = /iPad|tablet/i.test(ua) ? "tablet" : "mobile";
  else info.device_type = "desktop";

  // Browser detection
  if (/Edg\//i.test(ua)) info.browser = "Edge";
  else if (/OPR\/|Opera/i.test(ua)) info.browser = "Opera";
  else if (/Chrome\//i.test(ua)) info.browser = "Chrome";
  else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) info.browser = "Safari";
  else if (/Firefox\//i.test(ua)) info.browser = "Firefox";
  else info.browser = "Other";

  // OS detection
  if (/Windows/i.test(ua)) info.os = "Windows";
  else if (/Mac OS/i.test(ua)) info.os = "macOS";
  else if (/Android/i.test(ua)) info.os = "Android";
  else if (/iOS|iPhone|iPad/i.test(ua)) info.os = "iOS";
  else if (/Linux/i.test(ua)) info.os = "Linux";
  else if (/CrOS/i.test(ua)) info.os = "ChromeOS";
  else info.os = "Other";

  // Browser version
  const vMatch = ua.match(/(Chrome|Firefox|Safari|Edg|OPR|Opera)\/(\d+(\.\d+)?)/);
  if (vMatch) info.browser_version = vMatch[2];

  return info;
}

// ===========================
// CANVAS FINGERPRINT
// ===========================

export function getCanvasFingerprint() {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext("2d");
    ctx.textBaseline = "top";
    ctx.font = "14px Arial";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText("oyenino fingerprint", 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText("oyenino fingerprint", 4, 17);
    const dataUrl = canvas.toDataURL();
    // Simple hash
    let hash = 0;
    for (let i = 0; i < dataUrl.length; i++) {
      const char = dataUrl.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  } catch {
    return "unavailable";
  }
}

// ===========================
// WEBGL INFO (GPU fingerprint)
// ===========================

export function getWebGLInfo() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return { renderer: "unavailable", vendor: "unavailable" };
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    return {
      renderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : "unknown",
      vendor: ext ? gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) : "unknown",
    };
  } catch {
    return { renderer: "unavailable", vendor: "unavailable" };
  }
}

// ===========================
// INSTALLED FONTS (basic check)
// ===========================

export function getInstalledFontsHint() {
  try {
    const testFonts = ["Arial", "Courier New", "Georgia", "Helvetica", "Times New Roman", "Verdana", "Comic Sans MS", "Impact", "Trebuchet MS", "Palatino"];
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const baseFont = "monospace";
    ctx.font = `72px ${baseFont}`;
    const baseWidth = ctx.measureText("mmmmmmmmmmlli").width;

    const detected = testFonts.filter((font) => {
      ctx.font = `72px "${font}", ${baseFont}`;
      return ctx.measureText("mmmmmmmmmmlli").width !== baseWidth;
    });
    return detected.join(",");
  } catch {
    return "unavailable";
  }
}

// ===========================
// SESSION TRACKING
// ===========================

export function getSessionInfo() {
  // Pages visited in this session
  const sessionKey = "oye_session_pages";
  const visited = JSON.parse(sessionStorage.getItem(sessionKey) || "[]");
  const current = window.location.pathname;
  if (!visited.includes(current)) visited.push(current);
  sessionStorage.setItem(sessionKey, JSON.stringify(visited));

  // Visit count
  const visitKey = "oye_visit_count";
  const count = parseInt(localStorage.getItem(visitKey) || "0") + 1;
  localStorage.setItem(visitKey, count.toString());

  // First visit time
  const firstKey = "oye_first_visit";
  if (!localStorage.getItem(firstKey)) {
    localStorage.setItem(firstKey, new Date().toISOString());
  }

  return {
    pages_this_session: visited,
    total_visits: count,
    first_visit: localStorage.getItem(firstKey),
    session_start: sessionStorage.getItem("oye_session_start") || (() => {
      const now = new Date().toISOString();
      sessionStorage.setItem("oye_session_start", now);
      return now;
    })(),
  };
}

// ===========================
// FULL FINGERPRINT (combine all)
// ===========================

export function getFullFingerprint() {
  const device = getDeviceInfo();
  const canvas = getCanvasFingerprint();
  const webgl = getWebGLInfo();
  const fonts = getInstalledFontsHint();
  const session = getSessionInfo();

  return {
    device,
    canvas_fingerprint: canvas,
    webgl,
    detected_fonts: fonts,
    session,
  };
}
