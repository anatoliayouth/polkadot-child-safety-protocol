import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormInput } from '../FormInput';

describe('FormInput', () => {
  const mockOnChange = jest.fn();
  const mockOnBlur = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnBlur.mockClear();
  });

  it('renders input with label', () => {
    render(
      <FormInput
        label="Test Label"
        name="test"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('displays required indicator when required prop is true', () => {
    render(
      <FormInput
        label="Test Label"
        name="test"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        required
      />
    );

    const requiredSpan = screen.getByLabelText('required');
    expect(requiredSpan).toBeInTheDocument();
  });

  it('displays error message when touched and error exists', () => {
    render(
      <FormInput
        label="Test Label"
        name="test"
        value=""
        error="This field is required"
        touched={true}
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );

    const errorMessage = screen.getByText('This field is required');
    expect(errorMessage).toHaveAttribute('role', 'alert');
  });

  it('does not display error message when not touched', () => {
    render(
      <FormInput
        label="Test Label"
        name="test"
        value=""
        error="This field is required"
        touched={false}
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );

    expect(screen.queryByText('This field is required')).not.toBeInTheDocument();
  });

  it('calls onChange when input value changes', async () => {
    const user = userEvent.setup();
    render(
      <FormInput
        label="Test Label"
        name="test"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );

    const input = screen.getByLabelText('Test Label');
    await user.type(input, 'test value');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('calls onBlur when input loses focus', async () => {
    const user = userEvent.setup();
    render(
      <FormInput
        label="Test Label"
        name="test"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );

    const input = screen.getByLabelText('Test Label');
    await user.click(input);
    await user.tab();

    expect(mockOnBlur).toHaveBeenCalled();
  });

  it('disables input when disabled prop is true', () => {
    render(
      <FormInput
        label="Test Label"
        name="test"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        disabled
      />
    );

    const input = screen.getByLabelText('Test Label') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('sets aria-invalid when error exists and touched', () => {
    render(
      <FormInput
        label="Test Label"
        name="test"
        value=""
        error="Error message"
        touched={true}
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );

    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders with correct input type', () => {
    render(
      <FormInput
        label="Email"
        name="email"
        type="email"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );

    const input = screen.getByLabelText('Email') as HTMLInputElement;
    expect(input.type).toBe('email');
  });
});
