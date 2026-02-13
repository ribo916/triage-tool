import React from 'react';
import SectionContainer from './SectionContainer.jsx';
import { DetailGrid, DetailSection, DetailRow } from './details/DetailPrimitives.jsx';

export default function LoanSection({ attempted, loan, error }) {
  // ✅ Only show the section if we actually attempted GetLoan this run
  if (!attempted) return null;

  return (
    <SectionContainer title="Loan Snapshot">
      {error && (
        <>
          <p style={{ color: '#b91c1c', fontSize: '14px', marginTop: '8px' }}>
            Failed to load loan
          </p>

          {/* Show structured API error payload cleanly */}
          <pre style={{ marginTop: '8px', fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(error, null, 2)}
          </pre>
        </>
      )}

      {!error && !loan && (
        <p style={{ fontSize: '12px', color: '#6b7280' }}>
          No loan data returned.
        </p>
      )}

      {!error && loan && (() => {
        const { borrower, property, loanofficer } = loan;

        return (
          <DetailGrid>
            <div>
              <DetailSection title="Loan details">
                <DetailRow label="Loan number" value={loan.loanNumber} />
                <DetailRow label="LOS loan ID" value={loan.losLoanId} />
                <DetailRow label="Purpose" value={loan.purpose} />
                <DetailRow label="Amount" value={loan.amount} />
                <DetailRow label="Rate" value={loan.rate} />
                <DetailRow label="Product" value={`${loan.productName} (${loan.productCode})`} />
                <DetailRow label="Term" value={loan.loanTerm} />
                <DetailRow label="Type" value={loan.loanType} />
                <DetailRow label="Amortization" value={loan.amortizationType} />
                <DetailRow label="LTV / CLTV" value={`${loan.ltv} / ${loan.cltv}`} />
                <DetailRow label="Application date" value={loan.applicationDate} />
              </DetailSection>

              <DetailSection title="Borrower">
                <DetailRow label="Name" value={`${borrower.firstName} ${borrower.lastName}`} />
                <DetailRow label="FICO" value={borrower.fico} />
                <DetailRow label="DTI ratio" value={borrower.dtiRatio} />
              </DetailSection>
            </div>

            <div>
              <DetailSection title="Property">
                <DetailRow
                  label="Address"
                  value={`${property.addressLine1}, ${property.city}, ${property.state} ${property.zipCode}`}
                />
                <DetailRow label="Type" value={property.propertyType} />
                <DetailRow label="Occupancy" value={property.occupancy} />
                <DetailRow label="Appraised value" value={property.appraisedValue} />
              </DetailSection>

              <DetailSection title="Loan officer">
                <DetailRow label="Name" value={loanofficer.name} />
                <DetailRow label="Email" value={loanofficer.email} />
              </DetailSection>
            </div>
          </DetailGrid>
        );
      })()}
    </SectionContainer>
  );
}
