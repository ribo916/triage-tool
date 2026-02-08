import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const sectionStyle = {
  backgroundColor: 'white',
  borderRadius: '8px',
  padding: '16px 20px',
  marginBottom: '24px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  border: '2px solid #d1d5db',
};

const sectionTitleStyle = { fontSize: '18px', fontWeight: '600' };
const sectionHeaderStyle = {
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

const subsectionStyle = { marginBottom: '16px' };
const titleStyle = { fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' };
const rowStyle = { fontSize: '13px', color: '#4b5563', marginBottom: '4px' };

export default function LoanSection({ loan, error }) {
  const [sectionOpen, setSectionOpen] = useState(true);

  if (error) {
    return (
      <div style={sectionStyle}>
        <button
          type="button"
          onClick={() => setSectionOpen((v) => !v)}
          style={sectionHeaderStyle}
        >
          {sectionOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          <span style={sectionTitleStyle}>Loan</span>
        </button>
        {sectionOpen && (
          <>
            <p style={{ color: '#b91c1c', fontSize: '14px', marginTop: '8px' }}>Failed to load loan</p>
            <pre style={{ marginTop: '8px', fontSize: '12px', overflow: 'auto' }}>{JSON.stringify(error, null, 2)}</pre>
          </>
        )}
      </div>
    );
  }

  if (!loan) return null;

  const { borrower, property, loanofficer } = loan;

  return (
    <div style={sectionStyle}>
      <button
        type="button"
        onClick={() => setSectionOpen((v) => !v)}
        style={sectionHeaderStyle}
      >
        {sectionOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        <span style={sectionTitleStyle}>Loan</span>
      </button>
      {sectionOpen && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '8px' }}>
          <div>
            <div style={subsectionStyle}>
              <div style={titleStyle}>Loan details</div>
              <div style={rowStyle}><strong>Loan number:</strong> {loan.loanNumber}</div>
              <div style={rowStyle}><strong>LOS loan ID:</strong> {loan.losLoanId}</div>
              <div style={rowStyle}><strong>Purpose:</strong> {loan.purpose}</div>
              <div style={rowStyle}><strong>Amount:</strong> {loan.amount}</div>
              <div style={rowStyle}><strong>Rate:</strong> {loan.rate}</div>
              <div style={rowStyle}><strong>Product:</strong> {loan.productName} ({loan.productCode})</div>
              <div style={rowStyle}><strong>Term:</strong> {loan.loanTerm ?? '—'}</div>
              <div style={rowStyle}><strong>Type:</strong> {loan.loanType}</div>
              <div style={rowStyle}><strong>Amortization:</strong> {loan.amortizationType}</div>
              <div style={rowStyle}><strong>LTV / CLTV:</strong> {loan.ltv} / {loan.cltv}</div>
              <div style={rowStyle}><strong>Application date:</strong> {loan.applicationDate}</div>              
            </div>
            <div style={subsectionStyle}>
              <div style={titleStyle}>Borrower</div>
              <div style={rowStyle}><strong>Name:</strong> {borrower.firstName} {borrower.lastName}</div>
              <div style={rowStyle}><strong>FICO:</strong> {borrower.fico ?? '—'}</div>
              <div style={rowStyle}><strong>DTI ratio:</strong> {borrower.dtiRatio}</div>
            </div>
          </div>
          <div>
            <div style={subsectionStyle}>
              <div style={titleStyle}>Property</div>
              <div style={rowStyle}><strong>Address:</strong> {property.addressLine1}, {property.city}, {property.state} {property.zipCode}</div>
              <div style={rowStyle}><strong>Type:</strong> {property.propertyType}</div>
              <div style={rowStyle}><strong>Occupancy:</strong> {property.occupancy}</div>
              <div style={rowStyle}><strong>Appraised value:</strong> {property.appraisedValue}</div>
            </div>
            <div style={subsectionStyle}>
              <div style={titleStyle}>Loan officer</div>
              <div style={rowStyle}><strong>Name:</strong> {loanofficer.name}</div>
              <div style={rowStyle}><strong>Email:</strong> {loanofficer.email}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
