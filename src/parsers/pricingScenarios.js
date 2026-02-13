/**
 * Normalize pricing scenario API response into a compact summary.
 *
 * @param {unknown} rawResponse
 * @returns {{
 *   baseRateSetId: string,
 *   changesetId: string,
 *   requestedOn: string,
 *   completedOn: string,
 *   borrower: {
 *     firstName: string,
 *     lastName: string,
 *     fico: number | null,
 *     dtiRatio: number | null,
 *     annualIncome: number | null,
 *   },
 *   loan: {
 *     amount: number | null,
 *     purpose: string,
 *     refinancePurpose: string,
 *     ltv: number | null,
 *     cltv: number | null,
 *     losLoanId: string,
 *   },
 *   property: {
 *     addressLine1: string,
 *     city: string,
 *     state: string,
 *     zipCode: string,
 *     propertyType: string,
 *     occupancy: string,
 *     appraisedValue: number | null,
 *   },
 *   search: {
 *     desiredLockPeriod: number | null,
 *     productCodes: string[],
 *     loanTypes: string[],
 *   }
 * } | null}
 */
export function parsePricingScenario(rawResponse) {
  if (!rawResponse || typeof rawResponse !== 'object') return null;

  const r = /** @type {Record<string, unknown>} */ (rawResponse);

  const borrower =
    r.borrower && typeof r.borrower === 'object'
      ? /** @type {Record<string, unknown>} */ (r.borrower)
      : {};
  const loan =
    r.loan && typeof r.loan === 'object'
      ? /** @type {Record<string, unknown>} */ (r.loan)
      : {};
  const property =
    r.property && typeof r.property === 'object'
      ? /** @type {Record<string, unknown>} */ (r.property)
      : {};
  const search =
    r.search && typeof r.search === 'object'
      ? /** @type {Record<string, unknown>} */ (r.search)
      : {};

  const toNumberOrNull = (value) =>
    typeof value === 'number' ? value : value != null ? Number(value) || null : null;

  return {
    baseRateSetId: String(r.baseRateSetId ?? ''),
    changesetId: String(r.changesetId ?? ''),
    requestedOn: String(r.requestedOn ?? ''),
    completedOn: String(r.completedOn ?? ''),
    borrower: {
      firstName: String(borrower.firstName ?? ''),
      lastName: String(borrower.lastName ?? ''),
      fico:
        typeof borrower.fico === 'number'
          ? borrower.fico
          : borrower.fico != null
            ? Number(borrower.fico) || null
            : null,
      dtiRatio: toNumberOrNull(borrower.dtiRatio),
      annualIncome: toNumberOrNull(borrower.annualIncome),
    },
    loan: {
      amount: toNumberOrNull(loan.amount),
      purpose: String(loan.purpose ?? ''),
      refinancePurpose: String(loan.refinancePurpose ?? ''),
      ltv: toNumberOrNull(loan.ltv),
      cltv: toNumberOrNull(loan.cltv),
      losLoanId: String(loan.losLoanId ?? ''),
    },
    property: {
      addressLine1: String(property.addressLine1 ?? ''),
      city: String(property.city ?? ''),
      state: String(property.state ?? ''),
      zipCode: String(property.zipCode ?? ''),
      propertyType: String(property.propertyType ?? ''),
      occupancy: String(property.occupancy ?? ''),
      appraisedValue: toNumberOrNull(property.appraisedValue),
    },
    search: {
      desiredLockPeriod: toNumberOrNull(search.desiredLockPeriod),
      productCodes: Array.isArray(search.productCodes)
        ? search.productCodes.map((x) => String(x ?? ''))
        : [],
      loanTypes: Array.isArray(search.loanTypes)
        ? search.loanTypes.map((x) => String(x ?? ''))
        : [],
    },
  };
}

