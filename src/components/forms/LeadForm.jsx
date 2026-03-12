"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { submitForm, getLocationInfo } from "@/lib/api";
import { validateEmailSync, validateEmailFull } from "@/lib/validation";
import { COUNTRY_CODES, findCountryByISO, cleanPhoneNumber, validatePhoneForCountry, formatPhoneForDisplay } from "@/lib/countries";
import { getFullFingerprint } from "@/lib/fingerprint";
import { trackEvent } from "@/lib/analytics";
import { FieldStatus } from "@/components/forms/FormFields";

/**
 * ONE universal lead capture form used on EVERY page.
 *
 * Fields (always present):
 *  - Name (required)
 *  - Email (required, with MX check)
 *  - Phone with auto-detected country code (required)
 *
 * Optional extra fields (passed as extraFields prop):
 *  - { name: "niche", label: "Your Instagram Niche", placeholder: "fitness, cooking..." }
 *  - { name: "city", label: "Your City", placeholder: "Mumbai, India" }
 *  - { name: "service", label: "What do you need?", type: "select", options: [...] }
 *  - { name: "message", label: "Tell me about your project", type: "textarea" }
 *
 * Hidden data captured automatically:
 *  - Device fingerprint (browser, OS, screen, GPU, canvas hash)
 *  - Location (IP, city, country, timezone, org)
 *  - Session info (pages visited, visit count, referrer)
 *  - Country code (auto-detected from IP)
 */

export default function LeadForm({
  formName,
  source,
  extraFields = [],
  btnTexts = {},
  onSuccess,
  showTurnstile = true,
  turnstileSiteKey = "0x4AAAAAACgSvRvZpT5d_Ab5",
}) {
  const formRef = useRef(null);
  const mxTimeoutRef = useRef(null);
  const phoneRef = useRef(null);

  // Core validation state
  const [emailValid, setEmailValid] = useState(false);
  const [phoneValid, setPhoneValid] = useState(false);
  const [turnstileVerified, setTurnstileVerified] = useState(false);
  const [emailStatus, setEmailStatus] = useState({ html: "", cls: "" });
  const [phoneStatus, setPhoneStatus] = useState({ html: "", cls: "" });
  const [error, setError] = useState("");
  const [btnState, setBtnState] = useState("fields");
  const [formStarted, setFormStarted] = useState(false);

  // Location + country
  const [locationData, setLocationData] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]); // Default India

  const txt = {
    ready: "Submit →",
    turnstile: "Verify you're human first ↑",
    email: "Enter a valid email first",
    phone: "Enter a valid phone number",
    fields: "Fill required fields first",
    submitting: "Sending...",
    ...btnTexts,
  };

  // ===== LOCATION: Auto-detect country from IP =====
  useEffect(() => {
    getLocationInfo().then((d) => {
      if (!d) return;
      setLocationData(d);

      // Auto-select country code
      if (d.country_code) {
        const country = findCountryByISO(d.country_code);
        setSelectedCountry(country);
      }

      // Auto-fill city if there's a city field
      if (formRef.current) {
        const cityInput = formRef.current.querySelector('[name="city"]');
        if (cityInput && !cityInput.value && d.city && d.country) {
          cityInput.value = `${d.city}, ${d.country}`;
          // Trigger React to notice the value
          cityInput.dispatchEvent(new Event("input", { bubbles: true }));
        }
      }
    });
  }, []);

  // ===== TURNSTILE =====
  useEffect(() => {
    if (!showTurnstile) { setTurnstileVerified(true); return; }
    window.onTurnstileSuccess = () => {
      setTurnstileVerified(true);
      trackEvent("turnstile_verified", { form_id: formName });
    };
    window.onTurnstileExpired = () => setTurnstileVerified(false);
  }, [formName, showTurnstile]);

  // ===== BUTTON STATE =====
  const getRequiredFields = useCallback(() => {
    const base = ["name", "email", "phone"];
    extraFields.forEach((f) => { if (f.required) base.push(f.name); });
    return base;
  }, [extraFields]);

  const checkFilled = useCallback(() => {
    if (!formRef.current) return false;
    return getRequiredFields().every((f) => {
      const el = formRef.current.querySelector(`[name="${f}"]`);
      return el && el.value && el.value.trim().length > 0;
    });
  }, [getRequiredFields]);

  const updateBtn = useCallback(() => {
    const filled = checkFilled();
    if (filled && emailValid && phoneValid && turnstileVerified) setBtnState("ready");
    else if (filled && emailValid && phoneValid && !turnstileVerified) setBtnState("turnstile");
    else if (!emailValid && formRef.current?.querySelector('[name="email"]')?.value?.trim()) setBtnState("email");
    else if (!phoneValid && formRef.current?.querySelector('[name="phone"]')?.value?.trim()) setBtnState("phone");
    else setBtnState("fields");
  }, [checkFilled, emailValid, phoneValid, turnstileVerified]);

  useEffect(() => { updateBtn(); }, [emailValid, phoneValid, turnstileVerified, updateBtn]);

  // ===== EMAIL HANDLING =====
  const handleEmailInput = useCallback((e) => {
    const val = e.target.value.trim();
    clearTimeout(mxTimeoutRef.current);
    if (!val) { setEmailValid(false); setEmailStatus({ html: "", cls: "" }); updateBtn(); return; }

    const r = validateEmailSync(val);
    if (!r.valid) {
      setEmailValid(false);
      setEmailStatus({ html: r.msg, cls: `email-${r.type}`, suggestion: r.suggestion });
      updateBtn();
      return;
    }

    setEmailValid(false);
    setEmailStatus({ html: '<span class="email-checking">⏳ Verifying domain...</span>', cls: "email-pending" });
    updateBtn();

    mxTimeoutRef.current = setTimeout(async () => {
      const result = await validateEmailFull(val);
      if (formRef.current?.querySelector('[name="email"]')?.value?.trim().toLowerCase() === val.toLowerCase()) {
        setEmailValid(result.valid);
        setEmailStatus({ html: result.msg, cls: result.valid ? "email-success" : "email-error" });
      }
    }, 600);
  }, [updateBtn]);

  const handleTypoFix = useCallback((suggestion) => {
    const input = formRef.current?.querySelector('[name="email"]');
    if (input) {
      input.value = suggestion;
      handleEmailInput({ target: input });
      input.focus();
      trackEvent("email_typo_fixed", { corrected_to: suggestion.split("@")[1] });
    }
  }, [handleEmailInput]);

  // ===== PHONE HANDLING — BULLETPROOF =====
  // On every keystroke/paste/autofill: strip everything except digits
  const handlePhoneKeyDown = useCallback((e) => {
    // Allow: backspace, delete, tab, escape, enter, arrows
    const allowed = [8, 9, 13, 27, 37, 38, 39, 40, 46];
    if (allowed.includes(e.keyCode)) return;
    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if ((e.ctrlKey || e.metaKey) && [65, 67, 86, 88].includes(e.keyCode)) return;
    // Block anything that's not a digit
    if (e.key && !/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  }, []);

  const handlePhoneInput = useCallback((e) => {
    // Force-clean: remove ALL non-digit chars (handles autofill, paste, etc.)
    const raw = e.target.value;
    const digits = cleanPhoneNumber(raw);

    // Update the input to show only digits
    if (raw !== digits) {
      e.target.value = digits;
    }

    if (!digits) { setPhoneValid(false); setPhoneStatus({ html: "", cls: "" }); updateBtn(); return; }

    const r = validatePhoneForCountry(digits, selectedCountry);
    setPhoneValid(r.valid);
    setPhoneStatus({ html: r.msg, cls: r.msg ? `phone-${r.type}` : "" });
    updateBtn();
  }, [selectedCountry, updateBtn]);

  const handlePhoneBlur = useCallback((e) => {
    const digits = cleanPhoneNumber(e.target.value);
    if (digits) {
      const r = validatePhoneForCountry(digits, selectedCountry);
      if (r.valid) {
        e.target.value = formatPhoneForDisplay(digits, selectedCountry).replace(selectedCountry.code + " ", "");
      }
      handlePhoneInput(e);
    }
  }, [selectedCountry, handlePhoneInput]);

  const handleCountryChange = useCallback((e) => {
    const country = COUNTRY_CODES.find((c) => c.code + "|" + c.iso === e.target.value) || COUNTRY_CODES[0];
    setSelectedCountry(country);
    // Re-validate current phone
    if (phoneRef.current?.value) {
      const digits = cleanPhoneNumber(phoneRef.current.value);
      const r = validatePhoneForCountry(digits, country);
      setPhoneValid(r.valid);
      setPhoneStatus({ html: r.msg, cls: r.msg ? `phone-${r.type}` : "" });
    }
  }, []);

  // ===== GENERIC FIELD CHANGE =====
  const handleFieldChange = useCallback(() => {
    if (!formStarted) { setFormStarted(true); trackEvent("form_start", { form_id: formName }); }
    updateBtn();
  }, [formStarted, formName, updateBtn]);

  // ===== SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!checkFilled()) { setError("Please fill all required fields."); return; }
    if (!emailValid) { setError("Please enter a valid email."); return; }
    if (!phoneValid) { setError("Please enter a valid phone number."); return; }
    if (!turnstileVerified && showTurnstile) { setError("Please verify you're human."); return; }

    setError("");
    setBtnState("submitting");

    // Build the mega payload
    const formData = new FormData(formRef.current);
    const payload = {
      _form_name: formName,
      source: source || window.location.pathname,
      turnstile_token: formData.get("cf-turnstile-response") || "",
    };

    // All visible fields
    formData.forEach((v, k) => {
      if (k !== "cf-turnstile-response" && k !== "_form_name" && k !== "country_selector") {
        payload[k] = v;
      }
    });

    // Phone: combine country code + digits
    const phoneDigits = cleanPhoneNumber(payload.phone || "");
    payload.phone_raw = phoneDigits;
    payload.country_code = selectedCountry.code;
    payload.phone_formatted = formatPhoneForDisplay(phoneDigits, selectedCountry);
    payload.phone_full = selectedCountry.code + phoneDigits;
    payload.phone_country = selectedCountry.name;

    // Location (captured on mount)
    if (locationData) payload.location = locationData;

    // Full device + session fingerprint
    payload.fingerprint = getFullFingerprint();

    trackEvent(`${formName}_submit`, {
      has_name: !!payload.name,
      has_phone: !!payload.phone,
      country: selectedCountry.iso,
      device_type: payload.fingerprint?.device?.device_type,
      browser: payload.fingerprint?.device?.browser,
    });

    try {
      await submitForm(payload);
      trackEvent(`${formName}_success`, { visitor_name: payload.name || "" });
    } catch {
      trackEvent(`${formName}_error`);
    } finally {
      if (onSuccess) onSuccess(payload);
    }
  };

  return (
    <form ref={formRef} method="POST" noValidate onSubmit={handleSubmit}>
      <input type="hidden" name="_form_name" value={formName} />

      {/* NAME */}
      <div className="form-group">
        <label htmlFor={`${formName}-name`}>Your Name *</label>
        <input type="text" id={`${formName}-name`} name="name" placeholder="Rahul Sharma" required autoComplete="name" onChange={handleFieldChange} />
      </div>

      {/* EMAIL */}
      <div className="form-group">
        <label htmlFor={`${formName}-email`}>Email *</label>
        <input type="email" id={`${formName}-email`} name="email" placeholder="rahul@gmail.com" required autoComplete="email" onInput={handleEmailInput} onChange={handleFieldChange} />
        <FieldStatus html={emailStatus.html} cls={emailStatus.cls} />
        {emailStatus.suggestion && (
          <button type="button" className="typo-fix-btn" onClick={() => handleTypoFix(emailStatus.suggestion)}>Fix it</button>
        )}
      </div>

      {/* PHONE with Country Code */}
      <div className="form-group">
        <label htmlFor={`${formName}-phone`}>Phone *</label>
        <div style={{ display: "flex", gap: ".5rem" }}>
          <select
            name="country_selector"
            value={selectedCountry.code + "|" + selectedCountry.iso}
            onChange={handleCountryChange}
            style={{
              width: 120, flexShrink: 0, padding: ".85rem .5rem",
              background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10,
              color: "var(--text)", fontFamily: "var(--sans)", fontSize: ".82rem",
              outline: "none", cursor: "pointer",
            }}
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.code + "|" + c.iso} value={c.code + "|" + c.iso}>
                {c.flag} {c.code}
              </option>
            ))}
          </select>
          <input
            ref={phoneRef}
            type="tel"
            id={`${formName}-phone`}
            name="phone"
            placeholder="98765 43210"
            required
            autoComplete="tel-national"
            inputMode="numeric"
            pattern="[0-9]*"
            onKeyDown={handlePhoneKeyDown}
            onInput={handlePhoneInput}
            onBlur={handlePhoneBlur}
            onChange={handleFieldChange}
            style={{ flex: 1 }}
          />
        </div>
        <FieldStatus html={phoneStatus.html} cls={phoneStatus.cls} />
      </div>

      {/* EXTRA FIELDS (page-specific) */}
      {extraFields.map((field) => (
        <div className="form-group" key={field.name}>
          <label htmlFor={`${formName}-${field.name}`}>{field.label}{field.required ? " *" : ""}</label>
          {field.type === "textarea" ? (
            <textarea
              id={`${formName}-${field.name}`}
              name={field.name}
              placeholder={field.placeholder}
              required={field.required}
              onChange={handleFieldChange}
            />
          ) : field.type === "select" ? (
            <select
              id={`${formName}-${field.name}`}
              name={field.name}
              required={field.required}
              onChange={(e) => { handleFieldChange(); if (e.target.value) trackEvent("form_field_selected", { field: field.name, value: e.target.value }); }}
            >
              <option value="">{field.placeholder || "Select..."}</option>
              {(field.options || []).map((opt) => (
                <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>
              ))}
            </select>
          ) : (
            <input
              type={field.type || "text"}
              id={`${formName}-${field.name}`}
              name={field.name}
              placeholder={field.placeholder}
              required={field.required}
              onChange={handleFieldChange}
            />
          )}
        </div>
      ))}

      {/* TURNSTILE */}
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

      {/* ERROR */}
      {error && <div className="error-msg show">{error}</div>}

      {/* SUBMIT */}
      <button
        type="submit"
        className="form-submit"
        disabled={btnState !== "ready"}
        dangerouslySetInnerHTML={{ __html: txt[btnState] }}
      />

      <p className="form-note" style={{ marginTop: ".75rem" }}>🔒 Your info is safe. No spam, ever.</p>
    </form>
  );
}
