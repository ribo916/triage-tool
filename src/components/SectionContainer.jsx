import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const ACCENT = '#4f46e5';

const containerStyle = {
  backgroundColor: 'white',
  borderRadius: '8px',
  padding: '16px 20px',
  marginBottom: '24px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  border: '1px solid #e5e7eb',
  minWidth: 0,
};

const titleStyle = { fontSize: '18px', fontWeight: '600' };

const headerButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  cursor: 'pointer',
  padding: '8px 0',
  border: 'none',
  background: 'none',
  width: '100%',
  textAlign: 'left',
  font: 'inherit',
  color: 'inherit',
};

const iconWrapStyle = { color: ACCENT, flexShrink: 0, display: 'flex', alignItems: 'center' };

export default function SectionContainer({
  title,
  initiallyOpen = true,
  children,
  style,
  headerRight,
  icon,
}) {
  const [open, setOpen] = useState(initiallyOpen);

  const finalContainerStyle = {
    ...containerStyle,
    ...(style ?? {}),
    ...(icon ? { borderLeft: `3px solid ${ACCENT}` } : {}),
  };

  return (
    <div style={finalContainerStyle}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={headerButtonStyle}
      >
        {open ? <ChevronDown size={20} color="#6b7280" /> : <ChevronRight size={20} color="#6b7280" />}
        {icon && <span style={iconWrapStyle}>{icon}</span>}
        <span style={titleStyle}>{title}</span>
        <span style={{ marginLeft: 'auto' }}>{headerRight ?? null}</span>
      </button>

      {open && <div style={{ marginTop: '8px' }}>{children}</div>}
    </div>
  );
}
