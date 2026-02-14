import React from 'react';

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f4f5', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {children}
      </div>
    </div>
  );
}
