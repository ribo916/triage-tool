/**
 * Normalize loan API response and pick key fields for display.
 *
 * @param {unknown} rawResponse
 * @returns {{
 *   loanNumber: string,
 *   losLoanId: string,
 *   purpose: string,
 *   amount: string,
 *   rate: string,
 *   productName: string,
 *   productCode: string,
 *   loanTerm: number | null,
 *   loanType: string,
 *   amortizationType: string,
 *   applicationDate: string,
 *   fundedAt: string,
 *   ltv: string,
 *   cltv: string,
 *   borrower: { firstName: string, lastName: string, fico: number | null, dtiRatio: string },
 *   property: { addressLine1: string, city: string, state: string, zipCode: string, propertyType: string, occupancy: string, appraisedValue: string },
 *   loanofficer: { name: string, email: string }
 * } | null}
 */
export function parseLoan(rawResponse) {
  if (!rawResponse || typeof rawResponse !== 'object') return null;
  const r = /** @type {Record<string, unknown>} */ (rawResponse);

  const borrower = r.borrower && typeof r.borrower === 'object' ? (/** @type {Record<string, unknown>} */ (r.borrower)) : {};
  const property = r.property && typeof r.property === 'object' ? (/** @type {Record<string, unknown>} */ (r.property)) : {};
  const loanofficer = r.loanofficer && typeof r.loanofficer === 'object' ? (/** @type {Record<string, unknown>} */ (r.loanofficer)) : {};

  return {
    loanNumber: String(r.loanNumber ?? ''),
    losLoanId: String(r.losLoanId ?? ''),
    purpose: String(r.purpose ?? ''),
    amount: String(r.amount ?? ''),
    rate: String(r.rate ?? ''),
    productName: String(r.productName ?? ''),
    productCode: String(r.productCode ?? ''),
    loanTerm: typeof r.loanTerm === 'number' ? r.loanTerm : null,
    loanType: String(r.loanType ?? ''),
    amortizationType: String(r.amortizationType ?? ''),
    applicationDate: String(r.applicationDate ?? ''),
    fundedAt: String(r.fundedAt ?? ''),
    ltv: String(r.ltv ?? ''),
    cltv: String(r.cltv ?? ''),
    borrower: {
      firstName: String(borrower.firstName ?? ''),
      lastName: String(borrower.lastName ?? ''),
      fico: typeof borrower.fico === 'number' ? borrower.fico : null,
      dtiRatio: String(borrower.dtiRatio ?? ''),
    },
    property: {
      addressLine1: String(property.addressLine1 ?? ''),
      city: String(property.city ?? ''),
      state: String(property.state ?? ''),
      zipCode: String(property.zipCode ?? ''),
      propertyType: String(property.propertyType ?? ''),
      occupancy: String(property.occupancy ?? ''),
      appraisedValue: String(property.appraisedValue ?? ''),
    },
    loanofficer: {
      name: String(loanofficer.name ?? ''),
      email: String(loanofficer.email ?? ''),
    },
  };
}
