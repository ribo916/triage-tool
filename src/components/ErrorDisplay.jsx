import React from 'react';

export default function ErrorDisplay({ error }) {
  if (!error) return null;

  return (
    <div style={{
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '24px',
    }}>
      <h3 style={{ fontWeight: '600', color: '#991b1b', marginBottom: '8px' }}>
        Error {error.status != null && `(${error.status})`}
      </h3>
      <pre style={{
        backgroundColor: '#7f1d1d',
        color: '#fecaca',
        padding: '16px',
        borderRadius: '6px',
        overflow: 'auto',
        fontSize: '12px',
      }}>
        {JSON.stringify(error, null, 2)}
      </pre>
    </div>
  );
}
