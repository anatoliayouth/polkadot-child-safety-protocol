import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateChildForm } from '../CreateChildForm';
import * as apiModule from '@services/api';

jest.mock('@services/api');

describe('CreateChildForm', () => {
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();
  const mockApiClient = apiModule.apiClient as jest.Mocked<typeof apiModule.apiClient>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with all fields', () => {
    render(<CreateChildForm />);

    expect(screen.getByLabelText(/child name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/did/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create profile/i })).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    mockApiClient.createChild.mockResolvedValue({
      success: true,
      data: {
        id: '1',
        name: 'Test Child',
        did: 'did:kilt:test',
        credentialStatus: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    render(<CreateChildForm onSuccess={mockOnSuccess} />);

    const nameInput = screen.getByLabelText(/child name/i);
    await user.type(nameInput, 'Test Child');

    const submitButton = screen.getByRole('button', { name: /create profile/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockApiClient.createChild).toHaveBeenCalledWith({
        name: 'Test Child',
        did: '',
      });
      expect(mockOnSuccess).toHaveBeenCalledWith('1');
    });
  });

  it('displays error message on submission failure', async () => {
    const user = userEvent.setup();
    mockApiClient.createChild.mockResolvedValue({
      success: false,
      error: 'Failed to create child',
    });

    render(<CreateChildForm onError={mockOnError} />);

    const nameInput = screen.getByLabelText(/child name/i);
    await user.type(nameInput, 'Test Child');

    const submitButton = screen.getByRole('button', { name: /create profile/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to create child')).toBeInTheDocument();
      expect(mockOnError).toHaveBeenCalledWith('Failed to create child');
    });
  });

  it('shows validation error for empty name', async () => {
    const user = userEvent.setup();
    render(<CreateChildForm />);

    const nameInput = screen.getByLabelText(/child name/i);
    await user.click(nameInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
    });
  });

  it('disables submit button while submitting', async () => {
    const user = userEvent.setup();
    mockApiClient.createChild.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        success: true,
        data: {
          id: '1',
          name: 'Test Child',
          did: 'did:kilt:test',
          credentialStatus: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }), 100))
    );

    render(<CreateChildForm />);

    const nameInput = screen.getByLabelText(/child name/i);
    await user.type(nameInput, 'Test Child');

    const submitButton = screen.getByRole('button', { name: /create profile/i });
    await user.click(submitButton);

    expect(submitButton).toHaveAttribute('aria-busy', 'true');
  });

  it('displays success message after successful submission', async () => {
    const user = userEvent.setup();
    mockApiClient.createChild.mockResolvedValue({
      success: true,
      data: {
        id: '1',
        name: 'Test Child',
        did: 'did:kilt:test',
        credentialStatus: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    render(<CreateChildForm />);

    const nameInput = screen.getByLabelText(/child name/i);
    await user.type(nameInput, 'Test Child');

    const submitButton = screen.getByRole('button', { name: /create profile/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/child profile created successfully/i)).toBeInTheDocument();
    });
  });

  it('resets form after successful submission', async () => {
    const user = userEvent.setup();
    mockApiClient.createChild.mockResolvedValue({
      success: true,
      data: {
        id: '1',
        name: 'Test Child',
        did: 'did:kilt:test',
        credentialStatus: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    render(<CreateChildForm />);

    const nameInput = screen.getByLabelText(/child name/i) as HTMLInputElement;
    await user.type(nameInput, 'Test Child');

    const submitButton = screen.getByRole('button', { name: /create profile/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(nameInput.value).toBe('');
    });
  });
});
