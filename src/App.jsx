import React, { useState } from 'react';
import { useChangesets } from './hooks/useChangesets.js';
import { useLoan } from './hooks/useLoan.js';
import Layout from './components/Layout.jsx';
import TriageForm from './components/TriageForm.jsx';
import ErrorDisplay from './components/ErrorDisplay.jsx';
import ChangesetSection from './components/ChangesetSection.jsx';
import LoanSection from './components/LoanSection.jsx';
import ApiLogPanel from './components/ApiLogPanel.jsx';

export default function PollyApiTriage() {
  const [bearerToken, setBearerToken] = useState('');
  const [environment, setEnvironment] = useState('stage');
  const [losLoanId, setLosLoanId] = useState('');
  const [hasLoanService, setHasLoanService] = useState(false);

  const { parsed, ratesByChangesetId, ratesError, error, loading, fetch } = useChangesets();
  const {
    data: loanData,
    error: loanError,
    loading: loanLoading,
    attempted: loanAttempted,
    fetch: fetchLoan,
    reset: resetLoan,
  } = useLoan();
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    fetch(environment, bearerToken);
  
    // New analysis run: clear any previous loan attempt/data
    resetLoan();
  
    if (hasLoanService && losLoanId.trim()) {
      fetchLoan(environment, bearerToken, losLoanId.trim());
    }
  };
  
  

  return (
    <Layout>
      <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '24px' }}>
        API Triage Tool
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
        onSubmit={handleSubmit}
        loading={loading || loanLoading}
      />

      <ErrorDisplay error={error} />

      <ChangesetSection
        parsed={parsed}
        ratesByChangesetId={ratesByChangesetId}
        ratesError={ratesError}
      />

      <LoanSection attempted={loanAttempted} loan={loanData} error={loanError} />

      <ApiLogPanel />
    </Layout>
  );
}
