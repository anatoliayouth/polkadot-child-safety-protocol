import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import RegistryPanel from '../../components/RegistryPanel';
import { DemoStateProvider } from '../../context/DemoState';
import { act } from 'react';

describe('RegistryPanel', () => {
  const renderPanel = () =>
    render(
      <DemoStateProvider>
        <RegistryPanel />
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

  it('displays initial flagged addresses', () => {
    renderPanel();

    expect(screen.getByText(/Flagged Addresses \(2\)/i)).toBeInTheDocument();

    const list = screen.getByRole('list', { name: /Flagged addresses/i });
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(2);

    expect(screen.getByText(/Known scam contract/i)).toBeInTheDocument();
    expect(screen.getByText(/Compromised wallet/i)).toBeInTheDocument();
  });

});
