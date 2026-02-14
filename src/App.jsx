import React, { useState } from 'react';
import { useChangesets } from './hooks/useChangesets.js';
import { useLoan } from './hooks/useLoan.js';
import { useLockRequests } from './hooks/useLockRequests.js';
import Layout from './components/Layout.jsx';
import TriageForm from './components/TriageForm.jsx';
import ErrorDisplay from './components/ErrorDisplay.jsx';
import ChangesetSection from './components/ChangesetSection.jsx';
import LoanSection from './components/LoanSection.jsx';
import LockRequestsSection from './components/LockRequestsSection.jsx';
import ApiLogPanel from './components/ApiLogPanel.jsx';

export default function PollyApiTriage() {
  const [bearerToken, setBearerToken] = useState('');
  const [environment, setEnvironment] = useState('stage');
  const [losLoanId, setLosLoanId] = useState('');
  const [hasLoanService, setHasLoanService] = useState(false);
  const [changeSet, setChangeSet] = useState(false);

  const { parsed, ratesByChangesetId, ratesError, error, loading, attempted: changesetAttempted, fetch, reset: resetChangesets } = useChangesets();
  const {
    data: loanData,
    error: loanError,
    loading: loanLoading,
    attempted: loanAttempted,
    fetch: fetchLoan,
    reset: resetLoan,
  } = useLoan();
  const {
    locks,
    pricingByPeRequestId,
    error: lockError,
    loading: lockLoading,
    attempted: lockAttempted,
    fetch: fetchLockRequests,
    reset: resetLockRequests,
  } = useLockRequests();

  const handleSubmit = (e) => {
    e.preventDefault();

    // New analysis run: clear any previous attempt/data
    resetChangesets();
    resetLoan();
    resetLockRequests();

    if (changeSet) {
      fetch(environment, bearerToken);
    }

    if (hasLoanService && losLoanId.trim()) {
      fetchLoan(environment, bearerToken, losLoanId.trim());
    }

    // Lock requests run when a loanId is present
    if (losLoanId.trim()) {
      fetchLockRequests(environment, bearerToken, losLoanId.trim());
    }
  };


  return (
    <Layout>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px', color: '#111827' }}>
        Loan Analyzer
      </h1>

      <TriageForm
        bearerToken={bearerToken}
        onBearerTokenChange={setBearerToken}
        environment={environment}
        onEnvironmentChange={setEnvironment}
        losLoanId={losLoanId}
        onLosLoanIdChange={setLosLoanId}
        hasLoanService={hasLoanService}
        onHasLoanServiceChange={setHasLoanService}
        changeSet={changeSet}
        onChangeSetChange={setChangeSet}
        onSubmit={handleSubmit}
        loading={(changeSet && loading) || loanLoading || lockLoading}
      />

      <ErrorDisplay error={error} />

      
      <LockRequestsSection
        attempted={lockAttempted}
        locks={locks}
        pricingByPeRequestId={pricingByPeRequestId}
        error={lockError}
        loading={lockLoading}
      />

      <LoanSection
        attempted={loanAttempted}
        loan={loanData}
        error={loanError}
        loading={loanLoading}
      />

      <ChangesetSection
        attempted={changesetAttempted}
        loading={loading}
        parsed={parsed}
        ratesByChangesetId={ratesByChangesetId}
        ratesError={ratesError}
      />

      <ApiLogPanel />
    </Layout>
  );
}
