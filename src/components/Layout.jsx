import React from 'react';

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {children}
      </div>
    </div>
  );
}
