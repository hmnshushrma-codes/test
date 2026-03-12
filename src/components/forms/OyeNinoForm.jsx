"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { submitForm, getLocationInfo } from "@/lib/api";
import { validateEmailSync, validateEmailFull, validatePhone, formatPhoneDisplay, getDeviceInfo } from "@/lib/validation";
import { trackEvent } from "@/lib/analytics";

/**
 * Universal form component used across every page.
 *
 * Props:
 *  - formName: string (e.g., "contact", "prompts_gate")
 *  - source: string (e.g., "main_site")
 *  - requiredFields: string[] (e.g., ["name", "email", "message", "city"])
 *  - btnTexts: { ready, turnstile, email, phone, fields, submitting }
 *  - onSuccess: (payload) => void
 *  - children: form fields JSX (rendered inside the <form>)
 *  - showTurnstile: boolean (default true)
 *  - turnstileSiteKey: string
 *  - className: string
 */
export default function OyeNinoForm({
  formName,
  source,
  requiredFields = ["name", "email"],
  btnTexts = {},
  onSuccess,
  children,
  showTurnstile = true,
  turnstileSiteKey = "0x4AAAAAACgSvRvZpT5d_Ab5",
  className = "",
}) {
  const formRef = useRef(null);
  const mxTimeoutRef = useRef(null);

  const [emailValid, setEmailValid] = useState(false);
  const [phoneValid, setPhoneValid] = useState(!requiredFields.includes("phone"));
  const [turnstileVerified, setTurnstileVerified] = useState(false);
  const [emailStatus, setEmailStatus] = useState({ html: "", cls: "" });
  const [phoneStatus, setPhoneStatus] = useState({ html: "", cls: "" });
  const [error, setError] = useState("");
  const [btnState, setBtnState] = useState("fields");
  const [locationData, setLocationData] = useState(null);
  const [formStarted, setFormStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const txt = {
    ready: "Send Message →",
    turnstile: "Verify you're human first ↑",
    email: "Enter a valid email first",
    phone: "Enter a valid phone number",
    fields: "Fill required fields first",
    submitting: "Sending...",
    ...btnTexts,
  };

  // Fetch location on mount
  useEffect(() => {
    getLocationInfo().then((d) => {
      setLocationData(d);
      if (d && formRef.current) {
        const cityInput = formRef.current.querySelector('[name="city"]');
        if (cityInput && !cityInput.value && d.city && d.country) {
          cityInput.value = `${d.city}, ${d.country}`;
        }
      }
    });
  }, []);

  // Turnstile callbacks
  useEffect(() => {
    if (!showTurnstile) {
      setTurnstileVerified(true);
      return;
    }
    window.onTurnstileSuccess = (token) => {
      setTurnstileVerified(true);
      trackEvent("turnstile_verified", { form_id: formName });
    };
    window.onTurnstileExpired = () => {
      setTurnstileVerified(false);
    };
  }, [formName, showTurnstile]);

  // Check if all required fields are filled
  const checkFieldsFilled = useCallback(() => {
    if (!formRef.current) return false;
    return requiredFields.every((f) => {
      const el = formRef.current.querySelector(`[name="${f}"]`) || formRef.current.querySelector(`#${f}`);
      return el && el.value && el.value.trim().length > 0;
    });
  }, [requiredFields]);

  // Update button state
  const updateBtn = useCallback(() => {
    const filled = checkFieldsFilled();
    if (filled && emailValid && phoneValid && turnstileVerified) {
      setBtnState("ready");
    } else if (filled && emailValid && phoneValid && !turnstileVerified) {
      setBtnState("turnstile");
    } else if (!emailValid && formRef.current?.querySelector('[name="email"]')?.value?.trim()) {
      setBtnState("email");
    } else if (!phoneValid && formRef.current?.querySelector('[name="phone"]')?.value?.trim()) {
      setBtnState("phone");
    } else {
      setBtnState("fields");
    }
  }, [checkFieldsFilled, emailValid, phoneValid, turnstileVerified]);

  useEffect(() => { updateBtn(); }, [emailValid, phoneValid, turnstileVerified, updateBtn]);

  // Email input handler
  const handleEmailInput = useCallback((e) => {
    const val = e.target.value.trim();
    clearTimeout(mxTimeoutRef.current);

    if (!val) {
      setEmailValid(false);
      setEmailStatus({ html: "", cls: "" });
      updateBtn();
      return;
    }

    const r = validateEmailSync(val);
    if (!r.valid) {
      setEmailValid(false);
      setEmailStatus({ html: r.msg, cls: `email-${r.type}`, suggestion: r.suggestion });
      updateBtn();
      return;
    }

    // Pending MX check
    setEmailValid(false);
    setEmailStatus({ html: '<span class="email-checking">⏳ Domain verify ho raha hai...</span>', cls: "email-pending" });
    updateBtn();

    mxTimeoutRef.current = setTimeout(async () => {
      const result = await validateEmailFull(val);
      // Only update if email hasn't changed
      if (formRef.current?.querySelector('[name="email"]')?.value?.trim().toLowerCase() === val.toLowerCase()) {
        setEmailValid(result.valid);
        setEmailStatus({
          html: result.msg,
          cls: result.valid ? "email-success" : "email-error",
        });
      }
    }, 600);
  }, [updateBtn]);

  // Phone input handler
  const handlePhoneInput = useCallback((e) => {
    const val = e.target.value.trim();
    if (!val) {
      setPhoneValid(false);
      setPhoneStatus({ html: "", cls: "" });
      updateBtn();
      return;
    }
    const r = validatePhone(val);
    setPhoneValid(r.valid);
    setPhoneStatus({ html: r.msg, cls: r.msg ? `phone-${r.type}` : "" });
    updateBtn();
  }, [updateBtn]);

  // Phone blur handler (format)
  const handlePhoneBlur = useCallback((e) => {
    if (e.target.value.trim()) {
      const r = validatePhone(e.target.value.trim());
      if (r.valid) e.target.value = formatPhoneDisplay(e.target.value.trim());
      handlePhoneInput(e);
    }
  }, [handlePhoneInput]);

  // Typo fix handler
  const handleTypoFix = useCallback((suggestion) => {
    if (!formRef.current) return;
    const emailInput = formRef.current.querySelector('[name="email"]');
    if (emailInput) {
      emailInput.value = suggestion;
      handleEmailInput({ target: emailInput });
      emailInput.focus();
      trackEvent("email_typo_fixed", { corrected_to: suggestion.split("@")[1] });
    }
  }, [handleEmailInput]);

  // Generic input handler for button updates
  const handleFieldInput = useCallback(() => {
    if (!formStarted) {
      setFormStarted(true);
      trackEvent("form_start", { form_id: formName });
    }
    updateBtn();
  }, [formStarted, formName, updateBtn]);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!checkFieldsFilled()) { setError("Sab fields fill karo please."); return; }
    if (!emailValid) { setError("Pehle valid email daalo."); return; }
    if (!phoneValid) { setError("Pehle valid phone number daalo."); return; }
    if (!turnstileVerified && showTurnstile) { setError("Human verification complete karo."); return; }

    setError("");
    setBtnState("submitting");

    const formData = new FormData(formRef.current);
    const payload = {
      _form_name: formName,
      source: source || window.location.pathname,
      turnstile_token: formData.get("cf-turnstile-response") || "",
    };

    formData.forEach((v, k) => {
      if (k !== "cf-turnstile-response" && k !== "_form_name") payload[k] = v;
    });

    if (payload.phone) payload.phone_formatted = formatPhoneDisplay(payload.phone);
    payload.device = getDeviceInfo();
    if (locationData) payload.location = locationData;

    trackEvent(`${formName}_submit`, {
      has_name: !!payload.name,
      has_phone: !!payload.phone,
      device_type: payload.device?.device_type,
      browser: payload.device?.browser,
    });

    try {
      await submitForm(payload);
      trackEvent(`${formName}_success`, { visitor_name: payload.name || "" });
    } catch {
      trackEvent(`${formName}_error`);
    } finally {
      setSubmitted(true);
      if (onSuccess) onSuccess(payload);
    }
  };

  return (
    <form ref={formRef} method="POST" noValidate onSubmit={handleSubmit} className={className}>
      <input type="hidden" name="_form_name" value={formName} />

      {/* Render children with injected handlers */}
      {typeof children === "function"
        ? children({
            handleEmailInput,
            handlePhoneInput,
            handlePhoneBlur,
            handleFieldInput,
            handleTypoFix,
            emailStatus,
            phoneStatus,
            error,
            btnState,
            btnText: txt[btnState],
            submitted,
          })
        : children
      }

      {showTurnstile && (
        <div
          className="cf-turnstile"
          data-sitekey={turnstileSiteKey}
          data-theme="dark"
          data-callback="onTurnstileSuccess"
          data-expired-callback="onTurnstileExpired"
          style={{ marginBottom: "1rem", display: "flex", justifyContent: "center" }}
        />
      )}

      {error && <div className={`error-msg ${error ? "show" : ""}`}>{error}</div>}

      <button
        type="submit"
        className="form-submit"
        disabled={btnState !== "ready"}
        dangerouslySetInnerHTML={{ __html: txt[btnState] }}
      />
    </form>
  );
}
