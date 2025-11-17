import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificationFeed } from '../NotificationFeed';
import * as notificationsModule from '@services/notifications';

jest.mock('@services/notifications');

describe('NotificationFeed', () => {
  const mockNotificationService = notificationsModule.notificationService as jest.Mocked<typeof notificationsModule.notificationService>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('does not render when there are no notifications', () => {
    mockNotificationService.subscribe.mockImplementation((callback) => {
      return jest.fn();
    });

    const { container } = render(<NotificationFeed />);
    expect(container.firstChild).toBeNull();
  });

  it('renders notification feed with message', async () => {
    let notificationCallback: any;

    mockNotificationService.subscribe.mockImplementation((callback) => {
      notificationCallback = callback;
      return jest.fn();
    });

    render(<NotificationFeed />);

    // Simulate receiving a notification
    const notification = {
      id: '1',
      childId: 'child-1',
      message: 'Test notification',
      timestamp: new Date(),
      read: false,
    };

    notificationCallback(notification);

    await waitFor(() => {
      expect(screen.getByText('Test notification')).toBeInTheDocument();
    });
  });

  it('displays multiple notifications', async () => {
    let notificationCallback: any;

    mockNotificationService.subscribe.mockImplementation((callback) => {
      notificationCallback = callback;
      return jest.fn();
    });

    render(<NotificationFeed />);

    const notification1 = {
      id: '1',
      childId: 'child-1',
      message: 'First notification',
      timestamp: new Date(),
      read: false,
    };

    const notification2 = {
      id: '2',
      childId: 'child-1',
      message: 'Second notification',
      timestamp: new Date(),
      read: false,
    };

    notificationCallback(notification1);
    notificationCallback(notification2);

    await waitFor(() => {
      expect(screen.getByText('First notification')).toBeInTheDocument();
      expect(screen.getByText('Second notification')).toBeInTheDocument();
    });
  });

  it('removes notification when dismiss button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    let notificationCallback: any;

    mockNotificationService.subscribe.mockImplementation((callback) => {
      notificationCallback = callback;
      return jest.fn();
    });

    render(<NotificationFeed />);

    const notification = {
      id: '1',
      childId: 'child-1',
      message: 'Test notification',
      timestamp: new Date(),
      read: false,
    };

    notificationCallback(notification);

    await waitFor(() => {
      expect(screen.getByText('Test notification')).toBeInTheDocument();
    });

    const dismissButton = screen.getByRole('button', { name: /dismiss/i });
    await user.click(dismissButton);

    await waitFor(() => {
      expect(screen.queryByText('Test notification')).not.toBeInTheDocument();
    });
  });

  it('clears all notifications when clear all button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    let notificationCallback: any;

    mockNotificationService.subscribe.mockImplementation((callback) => {
      notificationCallback = callback;
      return jest.fn();
    });

    render(<NotificationFeed />);

    const notification1 = {
      id: '1',
      childId: 'child-1',
      message: 'First notification',
      timestamp: new Date(),
      read: false,
    };

    const notification2 = {
      id: '2',
      childId: 'child-1',
      message: 'Second notification',
      timestamp: new Date(),
      read: false,
    };

    notificationCallback(notification1);
    notificationCallback(notification2);

    await waitFor(() => {
      expect(screen.getByText('First notification')).toBeInTheDocument();
    });

    const clearAllButton = screen.getByRole('button', { name: /clear all/i });
    await user.click(clearAllButton);

    await waitFor(() => {
      expect(screen.queryByText('First notification')).not.toBeInTheDocument();
      expect(screen.queryByText('Second notification')).not.toBeInTheDocument();
    });
  });

  it('auto-dismisses notifications after 5 seconds', async () => {
    let notificationCallback: any;

    mockNotificationService.subscribe.mockImplementation((callback) => {
      notificationCallback = callback;
      return jest.fn();
    });

    render(<NotificationFeed />);

    const notification = {
      id: '1',
      childId: 'child-1',
      message: 'Auto-dismiss notification',
      timestamp: new Date(),
      read: false,
    };

    notificationCallback(notification);

    await waitFor(() => {
      expect(screen.getByText('Auto-dismiss notification')).toBeInTheDocument();
    });

    jest.advanceTimersByTime(5000);

    await waitFor(() => {
      expect(screen.queryByText('Auto-dismiss notification')).not.toBeInTheDocument();
    });
  });

  it('renders with proper accessibility attributes', async () => {
    let notificationCallback: any;

    mockNotificationService.subscribe.mockImplementation((callback) => {
      notificationCallback = callback;
      return jest.fn();
    });

    render(<NotificationFeed />);

    const notification = {
      id: '1',
      childId: 'child-1',
      message: 'Test notification',
      timestamp: new Date(),
      read: false,
    };

    notificationCallback(notification);

    await waitFor(() => {
      const feed = screen.getByRole('region', { hidden: true });
      expect(feed).toHaveAttribute('aria-live', 'polite');
      expect(feed).toHaveAttribute('aria-label', 'Notifications');
    });
  });
});
