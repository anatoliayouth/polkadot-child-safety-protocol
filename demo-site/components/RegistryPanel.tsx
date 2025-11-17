import { useState, FormEvent } from 'react';
import { useMockContracts, validatePolkadotAddress, formatAddress } from '../hooks/useMockContracts';
import { toast } from 'react-toastify';
import EventsLog from './EventsLog';

const RegistryPanel: React.FC = () => {
  const { state, loading, flagAccount, unflagAccount } = useMockContracts();
  const [flagAddress, setFlagAddress] = useState('');
  const [flagReason, setFlagReason] = useState('');
  const [unflagAddress, setUnflagAddress] = useState('');
  const [flagError, setFlagError] = useState('');
  const [unflagError, setUnflagError] = useState('');

  const handleFlag = async (e: FormEvent) => {
    e.preventDefault();
    setFlagError('');

    if (!validatePolkadotAddress(flagAddress)) {
      setFlagError('Invalid Polkadot address format');
      return;
    }

    if (!flagReason.trim()) {
      setFlagError('Please provide a reason for flagging');
      return;
    }

    try {
      await flagAccount(flagAddress, flagReason);
      toast.success(`✅ Address flagged: ${formatAddress(flagAddress)}`);
      setFlagAddress('');
      setFlagReason('');
    } catch (error) {
      toast.error(`❌ ${error instanceof Error ? error.message : 'Failed to flag address'}`);
    }
  };

  const handleUnflag = async (e: FormEvent) => {
    e.preventDefault();
    setUnflagError('');

    if (!validatePolkadotAddress(unflagAddress)) {
      setUnflagError('Invalid Polkadot address format');
      return;
    }

    try {
      await unflagAccount(unflagAddress);
      toast.success(`✅ Address unflagged: ${formatAddress(unflagAddress)}`);
      setUnflagAddress('');
    } catch (error) {
      toast.error(`❌ ${error instanceof Error ? error.message : 'Failed to unflag address'}`);
    }
  };

  const formatTimeSince = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-polkadotIndigo to-polkadotPurple rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="mr-2">🛡️</span>
          Safety Registry
        </h2>

        <div className="space-y-6">
          <form onSubmit={handleFlag} className="space-y-3">
            <label htmlFor="flag-address" className="block text-sm font-medium text-gray-200">
              Flag Address
            </label>
            <input
              id="flag-address"
              type="text"
              value={flagAddress}
              onChange={(e) => setFlagAddress(e.target.value)}
              placeholder="5ABC... (Polkadot address)"
              className="w-full px-4 py-2 rounded-lg bg-white dark:bg-polkadotDark text-gray-900 dark:text-white border-2 border-transparent focus:border-polkadotPink transition-colors font-mono text-sm"
              aria-invalid={!!flagError}
              aria-describedby={flagError ? 'flag-error' : undefined}
            />
            <label htmlFor="flag-reason" className="block text-sm font-medium text-gray-200 mt-3">
              Reason
            </label>
            <input
              id="flag-reason"
              type="text"
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              placeholder="e.g., Known scam, Compromised wallet"
              className="w-full px-4 py-2 rounded-lg bg-white dark:bg-polkadotDark text-gray-900 dark:text-white border-2 border-transparent focus:border-polkadotPink transition-colors"
              aria-invalid={!!flagError}
            />
            <button
              type="submit"
              disabled={loading.flag}
              className="w-full px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-500 text-white font-medium rounded-lg transition-all transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              aria-label="Flag address"
            >
              {loading.flag ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Flagging...
                </>
              ) : (
                '🚩 Flag Address'
              )}
            </button>
            {flagError && (
              <p id="flag-error" className="text-red-300 text-sm" role="alert">
                {flagError}
              </p>
            )}
          </form>

          <div className="border-t border-gray-400 pt-6">
            <form onSubmit={handleUnflag} className="space-y-3">
              <label htmlFor="unflag-address" className="block text-sm font-medium text-gray-200">
                Unflag Address
              </label>
              <div className="flex space-x-2">
                <input
                  id="unflag-address"
                  type="text"
                  value={unflagAddress}
                  onChange={(e) => setUnflagAddress(e.target.value)}
                  placeholder="5ABC... (Polkadot address)"
                  className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-polkadotDark text-gray-900 dark:text-white border-2 border-transparent focus:border-polkadotPink transition-colors font-mono text-sm"
                  aria-invalid={!!unflagError}
                  aria-describedby={unflagError ? 'unflag-error' : undefined}
                />
                <button
                  type="submit"
                  disabled={loading.unflag}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-medium rounded-lg transition-all transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:transform-none flex items-center"
                  aria-label="Unflag address"
                >
                  {loading.unflag ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Unflagging...
                    </>
                  ) : (
                    'Unflag'
                  )}
                </button>
              </div>
              {unflagError && (
                <p id="unflag-error" className="text-red-300 text-sm" role="alert">
                  {unflagError}
                </p>
              )}
            </form>
          </div>

          <div className="pt-4 border-t border-gray-400">
            <h3 className="text-sm font-medium text-gray-200 mb-3">
              Flagged Addresses ({state.flaggedAddresses.length})
            </h3>
            {state.flaggedAddresses.length === 0 ? (
              <p className="text-gray-400 text-sm italic">No flagged addresses</p>
            ) : (
              <ul className="space-y-2" role="list" aria-label="Flagged addresses">
                {state.flaggedAddresses.map((flagged, idx) => (
                  <li
                    key={idx}
                    className="bg-red-900 bg-opacity-30 border-l-4 border-red-500 px-4 py-3 rounded"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-mono text-white break-all" title={flagged.address}>
                          {formatAddress(flagged.address, 10, 8)}
                        </p>
                        <p className="text-sm text-gray-300 mt-1">{flagged.reason}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatTimeSince(flagged.timestamp)}</p>
                      </div>
                      <span className="text-xl ml-2" role="img" aria-label="Flagged">
                        🚩
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <EventsLog events={state.events.filter(e => e.type === 'FLAG' || e.type === 'UNFLAG')} maxHeight="300px" />
    </div>
  );
};

export default RegistryPanel;
