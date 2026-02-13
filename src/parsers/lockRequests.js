/**
 * Normalize lock requests API response into a triage-friendly shape.
 *
 * @param {unknown} rawResponse
 * @returns {{ items: Array<{
 *   id: number,
 *   requestedOn: string,
 *   requestedBy: string,
 *   requestedByUsername: string,
 *   isAutoTriggered: boolean,
 *   writeBackStatus: string,
 *   action: string,
 *   decision: string,
 *   approvalMode: string,
 *   buySide: {
 *     changesetId: string,
 *     channel: string,
 *     policyId: string,
 *     peRequestId: string,
 *     investor: string,
 *     investorId: number | null,
 *     rateSheetId: string,
 *     productName: string,
 *     productCode: string,
 *     rate: string,
 *     lockPeriod: number | null,
 *     expirationDate: string,
 *     lockConfirmedDate: string,
 *     basePrice: string,
 *     netPrice: string,
 *   },
 *   hasSellSide: boolean
 * }>}
 * }
 */
export function parseLockRequests(rawResponse) {
  const fallback = { items: [] };

  if (!Array.isArray(rawResponse)) {
    return fallback;
  }

  const items = rawResponse.map((item) => {
    if (!item || typeof item !== 'object') return null;
    const o = /** @type {Record<string, unknown>} */ (item);

    const buySide =
      o.buySide && typeof o.buySide === 'object'
        ? /** @type {Record<string, unknown>} */ (o.buySide)
        : {};

    const sellSide =
      o.sellSide && typeof o.sellSide === 'object'
        ? /** @type {Record<string, unknown>} */ (o.sellSide)
        : {};

    return {
      id: typeof o.id === 'number' ? o.id : Number(o.id ?? 0),
      requestedOn: String(o.requestedOn ?? ''),
      requestedBy: String(o.requestedBy ?? ''),
      requestedByUsername: String(o.requestedByUsername ?? ''),
      isAutoTriggered: Boolean(o.isAutoTriggered),
      writeBackStatus: String(o.writeBackStatus ?? ''),
      action: String(o.action ?? ''),
      decision: String(o.decision ?? ''),
      approvalMode: String(o.approvalMode ?? ''),
      buySide: {
        changesetId: String(buySide.changesetId ?? ''),
        channel: String(buySide.channel ?? ''),
        policyId: String(buySide.policyId ?? ''),
        peRequestId: String(buySide.peRequestId ?? ''),
        investor: String(buySide.investor ?? ''),
        investorId:
          typeof buySide.investorId === 'number'
            ? buySide.investorId
            : buySide.investorId != null
              ? Number(buySide.investorId)
              : null,
        rateSheetId: String(buySide.rateSheetId ?? ''),
        productName: String(buySide.productName ?? ''),
        productCode: String(buySide.productCode ?? ''),
        rate: String(buySide.rate ?? ''),
        lockPeriod:
          typeof buySide.lockPeriod === 'number'
            ? buySide.lockPeriod
            : buySide.lockPeriod != null
              ? Number(buySide.lockPeriod)
              : null,
        expirationDate: String(buySide.expirationDate ?? ''),
        lockConfirmedDate: String(buySide.lockConfirmedDate ?? ''),
        basePrice: String(buySide.basePrice ?? ''),
        netPrice: String(buySide.netPrice ?? ''),
      },
      hasSellSide: Object.keys(sellSide).length > 0,
    };
  }).filter(Boolean);

  return {
    items: /** @type {Array<{
      id: number,
      requestedOn: string,
      requestedBy: string,
      requestedByUsername: string,
      isAutoTriggered: boolean,
      writeBackStatus: string,
      action: string,
      decision: string,
      approvalMode: string,
      buySide: {
        changesetId: string,
        channel: string,
        policyId: string,
        peRequestId: string,
        investor: string,
        investorId: number | null,
        rateSheetId: string,
        productName: string,
        productCode: string,
        rate: string,
        lockPeriod: number | null,
        expirationDate: string,
        lockConfirmedDate: string,
        basePrice: string,
        netPrice: string,
      },
      hasSellSide: boolean
    }>} */ (items),
  };
}

