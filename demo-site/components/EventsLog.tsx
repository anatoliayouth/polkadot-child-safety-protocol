import { useEffect, useRef } from 'react';
import { EventLog } from '../context/DemoState';
import { formatAddress } from '../hooks/useMockContracts';

interface EventsLogProps {
  events: EventLog[];
  maxHeight?: string;
}

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

const getEventIcon = (type: EventLog['type']): string => {
  switch (type) {
    case 'SET_CAP':
      return '💰';
    case 'SET_ALLOWLIST':
      return '📋';
    case 'FLAG':
      return '🚩';
    case 'UNFLAG':
      return '✅';
    case 'CHECK':
      return '🔍';
    default:
      return '📝';
  }
};

const getEventDescription = (event: EventLog): string => {
  switch (event.type) {
    case 'SET_CAP':
      return `Spend cap set to ${event.data.cap} DOT`;
    case 'SET_ALLOWLIST':
      return `Allowlist updated (${event.data.addresses.length} address${event.data.addresses.length !== 1 ? 'es' : ''})`;
    case 'FLAG':
      return `Flagged ${formatAddress(event.data.address)}: ${event.data.reason}`;
    case 'UNFLAG':
      return `Unflagged ${formatAddress(event.data.address)}`;
    case 'CHECK':
      return `Safety check on ${formatAddress(event.data.address)} (${event.data.amount} DOT)`;
    default:
      return 'Unknown event';
  }
};

const EventsLog: React.FC<EventsLogProps> = ({ events, maxHeight = '400px' }) => {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [events]);

  return (
    <div className="bg-white dark:bg-polkadotIndigo rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        <span className="mr-2">📜</span>
        Events Log
      </h3>
      <div
        ref={listRef}
        className="space-y-2 overflow-y-auto pr-2"
        style={{ maxHeight }}
        role="log"
        aria-live="polite"
        aria-label="Events log"
      >
        {events.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm italic text-center py-8">
            No events yet. Interact with the controls to see activity.
          </p>
        ) : (
          events.map(event => (
            <div
              key={event.id}
              className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-polkadotDark rounded-lg animate-slideIn hover:bg-gray-100 dark:hover:bg-opacity-70 transition-colors"
            >
              <span className="text-2xl" role="img" aria-label={event.type}>
                {getEventIcon(event.type)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white break-words">
                  {getEventDescription(event)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatTimestamp(event.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventsLog;
