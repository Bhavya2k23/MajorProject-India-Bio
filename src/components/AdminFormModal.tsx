// ============================================================
// FILE: india-s-wild-explorer/src/components/AdminFormModal.tsx  ← NEW FILE
// Reusable modal form used across all admin managers
// ============================================================
import React, { useEffect, useRef } from 'react';

interface Props {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  submitLabel?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function AdminFormModal({
  isOpen, title, onClose, onSubmit, loading = false,
  submitLabel = 'Save', children, size = 'md',
}: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widths = { sm: 420, md: 580, lg: 720, xl: 900 };

  return (
    <div
      ref={overlayRef}
      style={styles.overlay}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div style={{ ...styles.modal, maxWidth: widths[size] }}>
        {/* Modal Header */}
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>{title}</h3>
          <button style={styles.closeBtn} onClick={onClose} disabled={loading}>✕</button>
        </div>

        {/* Modal Body */}
        <form onSubmit={onSubmit} style={styles.form}>
          <div style={styles.formBody}>{children}</div>

          {/* Footer */}
          <div style={styles.footer}>
            <button type="button" style={styles.cancelBtn} onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={styles.spinner} />
                  Saving...
                </span>
              ) : submitLabel}
            </button>
          </div>
        </form>
      </div>
      <style>{spinStyle}</style>
    </div>
  );
}

// ─── Field Components for convenience ────────────────────────────────────────

export function FormRow({ children, cols = 1 }: { children: React.ReactNode; cols?: 1 | 2 | 3 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 14 }}>
      {children}
    </div>
  );
}

export function FormField({
  label, required, children, hint,
}: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={fieldStyles.label}>
        {label}
        {required && <span style={{ color: '#f87171', marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {hint && <span style={fieldStyles.hint}>{hint}</span>}
    </div>
  );
}

export function FormInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{ ...fieldStyles.input, ...(props.style || {}) }} />;
}

export function FormTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} style={{ ...fieldStyles.textarea, ...(props.style || {}) }} rows={props.rows ?? 3} />;
}

export function FormSelect(props: React.SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[] }) {
  const { options, ...rest } = props;
  return (
    <select {...rest} style={{ ...fieldStyles.select, ...(props.style || {}) }}>
      <option value="">-- Select --</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}

const fieldStyles: Record<string, React.CSSProperties> = {
  label: { color: 'rgba(134,239,172,0.8)', fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' },
  hint: { color: 'rgba(134,239,172,0.4)', fontSize: 11 },
  input: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 9, padding: '9px 12px', color: '#e8f5e9', fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit' },
  textarea: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 9, padding: '9px 12px', color: '#e8f5e9', fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' },
  select: { background: 'rgba(10,22,40,0.95)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 9, padding: '9px 12px', color: '#e8f5e9', fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box', cursor: 'pointer' },
};

const styles: Record<string, React.CSSProperties> = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16, backdropFilter: 'blur(4px)' },
  modal: { background: 'linear-gradient(135deg, #0a1f14 0%, #0a1628 100%)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 20, width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 60px rgba(0,0,0,0.6)' },
  modalHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 16px', borderBottom: '1px solid rgba(34,197,94,0.1)', flexShrink: 0 },
  modalTitle: { color: '#e8f5e9', fontSize: 18, fontWeight: 800, margin: 0, fontFamily: "'Georgia', serif" },
  closeBtn: { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: 'rgba(134,239,172,0.7)', width: 30, height: 30, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, flexShrink: 0 },
  form: { display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' },
  formBody: { padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 },
  footer: { padding: '16px 24px', borderTop: '1px solid rgba(34,197,94,0.1)', display: 'flex', gap: 12, justifyContent: 'flex-end', flexShrink: 0 },
  cancelBtn: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '9px 20px', color: '#e8f5e9', cursor: 'pointer', fontSize: 14, fontWeight: 600 },
  submitBtn: { background: 'linear-gradient(135deg, #16a34a, #059669)', border: 'none', borderRadius: 10, padding: '9px 22px', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 700, minWidth: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  spinner: { display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' },
};

const spinStyle = `@keyframes spin { to { transform: rotate(360deg); } }`;