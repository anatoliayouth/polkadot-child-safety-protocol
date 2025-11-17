import { renderHook, act } from '@testing-library/react';
import { useForm } from '../useForm';

describe('useForm', () => {
  interface TestFormData {
    name: string;
    email: string;
  }

  const initialValues: TestFormData = {
    name: '',
    email: '',
  };

  const mockValidator = (values: TestFormData) => {
    const errors: { [key: string]: string } = {};
    if (!values.name) errors.name = 'Name is required';
    if (!values.email) errors.email = 'Email is required';
    return errors;
  };

  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with provided values', () => {
    const { result } = renderHook(() =>
      useForm({ initialValues, onSubmit: mockOnSubmit })
    );

    expect(result.current.values).toEqual(initialValues);
  });

  it('initializes empty errors and touched objects', () => {
    const { result } = renderHook(() =>
      useForm({ initialValues, onSubmit: mockOnSubmit })
    );

    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });

  it('updates values on change', () => {
    const { result } = renderHook(() =>
      useForm({ initialValues, onSubmit: mockOnSubmit })
    );

    act(() => {
      const event = {
        target: { name: 'name', value: 'John' },
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleChange(event);
    });

    expect(result.current.values.name).toBe('John');
  });

  it('marks field as touched on blur', () => {
    const { result } = renderHook(() =>
      useForm({ initialValues, onSubmit: mockOnSubmit })
    );

    act(() => {
      const event = {
        target: { name: 'name' },
      } as React.FocusEvent<HTMLInputElement>;
      result.current.handleBlur(event);
    });

    expect(result.current.touched.name).toBe(true);
  });

  it('validates field on blur', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        onSubmit: mockOnSubmit,
        validate: mockValidator,
      })
    );

    act(() => {
      const event = {
        target: { name: 'name' },
      } as React.FocusEvent<HTMLInputElement>;
      result.current.handleBlur(event);
    });

    expect(result.current.errors.name).toBe('Name is required');
  });

  it('calls onSubmit on form submission', async () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { name: 'John', email: 'john@example.com' },
        onSubmit: mockOnSubmit,
        validate: () => ({}),
      })
    );

    const formEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.FormEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSubmit(formEvent);
    });

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'John',
      email: 'john@example.com',
    });
  });

  it('does not submit if validation fails', async () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        onSubmit: mockOnSubmit,
        validate: mockValidator,
      })
    );

    const formEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.FormEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSubmit(formEvent);
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(result.current.errors.name).toBe('Name is required');
    expect(result.current.errors.email).toBe('Email is required');
  });

  it('resets form to initial values', () => {
    const { result } = renderHook(() =>
      useForm({ initialValues, onSubmit: mockOnSubmit })
    );

    act(() => {
      const event = {
        target: { name: 'name', value: 'John' },
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleChange(event);
    });

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });

  it('sets field value directly', () => {
    const { result } = renderHook(() =>
      useForm({ initialValues, onSubmit: mockOnSubmit })
    );

    act(() => {
      result.current.setFieldValue('name', 'Jane');
    });

    expect(result.current.values.name).toBe('Jane');
  });

  it('tracks isSubmitting state', async () => {
    const slowOnSubmit = jest.fn(
      () => new Promise(resolve => setTimeout(resolve, 50))
    );

    const { result } = renderHook(() =>
      useForm({
        initialValues: { name: 'John', email: 'john@example.com' },
        onSubmit: slowOnSubmit,
        validate: () => ({}),
      })
    );

    const formEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.FormEvent<HTMLFormElement>;

    act(() => {
      result.current.handleSubmit(formEvent);
    });

    expect(result.current.isSubmitting).toBe(true);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.isSubmitting).toBe(false);
  });

  it('determines isValid based on errors', async () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        onSubmit: mockOnSubmit,
        validate: mockValidator,
      })
    );

    expect(result.current.isValid).toBe(false);

    act(() => {
      result.current.setFieldValue('name', 'John');
      result.current.setFieldValue('email', 'john@example.com');
    });

    // Re-render to update isValid
    const { result: result2 } = renderHook(() =>
      useForm({
        initialValues: { name: 'John', email: 'john@example.com' },
        onSubmit: mockOnSubmit,
        validate: mockValidator,
      })
    );

    expect(result2.current.isValid).toBe(true);
  });
});
