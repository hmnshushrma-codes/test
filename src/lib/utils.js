/**
 * Shared utility functions
 */

import { trackEvent } from "@/lib/analytics";

// Copy text to clipboard with feedback
export async function copyToClipboard(text, onSuccess) {
  try {
    await navigator.clipboard.writeText(text);
    trackEvent("prompt_copied", {
      page: window.location.pathname,
    });
    if (onSuccess) onSuccess();
    return true;
  } catch {
    return false;
  }
}
