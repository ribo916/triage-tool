import React, { useState, useEffect } from 'react';
import SectionContainer from './SectionContainer.jsx';
import ChangesetAccordionItem from './changesets/ChangesetAccordionItem.jsx';

export default function ChangesetSection({ parsed, ratesByChangesetId, ratesError }) {
  const [openId, setOpenId] = useState(null);

  // Reset accordion state when new data arrives (new analysis)
  useEffect(() => {
    setOpenId(null);
  }, [parsed]);

  if (!parsed) return null;

  const { total, changesets } = parsed;
  const count = changesets?.length ?? 0;

  if (!changesets || count === 0) {
    return (
      <SectionContainer title="ChangeSets">
        <p style={{ fontSize: '12px', color: '#6b7280' }}>No changesets</p>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer title="ChangeSets">
      {ratesError && (
        <p style={{ fontSize: '11px', color: '#b91c1c', marginBottom: '6px' }}>
          Rate data unavailable
        </p>
      )}

      <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '12px' }}>
        {count} of {total}
      </p>

      {changesets.map((cs) => (
        <ChangesetAccordionItem
          key={cs.id}
          changeset={cs}
          ratesByChangesetId={ratesByChangesetId}
          isOpen={openId === cs.id}
          onToggle={() => setOpenId(openId === cs.id ? null : cs.id)}
        />
      ))}
    </SectionContainer>
  );
}
