"use client";

/**
 * Reusable form field components.
 * Used across all pages for consistency.
 */

export function FormInput({ label, id, name, type = "text", placeholder, required, onChange, ...props }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}{required && " *"}</label>
      <input type={type} id={id} name={name || id} placeholder={placeholder} required={required} onChange={onChange} {...props} />
    </div>
  );
}

export function FormTextarea({ label, id, name, placeholder, required, onChange, ...props }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}{required && " *"}</label>
      <textarea id={id} name={name || id} placeholder={placeholder} required={required} onChange={onChange} {...props} />
    </div>
  );
}

export function FormSelect({ label, id, name, options = [], placeholder, required, onChange, ...props }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <select id={id} name={name || id} required={required} onChange={onChange} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

export function FieldStatus({ html, cls }) {
  if (!html) return null;
  return (
    <div
      className={`field-status ${cls || ""}`}
      style={{ display: html ? "block" : "none" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function FormRow({ children }) {
  return <div className="form-row">{children}</div>;
}

export function FormNote({ children }) {
  return <p className="form-note">{children}</p>;
}
