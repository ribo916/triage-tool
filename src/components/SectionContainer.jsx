import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const containerStyle = {
  backgroundColor: 'white',
  borderRadius: '8px',
  padding: '16px 20px',
  marginBottom: '24px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  border: '2px solid #d1d5db',
  minWidth: 0,
};

const titleStyle = { fontSize: '18px', fontWeight: '600' };

const headerButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  padding: '8px 0',
  border: 'none',
  background: 'none',
  width: '100%',
  textAlign: 'left',
  font: 'inherit',
  color: 'inherit',
};

export default function SectionContainer({
  title,
  initiallyOpen = true,
  children,
  style,
  headerRight,
}) {
  const [open, setOpen] = useState(initiallyOpen);

  return (
    <div style={{ ...containerStyle, ...(style ?? {}) }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={headerButtonStyle}
      >
        {open ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        <span style={titleStyle}>{title}</span>
        <span style={{ marginLeft: 'auto' }}>{headerRight ?? null}</span>
      </button>

      {open && <div style={{ marginTop: '8px' }}>{children}</div>}
    </div>
  );
}
