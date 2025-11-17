import { render } from '@testing-library/react';
import { DemoStateProvider, useDemoState } from '../../context/DemoState';
import type { CheckResult } from '../../context/DemoState';
import { act } from 'react';

describe('DemoStateProvider', () => {
  const renderWithProvider = (onUpdate: (ctx: ReturnType<typeof useDemoState>) => void) => {
    const Consumer = () => {
      const context = useDemoState();
      onUpdate(context);
      return null;
    };

    render(
      <DemoStateProvider>
        <Consumer />
      </DemoStateProvider>
    );
  };

  const createHarness = () => {
    let latestContext: ReturnType<typeof useDemoState> | null = null;
    const handleUpdate = (ctx: ReturnType<typeof useDemoState>) => {
      latestContext = ctx;
    };

    renderWithProvider(handleUpdate);

    const getContext = () => {
      if (!latestContext) {
        throw new Error('Context not initialized');
      }

      return latestContext;
    };

    const runAction = async (action: () => void | Promise<void>) => {
      await act(async () => {
        await action();
      });
    };

    return { getContext, runAction };
  };

  it('blocks flagged addresses with appropriate message', async () => {
    const { getContext, runAction } = createHarness();
    const context = getContext();

    const flaggedAddress = context.state.flaggedAddresses[0].address;
    let result: CheckResult | null = null;

    await runAction(() => {
      result = getContext().checkAddress(flaggedAddress, 100);
    });

    expect(result).not.toBeNull();
    expect(result?.approved).toBe(false);
    expect(result?.reason).toContain('BLOCKED — Address flagged');
    expect(getContext().state.events[0].type).toBe('CHECK');
  });

  it('blocks addresses that are not in the allowlist', async () => {
    const { getContext, runAction } = createHarness();
    const randomAddress = '5Go4nHJmMZ3N8ZbXpsswc715s5WzxubUANe1yteWP9MhUcZp';
    let result: CheckResult | null = null;

    await runAction(() => {
      result = getContext().checkAddress(randomAddress, 50);
    });

    expect(result).not.toBeNull();
    expect(result?.approved).toBe(false);
    expect(result?.reason).toBe('BLOCKED — Address not in allowlist');
  });

  it('approves allowlisted addresses within the spend cap and updates spent amount', async () => {
    const { getContext, runAction } = createHarness();
    const allowedAddress = getContext().state.allowlist[0];

    let result: CheckResult | null = null;

    await runAction(() => {
      result = getContext().checkAddress(allowedAddress, 150);
    });

    expect(result).not.toBeNull();
    expect(result?.approved).toBe(true);
    expect(result?.reason).toBe('✅ APPROVED — Transaction permitted');
    expect(getContext().state.currentSpent).toBe(150);
  });

  it('updates spend cap and logs the change', async () => {
    const { getContext, runAction } = createHarness();

    await runAction(() => {
      getContext().setSpendCap(2000);
    });

    expect(getContext().state.spendCap).toBe(2000);
    expect(getContext().state.events[0]).toMatchObject({ type: 'SET_CAP', data: { cap: 2000 } });
  });

  it('updates allowlist with new addresses and emits event log entry', async () => {
    const { getContext, runAction } = createHarness();
    const addresses = [
      '5EYCAe5iji79z3rJ1WcwHseJnMcxgJkJTZzMS3gJpj1PqXoP',
      '5HPtP6FzV6HQQrs9WsewdQoH7fe7wfVwxFGb2MUxeEYwqqhs'
    ];

    await runAction(() => {
      getContext().setAllowlist(addresses);
    });

    expect(getContext().state.allowlist).toEqual(addresses);
    expect(getContext().state.events[0]).toMatchObject({ type: 'SET_ALLOWLIST' });
  });

  it('flags and unflags addresses correctly while maintaining event history', async () => {
    const { getContext, runAction } = createHarness();
    const newAddress = '5Fkd91FPTrHqudXAZkmAnqgrgCfhzgLmALj3kgj58cFZpDfV';

    await runAction(() => {
      getContext().flagAddress(newAddress, 'Testing flow');
    });

    expect(getContext().state.flaggedAddresses.some(f => f.address === newAddress)).toBe(true);
    expect(getContext().state.events[0]).toMatchObject({ type: 'FLAG', data: { address: newAddress } });

    await runAction(() => {
      getContext().unflagAddress(newAddress);
    });

    expect(getContext().state.flaggedAddresses.some(f => f.address === newAddress)).toBe(false);
    expect(getContext().state.events[0]).toMatchObject({ type: 'UNFLAG', data: { address: newAddress } });
  });
});
