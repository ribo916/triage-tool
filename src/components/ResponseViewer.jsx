import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const tileStyle = {
  backgroundColor: 'white',
  borderRadius: '8px',
  padding: '16px 20px',
  marginBottom: '24px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  border: '2px solid #d1d5db',
  minWidth: 0,
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

const accordionBodyStyle = {
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

function AccordionItem({ changeset, ratesByChangesetId, isOpen, onToggle }) {
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
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
        <span style={badgeStyle(isActive)}>{details.status}</span>
      </button>
      {isOpen && (
        <div style={accordionBodyStyle}>
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

export default function ResponseViewer({ parsed, environment, ratesByChangesetId, ratesError }) {
  const envLabel = environment === 'prod' ? 'Production' : 'Stage';

  const defaultOpenId = useMemo(() => {
    if (!parsed?.changesets?.length) return null;
    const active = parsed.changesets.find((cs) => cs.details?.status === 'Active');
    return active ? active.id : parsed.changesets[0].id;
  }, [parsed]);

  const [openId, setOpenId] = useState(null);
  const [sectionOpen, setSectionOpen] = useState(true);

  if (!parsed) return null;

  const { total, changesets } = parsed;
  const count = changesets?.length ?? 0;

  if (!changesets || count === 0) {
    return (
      <div style={tileStyle}>
        <button
          type="button"
          onClick={() => setSectionOpen((v) => !v)}
          style={sectionHeaderStyle}
        >
          {sectionOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          <span style={sectionTitleStyle}>Recent ChangeSets (with BaseRateSet)</span>
        </button>
        {sectionOpen && <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>No changesets</p>}
      </div>
    );
  }

  const effectiveOpenId = openId ?? defaultOpenId;

  return (
    <div style={tileStyle}>
      <button
        type="button"
        onClick={() => setSectionOpen((v) => !v)}
        style={sectionHeaderStyle}
      >
        {sectionOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        <span style={sectionTitleStyle}>Recent ChangeSets (with BaseRateSet)</span>
      </button>
      {sectionOpen && (
        <>
          {ratesError && (
            <p style={{ fontSize: '11px', color: '#b91c1c', marginBottom: '6px', marginTop: '8px' }}>Rate data unavailable</p>
          )}
          <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '12px' }}>
            {count} of {total}
          </p>
          {changesets.map((cs) => (
            <AccordionItem
              key={cs.id}
              changeset={cs}
              ratesByChangesetId={ratesByChangesetId}
              isOpen={effectiveOpenId === cs.id}
              onToggle={() => setOpenId(effectiveOpenId === cs.id ? null : cs.id)}
            />
          ))}
        </>
      )}
    </div>
  );
}
