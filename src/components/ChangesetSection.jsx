import React, { useMemo, useState } from 'react';
import SectionContainer from './SectionContainer.jsx';
import ChangesetAccordionItem from './changesets/ChangesetAccordionItem.jsx';

export default function ChangesetSection({ parsed, ratesByChangesetId, ratesError }) {
  const defaultOpenId = useMemo(() => {
    if (!parsed?.changesets?.length) return null;
    const active = parsed.changesets.find((cs) => cs.details?.status === 'Active');
    return active ? active.id : parsed.changesets[0].id;
  }, [parsed]);

  const [openId, setOpenId] = useState(null);

  if (!parsed) return null;

  const { total, changesets } = parsed;
  const count = changesets?.length ?? 0;

  if (!changesets || count === 0) {
    return (
      <SectionContainer title="Recent ChangeSets (with BaseRateSet)">
        <p style={{ fontSize: '12px', color: '#6b7280' }}>No changesets</p>
      </SectionContainer>
    );
  }

  const effectiveOpenId = openId ?? defaultOpenId;

  return (
    <SectionContainer title="Recent ChangeSets (with BaseRateSet)">
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
          isOpen={effectiveOpenId === cs.id}
          onToggle={() => setOpenId(effectiveOpenId === cs.id ? null : cs.id)}
        />
      ))}
    </SectionContainer>
  );
}
