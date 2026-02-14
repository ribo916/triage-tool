import React from 'react';
import { Search } from 'lucide-react';

const ACCENT = '#4f46e5';
const ACCENT_HOVER = '#4338ca';

const inputStyle = {
  padding: '8px 12px',
  border: '1px solid #e5e7eb',
  borderRadius: '6px',
  fontSize: '14px',
};
const rowGap = 12;
const checkboxRowStyle = { display: 'flex', alignItems: 'center', gap: '8px' };
const srOnly = { position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 };
const buttonStyle = {
  backgroundColor: undefined,
  color: 'white',
  padding: '10px 16px',
  borderRadius: '6px',
  border: 'none',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  flexShrink: 0,
  transition: 'background-color 0.15s ease',
};

export default function TriageForm({
  bearerToken,
  onBearerTokenChange,
  environment,
  onEnvironmentChange,
  losLoanId,
  onLosLoanIdChange,
  hasLoanService,
  onHasLoanServiceChange,
  changeSet,
  onChangeSetChange,
  onSubmit,
  loading,
}) {
  const disabled = loading || !bearerToken;

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '16px 20px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      border: '1px solid #e5e7eb',
    }}>
      {/* Row 1 — Auth (compact) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: rowGap, marginBottom: rowGap }}>
        <label htmlFor="bearerToken" style={srOnly}>Bearer token</label>
        <input
          type="password"
          id="bearerToken"
          value={bearerToken}
          onChange={(e) => onBearerTokenChange(e.target.value)}
          style={{ ...inputStyle, flex: 1, minWidth: 0 }}
          placeholder="Bearer token"
          required
        />
        <label htmlFor="environment" style={{ fontWeight: '500', flexShrink: 0, fontSize: '14px' }}>Env:</label>
        <select
          id="environment"
          value={environment}
          onChange={(e) => onEnvironmentChange(e.target.value)}
          style={{ ...inputStyle, width: '110px', flexShrink: 0 }}
        >
          <option value="stage">Stage</option>
          <option value="prod">Production</option>
        </select>
      </div>

      {/* Row 2 — What to analyze */}
      <div style={{ display: 'flex', alignItems: 'center', gap: rowGap, flexWrap: 'wrap' }}>
        <label htmlFor="losLoanId" style={srOnly}>LOS Loan ID</label>
        <input
          type="text"
          id="losLoanId"
          value={losLoanId}
          onChange={(e) => onLosLoanIdChange(e.target.value)}
          style={{ ...inputStyle, flex: '1 1 200px', minWidth: 0 }}
          placeholder="LOS Loan ID (optional)"
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: '500', fontSize: '14px', color: '#374151' }}>Include:</span>
          <div style={checkboxRowStyle}>
            <input
              type="checkbox"
              id="loanService"
              checked={hasLoanService}
              onChange={(e) => onHasLoanServiceChange(e.target.checked)}
            />
            <label htmlFor="loanService" style={{ fontWeight: '500', cursor: 'pointer', fontSize: '14px' }}>LoanService</label>
          </div>
          <div style={checkboxRowStyle}>
            <input
              type="checkbox"
              id="changeSet"
              checked={changeSet}
              onChange={(e) => onChangeSetChange(e.target.checked)}
            />
            <label htmlFor="changeSet" style={{ fontWeight: '500', cursor: 'pointer', fontSize: '14px' }}>ChangeSet</label>
          </div>
        </div>
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled}
          style={{
            ...buttonStyle,
            backgroundColor: disabled ? '#9ca3af' : ACCENT,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={(e) => {
            if (!disabled) e.currentTarget.style.backgroundColor = ACCENT_HOVER;
          }}
          onMouseLeave={(e) => {
            if (!disabled) e.currentTarget.style.backgroundColor = ACCENT;
          }}
        >
          {loading ? 'Analyzing...' : (
            <>
              <Search size={18} />
              Analyze
            </>
          )}
        </button>
      </div>
    </div>
  );
}
