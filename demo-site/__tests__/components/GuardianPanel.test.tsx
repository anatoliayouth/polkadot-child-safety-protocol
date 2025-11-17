import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import GuardianPanel from '../../components/GuardianPanel';
import { DemoStateProvider } from '../../context/DemoState';
import { act } from 'react';

describe('GuardianPanel', () => {
  const renderPanel = () =>
    render(
      <DemoStateProvider>
        <GuardianPanel />
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

  it('displays initial spend cap and allowlist', () => {
    renderPanel();

    expect(screen.getByText('1000 DOT')).toBeInTheDocument();

    const allowlist = screen.getByRole('list', { name: /Allowed addresses/i });
    const items = within(allowlist).getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('5FHneW46...M694ty');
    expect(items[1]).toHaveTextContent('5DAAnrj7...3PTXFy');
  });

});
