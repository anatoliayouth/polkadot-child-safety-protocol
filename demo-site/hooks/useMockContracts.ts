import { useState } from 'react';
import { CheckResult, useDemoState } from '../context/DemoState';

const delay = () => new Promise(resolve => setTimeout(resolve, 900 + Math.random() * 600));

export type LoadingKey = 'setCap' | 'allowlist' | 'flag' | 'unflag' | 'check';

export const SIMULATED_TRANSACTION_AMOUNT = 150;

export const useMockContracts = () => {
  const { state, setSpendCap, setAllowlist, flagAddress, unflagAddress, checkAddress } = useDemoState();
  const [loading, setLoading] = useState<Record<LoadingKey, boolean>>({
    setCap: false,
    allowlist: false,
    flag: false,
    unflag: false,
    check: false
  });

  const runWithLoading = async <T,>(key: LoadingKey, operation: () => T): Promise<T> => {
    setLoading(prev => ({ ...prev, [key]: true }));
    await delay();
    const result = operation();
    setLoading(prev => ({ ...prev, [key]: false }));
    return result;
  };

  const setCap = async (cap: number) => {
    await runWithLoading('setCap', () => setSpendCap(cap));
  };

  const updateAllowlist = async (addresses: string[]) => {
    await runWithLoading('allowlist', () => setAllowlist(addresses));
  };

  const flagAccount = async (address: string, reason: string) => {
    await runWithLoading('flag', () => flagAddress(address, reason));
  };

  const unflagAccount = async (address: string) => {
    await runWithLoading('unflag', () => unflagAddress(address));
  };

  const checkSafety = async (address: string): Promise<CheckResult> => {
    return runWithLoading('check', () => checkAddress(address, SIMULATED_TRANSACTION_AMOUNT));
  };

  return {
    state,
    loading,
    setCap,
    updateAllowlist,
    flagAccount,
    unflagAccount,
    checkSafety,
    simulatedAmount: SIMULATED_TRANSACTION_AMOUNT
  };
};

export const formatAddress = (address: string, startChars: number = 6, endChars: number = 4): string => {
  if (!address || address.length < startChars + endChars) {
    return address;
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

export const validatePolkadotAddress = (address: string): boolean => {
  const regex = /^5[A-HJ-NP-Za-km-z1-9]{47}$/;
  return regex.test(address);
};

export const parseAddressList = (input: string): string[] => {
  return input
    .split(',')
    .map(addr => addr.trim())
    .filter(addr => addr.length > 0);
};
