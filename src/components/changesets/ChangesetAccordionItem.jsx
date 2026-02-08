import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const accordionHeaderStyle = {
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

const badgeStyle = (active) => ({
  fontSize: '10px',
  fontWeight: '600',
  padding: '2px 6px',
  borderRadius: '4px',
  backgroundColor: active ? '#d1fae5' : '#f3f4f6',
  color: active ? '#065f46' : '#6b7280',
});

const bodyStyle = {
  padding: '8px 0 8px 20px',
  fontSize: '12px',
  color: '#4b5563',
  lineHeight: 1.5,
};

const rowStyle = { marginBottom: '4px' };

const highlightStyle = {
  backgroundColor: 'rgba(253, 224, 71, 0.45)',
  padding: '2px 6px',
  borderRadius: '2px',
};

export default function ChangesetAccordionItem({
  changeset,
  ratesByChangesetId,
  isOpen,
  onToggle,
}) {
  const { id, name, details, versionInfo } = changeset;
  const isActive = details.status === 'Active';

  const rateData = ratesByChangesetId?.[id];
  const primaryItem = rateData?.items?.[0];
  const baseRateSetId = primaryItem?.baseRateSetId ?? primaryItem?.id ?? '—';

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        style={{
          ...accordionHeaderStyle,
          width: '100%',
          textAlign: 'left',
          background: 'none',
          border: 'none',
          font: 'inherit',
        }}
      >
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {name}
        </span>
        <span style={badgeStyle(isActive)}>{details.status}</span>
      </button>

      {isOpen && (
        <div style={bodyStyle}>
          <div style={rowStyle}><strong>ID:</strong> <span style={highlightStyle}>{id}</span></div>
          <div style={rowStyle}><strong>Name:</strong> {name}</div>
          <div style={rowStyle}><strong>Status:</strong> {details.status}</div>
          <div style={rowStyle}><strong>Published at:</strong> {details.publishedAt}</div>
          <div style={rowStyle}><strong>Based on ID:</strong> {versionInfo.basedOnId}</div>
          <div style={rowStyle}><strong>Base rate set ID:</strong> <span style={highlightStyle}>{baseRateSetId}</span></div>
        </div>
      )}
    </div>
  );
}
