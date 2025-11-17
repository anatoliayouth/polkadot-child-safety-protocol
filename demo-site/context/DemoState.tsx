import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface FlaggedAddress {
  address: string;
  reason: string;
  timestamp: number;
}

export interface EventLog {
  type: 'SET_CAP' | 'SET_ALLOWLIST' | 'FLAG' | 'UNFLAG' | 'CHECK';
  data: any;
  timestamp: number;
  id: string;
}

export interface DemoState {
  guardian: string;
  child: string;
  spendCap: number;
  currentSpent: number;
  allowlist: string[];
  flaggedAddresses: FlaggedAddress[];
  events: EventLog[];
}

interface DemoContextType {
  state: DemoState;
  setSpendCap: (cap: number) => void;
  setAllowlist: (addresses: string[]) => void;
  flagAddress: (address: string, reason: string) => void;
  unflagAddress: (address: string) => void;
  checkAddress: (address: string, amount: number) => CheckResult;
  addEvent: (type: EventLog['type'], data: any) => void;
}

export interface CheckResult {
  approved: boolean;
  reason: string;
  details?: string;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

const initialState: DemoState = {
  guardian: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
  child: '5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc',
  spendCap: 1000,
  currentSpent: 0,
  allowlist: [
    '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
    '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy'
  ],
  flaggedAddresses: [
    {
      address: '5CiPPseXPECbkjWCa6MnjNokrgYjMqmKndv2rSnekmSK2DjL',
      reason: 'Known scam contract',
      timestamp: Date.now() - 3600000
    },
    {
      address: '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY',
      reason: 'Compromised wallet',
      timestamp: Date.now() - 7200000
    }
  ],
  events: []
};

export const DemoStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DemoState>(initialState);

  const addEvent = (type: EventLog['type'], data: any) => {
    const newEvent: EventLog = {
      type,
      data,
      timestamp: Date.now(),
      id: `${type}-${Date.now()}-${Math.random()}`
    };
    setState(prev => ({
      ...prev,
      events: [newEvent, ...prev.events].slice(0, 50)
    }));
  };

  const setSpendCap = (cap: number) => {
    setState(prev => ({ ...prev, spendCap: cap }));
    addEvent('SET_CAP', { cap });
  };

  const setAllowlist = (addresses: string[]) => {
    setState(prev => ({ ...prev, allowlist: addresses }));
    addEvent('SET_ALLOWLIST', { addresses });
  };

  const flagAddress = (address: string, reason: string) => {
    const exists = state.flaggedAddresses.some(f => f.address === address);
    if (exists) {
      throw new Error('Address already flagged');
    }
    const newFlag: FlaggedAddress = {
      address,
      reason,
      timestamp: Date.now()
    };
    setState(prev => ({
      ...prev,
      flaggedAddresses: [...prev.flaggedAddresses, newFlag]
    }));
    addEvent('FLAG', { address, reason });
  };

  const unflagAddress = (address: string) => {
    const exists = state.flaggedAddresses.some(f => f.address === address);
    if (!exists) {
      throw new Error('Address not found in flagged list');
    }
    setState(prev => ({
      ...prev,
      flaggedAddresses: prev.flaggedAddresses.filter(f => f.address !== address)
    }));
    addEvent('UNFLAG', { address });
  };

  const checkAddress = (address: string, amount: number): CheckResult => {
    addEvent('CHECK', { address, amount });

    const isFlagged = state.flaggedAddresses.find(f => f.address === address);
    if (isFlagged) {
      return {
        approved: false,
        reason: `BLOCKED — Address flagged: ${isFlagged.reason}`,
        details: `This address has been flagged by the safety registry.`
      };
    }

    const isInAllowlist = state.allowlist.includes(address);
    if (!isInAllowlist) {
      return {
        approved: false,
        reason: 'BLOCKED — Address not in allowlist',
        details: `Guardian has not approved this address for transactions.`
      };
    }

    if (state.currentSpent + amount > state.spendCap) {
      return {
        approved: false,
        reason: 'BLOCKED — Spend cap exceeded',
        details: `Transaction would exceed spend cap (${state.spendCap} DOT). Current spent: ${state.currentSpent} DOT.`
      };
    }

    setState(prev => ({
      ...prev,
      currentSpent: prev.currentSpent + amount
    }));

    return {
      approved: true,
      reason: '✅ APPROVED — Transaction permitted',
      details: `Address is in allowlist, not flagged, and within spend cap.`
    };
  };

  return (
    <DemoContext.Provider
      value={{
        state,
        setSpendCap,
        setAllowlist,
        flagAddress,
        unflagAddress,
        checkAddress,
        addEvent
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemoState = (): DemoContextType => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemoState must be used within DemoStateProvider');
  }
  return context;
};
