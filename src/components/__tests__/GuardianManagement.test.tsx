import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GuardianManagement } from '../GuardianManagement';
import * as apiModule from '@services/api';

jest.mock('@services/api');

describe('GuardianManagement', () => {
  const mockApiClient = apiModule.apiClient as jest.Mocked<typeof apiModule.apiClient>;
  const mockOnError = jest.fn();
  const testChildId = 'child-1';

  const mockGuardians = [
    {
      id: 'guardian-1',
      address: '1AAAApHg8q8F4Ky78iP8f6h3nVwj4RN3V8gS6JjFxA',
      name: 'John Guardian',
      email: 'john@example.com',
      permissionLevel: 'admin' as const,
      childIds: [testChildId],
      createdAt: new Date(),
    },
    {
      id: 'guardian-2',
      address: '1BBBBpHg8q8F4Ky78iP8f6h3nVwj4RN3V8gS6JjFxB',
      name: 'Jane Moderator',
      email: 'jane@example.com',
      permissionLevel: 'moderator' as const,
      childIds: [testChildId],
      createdAt: new Date(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnError.mockClear();
  });

  it('renders loading state initially', () => {
    mockApiClient.getGuardians.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        success: true,
        data: [],
      }), 100))
    );

    render(<GuardianManagement childId={testChildId} />);
    expect(screen.getByText(/loading guardians/i)).toBeInTheDocument();
  });

  it('displays guardians after loading', async () => {
    mockApiClient.getGuardians.mockResolvedValue({
      success: true,
      data: mockGuardians,
    });

    render(<GuardianManagement childId={testChildId} />);

    await waitFor(() => {
      expect(screen.getByText('John Guardian')).toBeInTheDocument();
      expect(screen.getByText('Jane Moderator')).toBeInTheDocument();
    });
  });

  it('displays empty state when no guardians', async () => {
    mockApiClient.getGuardians.mockResolvedValue({
      success: true,
      data: [],
    });

    render(<GuardianManagement childId={testChildId} />);

    await waitFor(() => {
      expect(screen.getByText(/no guardians assigned yet/i)).toBeInTheDocument();
    });
  });

  it('displays error message on failed load', async () => {
    mockApiClient.getGuardians.mockResolvedValue({
      success: false,
      error: 'Failed to load guardians',
    });

    render(<GuardianManagement childId={testChildId} onError={mockOnError} />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load guardians')).toBeInTheDocument();
      expect(mockOnError).toHaveBeenCalledWith('Failed to load guardians');
    });
  });

  it('displays guardian information in table', async () => {
    mockApiClient.getGuardians.mockResolvedValue({
      success: true,
      data: mockGuardians,
    });

    render(<GuardianManagement childId={testChildId} />);

    await waitFor(() => {
      expect(screen.getByText('John Guardian')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('admin')).toBeInTheDocument();
    });
  });

  it('displays permission level badges', async () => {
    mockApiClient.getGuardians.mockResolvedValue({
      success: true,
      data: mockGuardians,
    });

    const { container } = render(<GuardianManagement childId={testChildId} />);

    await waitFor(() => {
      const badges = container.querySelectorAll('.badge');
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  it('removes guardian when remove button clicked', async () => {
    const user = userEvent.setup();
    mockApiClient.getGuardians.mockResolvedValue({
      success: true,
      data: mockGuardians,
    });

    mockApiClient.removeGuardian.mockResolvedValue({
      success: true,
    });

    render(<GuardianManagement childId={testChildId} />);

    await waitFor(() => {
      expect(screen.getByText('John Guardian')).toBeInTheDocument();
    });

    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    
    // Mock confirm dialog
    global.confirm = jest.fn(() => true);

    await user.click(removeButtons[0]);

    await waitFor(() => {
      expect(mockApiClient.removeGuardian).toHaveBeenCalledWith('guardian-1');
    });
  });

  it('shows confirmation dialog before removing guardian', async () => {
    const user = userEvent.setup();
    mockApiClient.getGuardians.mockResolvedValue({
      success: true,
      data: mockGuardians,
    });

    render(<GuardianManagement childId={testChildId} />);

    await waitFor(() => {
      expect(screen.getByText('John Guardian')).toBeInTheDocument();
    });

    global.confirm = jest.fn(() => false);

    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    await user.click(removeButtons[0]);

    expect(global.confirm).toHaveBeenCalled();
    expect(mockApiClient.removeGuardian).not.toHaveBeenCalled();
  });

  it('handles removal error gracefully', async () => {
    const user = userEvent.setup();
    mockApiClient.getGuardians.mockResolvedValue({
      success: true,
      data: mockGuardians,
    });

    mockApiClient.removeGuardian.mockResolvedValue({
      success: false,
      error: 'Failed to remove guardian',
    });

    render(<GuardianManagement childId={testChildId} onError={mockOnError} />);

    await waitFor(() => {
      expect(screen.getByText('John Guardian')).toBeInTheDocument();
    });

    global.confirm = jest.fn(() => true);

    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    await user.click(removeButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Failed to remove guardian')).toBeInTheDocument();
      expect(mockOnError).toHaveBeenCalledWith('Failed to remove guardian');
    });
  });

  it('fetches guardians for specific child', async () => {
    mockApiClient.getGuardians.mockResolvedValue({
      success: true,
      data: [],
    });

    render(<GuardianManagement childId={testChildId} />);

    await waitFor(() => {
      expect(mockApiClient.getGuardians).toHaveBeenCalledWith(testChildId);
    });
  });
});
