import React from 'react';

export const sectionStyle = { marginBottom: '16px' };

export const sectionTitleStyle = {
  fontSize: '13px',
  fontWeight: '600',
  color: '#374151',
  marginBottom: '8px',
  padding: '6px 10px',
  backgroundColor: '#f3f4f6',
  borderRadius: '4px',
  borderLeft: '3px solid #d1d5db',
};

export const rowStyle = {
  fontSize: '13px',
  color: '#4b5563',
  marginBottom: '4px',
};

export function DetailGrid({ children }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
      }}
    >
      {children}
    </div>
  );
}

export function DetailSection({ title, children }) {
  return (
    <div style={sectionStyle}>
      <div style={sectionTitleStyle}>{title}</div>
      {children}
    </div>
  );
}

export function DetailRow({ label, value }) {
  return (
    <div style={rowStyle}>
      <strong>{label}:</strong> {value ?? '—'}
    </div>
  );
}
