import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SimulatePanel from '../../components/SimulatePanel';
import { DemoStateProvider } from '../../context/DemoState';
import { act } from 'react';

describe('SimulatePanel', () => {
  const renderPanel = () =>
    render(
      <DemoStateProvider>
        <SimulatePanel />
      </DemoStateProvider>
    );

  const flushAsyncOperations = async () => {
    act(() => {
      jest.runAllTimers();
    });
    await act(async () => {
      await Promise.resolve();
    });
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('displays guardian policy and safety registry snapshots', () => {
    renderPanel();

    expect(screen.getByText(/Guardian Policy Snapshot/i)).toBeInTheDocument();
    expect(screen.getByText(/Spend Cap:/i)).toBeInTheDocument();
    expect(screen.getByText(/1000 DOT/i)).toBeInTheDocument();

    expect(screen.getByText(/Safety Registry Snapshot/i)).toBeInTheDocument();
    expect(screen.getByText(/Flagged addresses: 2/i)).toBeInTheDocument();
  });

  it('approves transactions to allowlisted addresses', async () => {
    renderPanel();

    const textarea = screen.getByLabelText(/Address to check/i);
    fireEvent.change(textarea, {
      target: { value: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty' }
    });

    const checkButton = screen.getByRole('button', { name: /Check Safety & Spend/i });
    fireEvent.click(checkButton);

    await flushAsyncOperations();

    await waitFor(() => {
      expect(screen.getByText(/✅ APPROVED — Transaction permitted/i)).toBeInTheDocument();
      expect(screen.getByText(/Simulated amount: 150 DOT/i)).toBeInTheDocument();
    });
  });

  it('blocks transactions to flagged addresses', async () => {
    renderPanel();

    const textarea = screen.getByLabelText(/Address to check/i);
    fireEvent.change(textarea, {
      target: { value: '5CiPPseXPECbkjWCa6MnjNokrgYjMqmKndv2rSnekmSK2DjL' }
    });

    const checkButton = screen.getByRole('button', { name: /Check Safety & Spend/i });
    fireEvent.click(checkButton);

    await flushAsyncOperations();

    await waitFor(() => {
      expect(screen.getByText(/BLOCKED — Address flagged: Known scam contract/i)).toBeInTheDocument();
    });
  });

  it('blocks transactions to non-allowlisted addresses', async () => {
    renderPanel();

    const textarea = screen.getByLabelText(/Address to check/i);
    fireEvent.change(textarea, {
      target: { value: '5EYCAe5iji79z3rJ1WcwHseJnMcxgJkJTZzMS3gJpj1PqXoP' }
    });

    const checkButton = screen.getByRole('button', { name: /Check Safety & Spend/i });
    fireEvent.click(checkButton);

    await flushAsyncOperations();

    await waitFor(() => {
      expect(screen.getByText(/BLOCKED — Address not in allowlist/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid address format', () => {
    renderPanel();

    const textarea = screen.getByLabelText(/Address to check/i);
    fireEvent.change(textarea, { target: { value: 'INVALID' } });

    const checkButton = screen.getByRole('button', { name: /Check Safety & Spend/i });
    fireEvent.click(checkButton);

    expect(screen.getByText(/Invalid Polkadot SS58 address format/i)).toBeInTheDocument();
  });

  it('shows validation error for empty address submission', () => {
    renderPanel();

    const checkButton = screen.getByRole('button', { name: /Check Safety & Spend/i });
    fireEvent.click(checkButton);

    expect(screen.getByText(/Please enter an address to check/i)).toBeInTheDocument();
  });
});
