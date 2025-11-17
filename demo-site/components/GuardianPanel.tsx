import { useState, FormEvent } from 'react';
import { useMockContracts, parseAddressList, validatePolkadotAddress, formatAddress } from '../hooks/useMockContracts';
import { toast } from 'react-toastify';
import EventsLog from './EventsLog';

const GuardianPanel: React.FC = () => {
  const { state, loading, setCap, updateAllowlist } = useMockContracts();
  const [capInput, setCapInput] = useState('');
  const [allowlistInput, setAllowlistInput] = useState('');
  const [capError, setCapError] = useState('');
  const [allowlistError, setAllowlistError] = useState('');

  const handleSetCap = async (e: FormEvent) => {
    e.preventDefault();
    setCapError('');

    const cap = parseInt(capInput);
    if (isNaN(cap) || cap < 0) {
      setCapError('Please enter a valid positive number');
      return;
    }

    try {
      await setCap(cap);
      toast.success(`✅ Spend cap set to ${cap} DOT`);
      setCapInput('');
    } catch (error) {
      toast.error(`❌ Failed to set spend cap: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSetAllowlist = async (e: FormEvent) => {
    e.preventDefault();
    setAllowlistError('');

    const addresses = parseAddressList(allowlistInput);
    if (addresses.length === 0) {
      setAllowlistError('Please enter at least one address');
      return;
    }

    const invalidAddresses = addresses.filter(addr => !validatePolkadotAddress(addr));
    if (invalidAddresses.length > 0) {
      setAllowlistError(`Invalid address format: ${invalidAddresses[0]}`);
      return;
    }

    try {
      await updateAllowlist(addresses);
      toast.success(`✅ Allowlist updated with ${addresses.length} address${addresses.length !== 1 ? 'es' : ''}`);
      setAllowlistInput('');
    } catch (error) {
      toast.error(`❌ Failed to update allowlist: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-polkadotPurple to-polkadotIndigo rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="mr-2">👨‍👧‍👦</span>
          Guardian Controls
        </h2>

        <div className="space-y-6">
          <form onSubmit={handleSetCap} className="space-y-3">
            <label htmlFor="spend-cap" className="block text-sm font-medium text-gray-200">
              Set Spend Cap (DOT)
            </label>
            <div className="flex space-x-2">
              <input
                id="spend-cap"
                type="number"
                value={capInput}
                onChange={(e) => setCapInput(e.target.value)}
                placeholder="Enter amount in DOT"
                className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-polkadotDark text-gray-900 dark:text-white border-2 border-transparent focus:border-polkadotPink transition-colors"
                aria-invalid={!!capError}
                aria-describedby={capError ? 'cap-error' : undefined}
              />
              <button
                type="submit"
                disabled={loading.setCap}
                className="px-6 py-2 bg-polkadotPink hover:bg-pink-600 disabled:bg-gray-500 text-white font-medium rounded-lg transition-all transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:transform-none flex items-center"
                aria-label="Set spend cap"
              >
                {loading.setCap ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Setting...
                  </>
                ) : (
                  'Set Cap'
                )}
              </button>
            </div>
            {capError && (
              <p id="cap-error" className="text-red-300 text-sm" role="alert">
                {capError}
              </p>
            )}
          </form>

          <form onSubmit={handleSetAllowlist} className="space-y-3">
            <label htmlFor="allowlist" className="block text-sm font-medium text-gray-200">
              Set Allowlist (comma-separated addresses)
            </label>
            <div className="flex flex-col space-y-2">
              <textarea
                id="allowlist"
                value={allowlistInput}
                onChange={(e) => setAllowlistInput(e.target.value)}
                placeholder="5ABC..., 5DEF..., 5GHI..."
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-polkadotDark text-gray-900 dark:text-white border-2 border-transparent focus:border-polkadotPink transition-colors resize-none"
                aria-invalid={!!allowlistError}
                aria-describedby={allowlistError ? 'allowlist-error' : undefined}
              />
              <button
                type="submit"
                disabled={loading.allowlist}
                className="self-end px-6 py-2 bg-polkadotPink hover:bg-pink-600 disabled:bg-gray-500 text-white font-medium rounded-lg transition-all transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:transform-none flex items-center"
                aria-label="Update allowlist"
              >
                {loading.allowlist ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  'Update Allowlist'
                )}
              </button>
            </div>
            {allowlistError && (
              <p id="allowlist-error" className="text-red-300 text-sm" role="alert">
                {allowlistError}
              </p>
            )}
          </form>

          <div className="pt-4 border-t border-gray-400 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-200 mb-2">Current Spend Cap</h3>
              <p className="text-2xl font-bold text-white">{state.spendCap} DOT</p>
              <p className="text-sm text-gray-300 mt-1">
                Spent: {state.currentSpent} DOT (
                {state.spendCap === 0
                  ? 0
                  : Math.min(100, Math.round((state.currentSpent / state.spendCap) * 100))}
                %)
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-200 mb-2">Allowlist ({state.allowlist.length})</h3>
              {state.allowlist.length === 0 ? (
                <p className="text-gray-400 text-sm italic">No addresses in allowlist</p>
              ) : (
                <ul className="space-y-1" role="list" aria-label="Allowed addresses">
                  {state.allowlist.map((addr, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-200 bg-polkadotDark bg-opacity-50 px-3 py-2 rounded font-mono"
                      title={addr}
                    >
                      {formatAddress(addr, 8, 6)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <EventsLog events={state.events.filter(e => e.type === 'SET_CAP' || e.type === 'SET_ALLOWLIST')} maxHeight="300px" />
    </div>
  );
};

export default GuardianPanel;
