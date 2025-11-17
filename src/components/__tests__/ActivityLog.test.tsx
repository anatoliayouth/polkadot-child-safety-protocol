import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ActivityLog } from '../ActivityLog';
import * as apiModule from '@services/api';

jest.mock('@services/api');

describe('ActivityLog', () => {
  const mockApiClient = apiModule.apiClient as jest.Mocked<typeof apiModule.apiClient>;
  const mockOnError = jest.fn();

  const mockActivities = [
    {
      id: '1',
      childId: 'child-1',
      type: 'child_created' as const,
      description: 'Child profile created',
      timestamp: new Date('2023-12-01T10:00:00'),
      actor: 'Parent Account',
    },
    {
      id: '2',
      childId: 'child-1',
      type: 'guardian_added' as const,
      description: 'Guardian John added',
      timestamp: new Date('2023-12-02T11:00:00'),
      actor: 'Parent Account',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockApiClient.getActivityLog.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        success: true,
        data: [],
      }), 100))
    );

    render(<ActivityLog />);
    expect(screen.getByText(/loading activities/i)).toBeInTheDocument();
  });

  it('displays activity entries after loading', async () => {
    mockApiClient.getActivityLog.mockResolvedValue({
      success: true,
      data: mockActivities,
    });

    render(<ActivityLog />);

    await waitFor(() => {
      expect(screen.getByText('Child profile created')).toBeInTheDocument();
      expect(screen.getByText('Guardian John added')).toBeInTheDocument();
    });
  });

  it('displays error message on failed load', async () => {
    mockApiClient.getActivityLog.mockResolvedValue({
      success: false,
      error: 'Failed to load activities',
    });

    render(<ActivityLog onError={mockOnError} />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load activities')).toBeInTheDocument();
      expect(mockOnError).toHaveBeenCalledWith('Failed to load activities');
    });
  });

  it('displays empty state when no activities', async () => {
    mockApiClient.getActivityLog.mockResolvedValue({
      success: true,
      data: [],
    });

    render(<ActivityLog />);

    await waitFor(() => {
      expect(screen.getByText(/no activities yet/i)).toBeInTheDocument();
    });
  });

  it('displays activity timestamps', async () => {
    mockApiClient.getActivityLog.mockResolvedValue({
      success: true,
      data: mockActivities,
    });

    render(<ActivityLog />);

    await waitFor(() => {
      const timeElements = screen.getAllByRole('time');
      expect(timeElements.length).toBeGreaterThan(0);
    });
  });

  it('displays activity actor information', async () => {
    mockApiClient.getActivityLog.mockResolvedValue({
      success: true,
      data: mockActivities,
    });

    render(<ActivityLog />);

    await waitFor(() => {
      expect(screen.getByText(/Parent Account/i)).toBeInTheDocument();
    });
  });

  it('limits displayed items based on maxItems prop', async () => {
    const manyActivities = Array.from({ length: 20 }, (_, i) => ({
      ...mockActivities[0],
      id: `${i}`,
      timestamp: new Date(Date.now() - i * 1000),
    }));

    mockApiClient.getActivityLog.mockResolvedValue({
      success: true,
      data: manyActivities,
    });

    render(<ActivityLog maxItems={5} />);

    await waitFor(() => {
      const items = screen.getAllByRole('time');
      expect(items.length).toBeLessThanOrEqual(5);
    });
  });

  it('displays activity type labels correctly', async () => {
    mockApiClient.getActivityLog.mockResolvedValue({
      success: true,
      data: mockActivities,
    });

    render(<ActivityLog />);

    await waitFor(() => {
      expect(screen.getByText('Child Created')).toBeInTheDocument();
      expect(screen.getByText('Guardian Added')).toBeInTheDocument();
    });
  });

  it('fetches activities for specific child when childId is provided', async () => {
    mockApiClient.getActivityLog.mockResolvedValue({
      success: true,
      data: mockActivities,
    });

    render(<ActivityLog childId="child-1" />);

    await waitFor(() => {
      expect(mockApiClient.getActivityLog).toHaveBeenCalledWith('child-1');
    });
  });

  it('renders timeline structure correctly', async () => {
    mockApiClient.getActivityLog.mockResolvedValue({
      success: true,
      data: mockActivities,
    });

    const { container } = render(<ActivityLog />);

    await waitFor(() => {
      const timelineItems = container.querySelectorAll('.timeline-item');
      expect(timelineItems.length).toBeGreaterThan(0);
    });
  });
});
