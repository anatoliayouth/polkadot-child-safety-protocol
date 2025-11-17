import { render, screen } from '@testing-library/react';
import EventsLog from '../../components/EventsLog';
import type { EventLog } from '../../context/DemoState';

describe('EventsLog', () => {
  const mockEvents: EventLog[] = [
    {
      type: 'SET_CAP',
      data: { cap: 500 },
      timestamp: Date.now(),
      id: 'event-1'
    },
    {
      type: 'FLAG',
      data: {
        address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
        reason: 'Suspicious behavior'
      },
      timestamp: Date.now() - 1000,
      id: 'event-2'
    },
    {
      type: 'CHECK',
      data: {
        address: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
        amount: 100
      },
      timestamp: Date.now() - 2000,
      id: 'event-3'
    }
  ];

  it('renders a list of events with descriptions and timestamps', () => {
    render(<EventsLog events={mockEvents} />);

    expect(screen.getByText(/Spend cap set to 500 DOT/i)).toBeInTheDocument();
    expect(screen.getByText(/Flagged 5Grwva...utQY: Suspicious behavior/i)).toBeInTheDocument();
    expect(screen.getByText(/Safety check on 5FHneW...94ty \(100 DOT\)/i)).toBeInTheDocument();
  });

  it('displays empty state when no events are present', () => {
    render(<EventsLog events={[]} />);

    expect(screen.getByText(/No events yet/i)).toBeInTheDocument();
    expect(screen.getByText(/Interact with the controls to see activity/i)).toBeInTheDocument();
  });

  it('shows event icons for different event types', () => {
    render(<EventsLog events={mockEvents} />);

    const icons = screen.getAllByRole('img');
    expect(icons).toHaveLength(3);
    expect(icons[0]).toHaveAttribute('aria-label', 'SET_CAP');
    expect(icons[1]).toHaveAttribute('aria-label', 'FLAG');
    expect(icons[2]).toHaveAttribute('aria-label', 'CHECK');
  });

  it('applies custom maxHeight to the scrollable container', () => {
    const { container } = render(<EventsLog events={mockEvents} maxHeight="250px" />);

    const logContainer = container.querySelector('[role="log"]');
    expect(logContainer).toHaveStyle({ maxHeight: '250px' });
  });

  it('uses default maxHeight when not specified', () => {
    const { container } = render(<EventsLog events={mockEvents} />);

    const logContainer = container.querySelector('[role="log"]');
    expect(logContainer).toHaveStyle({ maxHeight: '400px' });
  });
});
