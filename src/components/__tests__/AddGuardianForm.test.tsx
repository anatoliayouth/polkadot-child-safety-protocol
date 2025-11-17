import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddGuardianForm } from '../AddGuardianForm';
import * as apiModule from '@services/api';

jest.mock('@services/api');

describe('AddGuardianForm', () => {
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();
  const mockApiClient = apiModule.apiClient as jest.Mocked<typeof apiModule.apiClient>;
  const testChildId = 'child-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with all fields', () => {
    render(<AddGuardianForm childId={testChildId} />);

    expect(screen.getByLabelText(/wallet address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/guardian name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/permission level/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    mockApiClient.addGuardian.mockResolvedValue({
      success: true,
      data: {
        id: '1',
        address: '1AAAA',
        name: 'Guardian Name',
        email: 'guardian@example.com',
        permissionLevel: 'admin',
        childIds: [testChildId],
        createdAt: new Date(),
      },
    });

    render(<AddGuardianForm childId={testChildId} onSuccess={mockOnSuccess} />);

    await user.type(screen.getByLabelText(/wallet address/i), '1AAAApHg8q8F4Ky78iP8f6h3nVwj4RN3V8gS6JjFxA');
    await user.type(screen.getByLabelText(/guardian name/i), 'John Guardian');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');

    const permissionSelect = screen.getByLabelText(/permission level/i) as HTMLSelectElement;
    await user.selectOptions(permissionSelect, 'admin');

    const submitButton = screen.getByRole('button', { name: /add guardian/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockApiClient.addGuardian).toHaveBeenCalled();
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('displays error message on submission failure', async () => {
    const user = userEvent.setup();
    mockApiClient.addGuardian.mockResolvedValue({
      success: false,
      error: 'Invalid address format',
    });

    render(<AddGuardianForm childId={testChildId} onError={mockOnError} />);

    await user.type(screen.getByLabelText(/wallet address/i), 'invalid-address');
    await user.type(screen.getByLabelText(/guardian name/i), 'John Guardian');

    const submitButton = screen.getByRole('button', { name: /add guardian/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid address format')).toBeInTheDocument();
      expect(mockOnError).toHaveBeenCalledWith('Invalid address format');
    });
  });

  it('shows validation errors for required fields', async () => {
    const user = userEvent.setup();
    render(<AddGuardianForm childId={testChildId} />);

    const addressInput = screen.getByLabelText(/wallet address/i);
    await user.click(addressInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
    });
  });

  it('displays success message after successful submission', async () => {
    const user = userEvent.setup();
    mockApiClient.addGuardian.mockResolvedValue({
      success: true,
      data: {
        id: '1',
        address: '1AAAA',
        name: 'Guardian Name',
        email: 'guardian@example.com',
        permissionLevel: 'admin',
        childIds: [testChildId],
        createdAt: new Date(),
      },
    });

    render(<AddGuardianForm childId={testChildId} />);

    await user.type(screen.getByLabelText(/wallet address/i), '1AAAApHg8q8F4Ky78iP8f6h3nVwj4RN3V8gS6JjFxA');
    await user.type(screen.getByLabelText(/guardian name/i), 'John Guardian');

    const submitButton = screen.getByRole('button', { name: /add guardian/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/guardian added successfully/i)).toBeInTheDocument();
    });
  });

  it('resets form after successful submission', async () => {
    const user = userEvent.setup();
    mockApiClient.addGuardian.mockResolvedValue({
      success: true,
      data: {
        id: '1',
        address: '1AAAA',
        name: 'Guardian Name',
        email: 'guardian@example.com',
        permissionLevel: 'admin',
        childIds: [testChildId],
        createdAt: new Date(),
      },
    });

    render(<AddGuardianForm childId={testChildId} />);

    const addressInput = screen.getByLabelText(/wallet address/i) as HTMLInputElement;
    await user.type(addressInput, '1AAAApHg8q8F4Ky78iP8f6h3nVwj4RN3V8gS6JjFxA');
    await user.type(screen.getByLabelText(/guardian name/i), 'John Guardian');

    const submitButton = screen.getByRole('button', { name: /add guardian/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(addressInput.value).toBe('');
    });
  });

  it('disables submit button while submitting', async () => {
    const user = userEvent.setup();
    mockApiClient.addGuardian.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        success: true,
        data: {
          id: '1',
          address: '1AAAA',
          name: 'Guardian Name',
          email: 'guardian@example.com',
          permissionLevel: 'admin',
          childIds: [testChildId],
          createdAt: new Date(),
        },
      }), 100))
    );

    render(<AddGuardianForm childId={testChildId} />);

    await user.type(screen.getByLabelText(/wallet address/i), '1AAAApHg8q8F4Ky78iP8f6h3nVwj4RN3V8gS6JjFxA');
    await user.type(screen.getByLabelText(/guardian name/i), 'John Guardian');

    const submitButton = screen.getByRole('button', { name: /add guardian/i });
    await user.click(submitButton);

    expect(submitButton).toHaveAttribute('aria-busy', 'true');
  });
});
