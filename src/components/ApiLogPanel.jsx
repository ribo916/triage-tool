import React, { useState } from 'react';
import { useApiLog } from '../hooks/useApiLog.js';

const buttonStyle = {
  position: 'fixed',
  bottom: '16px',
  right: '16px',
  zIndex: 1000,
  padding: '8px 14px',
  fontSize: '12px',
  fontWeight: '600',
  backgroundColor: '#374151',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
};

const panelStyle = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 999,
  maxHeight: '220px',
  backgroundColor: '#1f2937',
  color: '#e5e7eb',
  borderTop: '1px solid #374151',
  overflow: 'auto',
  padding: '12px 16px',
  fontSize: '12px',
  fontFamily: 'monospace',
};

const lineStyle = {
  padding: '4px 0',
  borderBottom: '1px solid #374151',
  display: 'flex',
  gap: '12px',
  flexWrap: 'wrap',
};

function formatUrl(url) {
  try {
    const u = new URL(url);
    return u.pathname + u.search;
  } catch {
    return url;
  }
}

function formatTimestamp(isoString) {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString();
  } catch {
    return isoString;
  }
}

export default function ApiLogPanel() {
  const [open, setOpen] = useState(false);
  const entries = useApiLog();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={buttonStyle}
      >
        {open ? 'Hide API log' : 'API log'}
      </button>
      {open && (
        <div style={panelStyle}>
          {entries.length === 0 ? (
            <div style={{ color: '#9ca3af' }}>No API calls yet</div>
          ) : (
            entries.map((e) => (
              <div key={e.id} style={lineStyle}>
                <span style={{ flexShrink: 0 }}>{formatTimestamp(e.timestamp)}</span>
                <span>{e.method}</span>
                <span style={{ wordBreak: 'break-all' }}>{formatUrl(e.url)}</span>
                <span>{e.status}</span>
                <span>{e.durationMs}ms</span>
                {e.error != null && <span style={{ color: '#fca5a5' }}>{e.error}</span>}
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}
