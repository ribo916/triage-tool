import React from 'react';

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize: '14px',
};
const labelStyle = { display: 'block', fontWeight: '600', marginBottom: '8px' };
const checkboxRowStyle = { display: 'flex', alignItems: 'center', gap: '8px' };

export default function TriageForm({
  bearerToken,
  onBearerTokenChange,
  environment,
  onEnvironmentChange,
  losLoanId,
  onLosLoanIdChange,
  hasLoanService,
  onHasLoanServiceChange,
  onSubmit,
  loading,
}) {
  const disabled = loading || !bearerToken;

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={labelStyle}>Bearer Token</label>
          <input
            type="password"
            value={bearerToken}
            onChange={(e) => onBearerTokenChange(e.target.value)}
            style={inputStyle}
            placeholder="Enter bearer token"
            required
          />
        </div>
        <div>
          <label style={labelStyle}>Environment</label>
          <select
            value={environment}
            onChange={(e) => onEnvironmentChange(e.target.value)}
            style={inputStyle}
          >
            <option value="stage">Stage</option>
            <option value="prod">Production</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>losLoanId</label>
          <input
            type="text"
            value={losLoanId}
            onChange={(e) => onLosLoanIdChange(e.target.value)}
            style={inputStyle}
            placeholder="e.g. TESTREFI_12345"
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '2px' }}>
          <div style={checkboxRowStyle}>
            <input
              type="checkbox"
              id="hasLoanService"
              checked={hasLoanService}
              onChange={(e) => onHasLoanServiceChange(e.target.checked)}
            />
            <label htmlFor="hasLoanService" style={{ fontWeight: '500', cursor: 'pointer' }}>hasLoanService</label>
          </div>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={disabled}
        style={{
          width: '100%',
          backgroundColor: disabled ? '#9ca3af' : '#2563eb',
          color: 'white',
          padding: '10px 16px',
          borderRadius: '6px',
          border: 'none',
          fontSize: '16px',
          fontWeight: '600',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
    </div>
  );
}
