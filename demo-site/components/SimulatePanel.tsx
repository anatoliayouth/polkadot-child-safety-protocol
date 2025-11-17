import { useState } from 'react';
import { useMockContracts, validatePolkadotAddress, formatAddress } from '../hooks/useMockContracts';
import { toast } from 'react-toastify';

type ResultState = {
  message: string;
  details?: string;
  approved: boolean;
  address: string;
};

const SimulatePanel: React.FC = () => {
  const { state, loading, checkSafety, simulatedAmount } = useMockContracts();
  const [addressInput, setAddressInput] = useState('');
  const [inputError, setInputError] = useState('');
  const [result, setResult] = useState<ResultState | null>(null);

  const handleCheck = async () => {
    setInputError('');

    if (!addressInput.trim()) {
      setInputError('Please enter an address to check');
      return;
    }

    if (!validatePolkadotAddress(addressInput.trim())) {
      setInputError('Invalid Polkadot SS58 address format');
      return;
    }

    try {
      const response = await checkSafety(addressInput.trim());
      const message = response.reason;
      const details = response.details;
      const approved = response.approved;

      setResult({
        address: addressInput.trim(),
        message,
        details,
        approved
      });

      if (approved) {
        toast.success('✅ Transaction approved');
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error(`❌ ${error instanceof Error ? error.message : 'Failed to check address'}`);
    }
  };

  return (
    <div className="bg-white dark:bg-polkadotDark rounded-2xl shadow-2xl p-8 space-y-8 border border-transparent hover:border-polkadotPink transition-colors">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Simulate dApp Safety Check
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Enter an address to run through the guardian policy and safety registry. A mocked transaction of
          <span className="font-semibold text-polkadotPink"> {simulatedAmount} DOT </span>
          is evaluated against the spend cap and safety rules.
        </p>
      </div>

      <div className="space-y-4">
        <label htmlFor="check-address" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Address to check
        </label>
        <textarea
          id="check-address"
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
          rows={3}
          placeholder="5FHne..."
          className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-polkadotIndigo text-gray-900 dark:text-white border-2 border-transparent focus:border-polkadotPink transition-colors font-mono"
          aria-invalid={!!inputError}
          aria-describedby={inputError ? 'check-error' : undefined}
        />
        {inputError && (
          <p id="check-error" className="text-red-400 text-sm" role="alert">
            {inputError}
          </p>
        )}
        <button
          type="button"
          onClick={handleCheck}
          disabled={loading.check}
          className="w-full px-6 py-3 bg-polkadotPink hover:bg-pink-600 disabled:bg-gray-500 text-white font-semibold rounded-xl transition-transform transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
        >
          {loading.check ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="ml-2">Checking safety...</span>
            </>
          ) : (
            <>
              <span>🔍 Check Safety &amp; Spend</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-sm">
        <div className="p-4 rounded-xl bg-gray-100 dark:bg-polkadotIndigo">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Guardian Policy Snapshot</h3>
          <ul className="mt-2 space-y-1 text-gray-600 dark:text-gray-300">
            <li>
              <span className="font-medium text-gray-800 dark:text-white">Spend Cap:</span> {state.spendCap} DOT
            </li>
            <li>
              <span className="font-medium text-gray-800 dark:text-white">Spend Used:</span> {state.currentSpent} DOT
            </li>
            <li>
              <span className="font-medium text-gray-800 dark:text-white">Allowlist Count:</span> {state.allowlist.length}
            </li>
          </ul>
        </div>
        <div className="p-4 rounded-xl bg-gray-100 dark:bg-polkadotIndigo">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Safety Registry Snapshot</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Flagged addresses: {state.flaggedAddresses.length}
          </p>
          <ul className="mt-2 space-y-1 text-xs text-gray-500 dark:text-gray-400">
            {state.flaggedAddresses.slice(0, 3).map((flagged) => (
              <li key={flagged.address} className="flex justify-between">
                <span title={flagged.address}>{formatAddress(flagged.address)}</span>
                <span>{flagged.reason}</span>
              </li>
            ))}
            {state.flaggedAddresses.length === 0 && <li>No flagged addresses</li>}
          </ul>
        </div>
      </div>

      {result && (
        <div
          className={`rounded-2xl p-6 border-2 animate-slideIn ${
            result.approved
              ? 'bg-green-50 border-green-500 text-green-800'
              : 'bg-red-50 border-red-500 text-red-800'
          }`}
          role="status"
          aria-live="assertive"
        >
          <h3 className="text-xl font-bold mb-2">{result.message}</h3>
          <p className="text-sm opacity-80 mb-1" title={result.address}>
            Address checked: {formatAddress(result.address, 12, 10)}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-900 font-medium">
            Simulated amount: {simulatedAmount} DOT
          </p>
          {result.details && <p className="text-sm mt-2 text-current">{result.details}</p>}
        </div>
      )}
    </div>
  );
};

export default SimulatePanel;
