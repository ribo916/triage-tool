import React, { useState, useEffect } from 'react';
import SectionContainer from './SectionContainer.jsx';
import { DetailGrid, DetailSection, DetailRow } from './details/DetailPrimitives.jsx';
import { ChevronDown, ChevronRight } from 'lucide-react';

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 0',
  cursor: 'pointer',
  borderBottom: '1px solid #f3f4f6',
  fontSize: '13px',
  fontWeight: '500',
  color: '#1f2937',
};

const badgeStyle = (kind) => {
  if (kind === 'decision-auto') {
    return {
      fontSize: '10px',
      fontWeight: '600',
      padding: '2px 6px',
      borderRadius: '4px',
      backgroundColor: '#d1fae5',
      color: '#065f46',
    };
  }
  if (kind === 'decision-manual') {
    return {
      fontSize: '10px',
      fontWeight: '600',
      padding: '2px 6px',
      borderRadius: '4px',
      backgroundColor: '#fee2e2',
      color: '#991b1b',
    };
  }
  return {
    fontSize: '10px',
    fontWeight: '600',
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
  };
};

const bodyStyle = {
  padding: '8px 0 8px 20px',
  fontSize: '12px',
  color: '#4b5563',
  lineHeight: 1.5,
};

function formatDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  return d.toLocaleString();
}

function formatNumber(value) {
  if (value == null || value === '') return '—';
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return n.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

function LockAccordionItem({ lock, pricing, isOpen, onToggle }) {
  const auto = lock.approvalMode === 'AUTO_APPROVAL' || lock.decision === 'AUTO_APPROVED';

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        style={{
          ...headerStyle,
          width: '100%',
          textAlign: 'left',
          background: 'none',
          border: 'none',
          font: 'inherit',
        }}
      >
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {lock.action} • {formatDate(lock.requestedOn)} • {lock.buySide.productName}
        </span>
        <span style={badgeStyle(auto ? 'decision-auto' : 'decision-manual')}>
          {lock.decision || 'UNKNOWN'}
        </span>
      </button>

      {isOpen && (
        <div style={bodyStyle}>
          <DetailGrid>
            <div>
              <DetailSection title="Lock details">
                <DetailRow label="Lock ID" value={lock.id} />
                <DetailRow label="Requested on" value={formatDate(lock.requestedOn)} />
                <DetailRow label="Requested by" value={lock.requestedBy} />
                <DetailRow label="Username" value={lock.requestedByUsername} />
                <DetailRow label="Action" value={lock.action} />
                <DetailRow label="Decision" value={lock.decision} />
                <DetailRow label="Approval mode" value={lock.approvalMode} />
                <DetailRow label="Write-back status" value={lock.writeBackStatus} />
                <DetailRow label="Auto triggered" value={lock.isAutoTriggered ? 'Yes' : 'No'} />
              </DetailSection>

              <DetailSection title="Buy side (pricing snapshot)">
                <DetailRow label="PE request ID" value={lock.buySide.peRequestId} />
                <DetailRow label="Changeset ID" value={lock.buySide.changesetId} />
                <DetailRow label="Channel" value={lock.buySide.channel} />
                <DetailRow label="Investor" value={lock.buySide.investor} />
                <DetailRow label="Product" value={lock.buySide.productName} />
                <DetailRow label="Product code" value={lock.buySide.productCode} />
                <DetailRow label="Rate" value={lock.buySide.rate} />
                <DetailRow label="Lock period (days)" value={lock.buySide.lockPeriod} />
                <DetailRow label="Expiration" value={formatDate(lock.buySide.expirationDate)} />
                <DetailRow label="Lock confirmed" value={formatDate(lock.buySide.lockConfirmedDate)} />
                <DetailRow label="Base price" value={lock.buySide.basePrice} />
                <DetailRow label="Net price" value={lock.buySide.netPrice} />
              </DetailSection>
            </div>

            <div>
              <DetailSection title="Pricing scenario summary">
                {!pricing && (
                  <DetailRow label="Status" value="Pricing details unavailable" />
                )}
                {pricing && (
                  <>
                    <DetailRow label="Base rate set ID" value={pricing.baseRateSetId} />
                    <DetailRow label="Changeset ID" value={pricing.changesetId} />
                    <DetailRow label="Requested on" value={formatDate(pricing.requestedOn)} />
                    <DetailRow label="Completed on" value={formatDate(pricing.completedOn)} />
                    <DetailRow
                      label="Borrower"
                      value={`${pricing.borrower.firstName} ${pricing.borrower.lastName}`.trim()}
                    />
                    <DetailRow label="FICO" value={pricing.borrower.fico} />
                    <DetailRow label="DTI ratio" value={formatNumber(pricing.borrower.dtiRatio)} />
                    <DetailRow
                      label="Annual income"
                      value={pricing.borrower.annualIncome != null
                        ? `$${formatNumber(pricing.borrower.annualIncome)}`
                        : '—'}
                    />
                    <DetailRow label="Loan amount" value={pricing.loan.amount != null
                      ? `$${formatNumber(pricing.loan.amount)}`
                      : '—'}
                    />
                    <DetailRow label="Purpose" value={pricing.loan.purpose} />
                    <DetailRow label="Refinance purpose" value={pricing.loan.refinancePurpose} />
                    <DetailRow
                      label="LTV / CLTV"
                      value={`${formatNumber(pricing.loan.ltv)} / ${formatNumber(pricing.loan.cltv)}`}
                    />
                    <DetailRow
                      label="Property"
                      value={`${pricing.property.addressLine1}, ${pricing.property.city}, ${pricing.property.state} ${pricing.property.zipCode}`}
                    />
                    <DetailRow label="Occupancy" value={pricing.property.occupancy} />
                    <DetailRow
                      label="Appraised value"
                      value={pricing.property.appraisedValue != null
                        ? `$${formatNumber(pricing.property.appraisedValue)}`
                        : '—'}
                    />
                    <DetailRow
                      label="Search: lock period"
                      value={pricing.search.desiredLockPeriod}
                    />
                    <DetailRow
                      label="Search: product codes"
                      value={pricing.search.productCodes.join(', ')}
                    />
                    <DetailRow
                      label="Search: loan types"
                      value={pricing.search.loanTypes.join(', ')}
                    />
                  </>
                )}
              </DetailSection>
            </div>
          </DetailGrid>
        </div>
      )}
    </div>
  );
}

export default function LockRequestsSection({
  attempted,
  locks,
  pricingByPeRequestId,
  error,
  loading,
}) {
  const hasLocks = Array.isArray(locks) && locks.length > 0;

  const [openId, setOpenId] = useState(null);

  // Reset accordion state when new data arrives (new analysis)
  useEffect(() => {
    setOpenId(null);
  }, [locks]);

  if (!attempted) return null;

  return (
    <SectionContainer title="Lock Requests">
      {error && (
        <div
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            padding: '8px 12px',
            marginBottom: '12px',
            fontSize: '12px',
            color: '#991b1b',
          }}
        >
          Failed to load lock requests
        </div>
      )}

      {loading && (
        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
          Loading lock requests...
        </div>
      )}

      {!loading && !error && !hasLocks && (
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          No lock requests for this loan.
        </div>
      )}

      {hasLocks && (
        <div>
          {locks.map((lock) => (
            <LockAccordionItem
              key={lock.id}
              lock={lock}
              pricing={pricingByPeRequestId?.[lock.buySide.peRequestId] ?? null}
              isOpen={openId === lock.id}
              onToggle={() => setOpenId(openId === lock.id ? null : lock.id)}
            />
          ))}
        </div>
      )}
    </SectionContainer>
  );
}

