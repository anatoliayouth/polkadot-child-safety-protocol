import React, { useState } from 'react';
import { useForm } from '@hooks/useForm';
import { createValidator, ValidationRules } from '@utils/validation';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { AddGuardianFormData } from '@types/index';
import { apiClient } from '@services/api';

interface AddGuardianFormProps {
  childId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const validator = createValidator({
  address: [ValidationRules.required, ValidationRules.address],
  name: [ValidationRules.required, ValidationRules.minLength(2)],
  email: ValidationRules.email,
  permissionLevel: ValidationRules.required,
});

const permissionLevels = [
  { value: 'admin', label: 'Admin' },
  { value: 'moderator', label: 'Moderator' },
  { value: 'viewer', label: 'Viewer' },
];

export const AddGuardianForm: React.FC<AddGuardianFormProps> = ({ childId, onSuccess, onError }) => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm<AddGuardianFormData>({
    initialValues: {
      address: '',
      name: '',
      email: '',
      permissionLevel: 'viewer',
      childId,
    },
    validate: validator,
    onSubmit: async (values) => {
      setSuccessMessage('');
      setErrorMessage('');

      const response = await apiClient.addGuardian(values);
      if (response.success) {
        setSuccessMessage('Guardian added successfully!');
        form.resetForm();
        onSuccess?.();
      } else {
        const error = response.error || 'Failed to add guardian';
        setErrorMessage(error);
        onError?.(error);
      }
    },
  });

  return (
    <div className="card">
      <h2 id="add-guardian-heading" className="card-title">Add Guardian</h2>
      <form onSubmit={form.handleSubmit} aria-labelledby="add-guardian-heading">
        <FormInput
          label="Wallet Address"
          name="address"
          value={form.values.address}
          error={form.errors.address}
          touched={form.touched.address}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          placeholder="Enter blockchain address"
          required
        />

        <FormInput
          label="Guardian Name"
          name="name"
          value={form.values.name}
          error={form.errors.name}
          touched={form.touched.name}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          placeholder="Enter guardian's name"
          required
        />

        <FormInput
          label="Email Address (Optional)"
          name="email"
          type="email"
          value={form.values.email}
          error={form.errors.email}
          touched={form.touched.email}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          placeholder="guardian@example.com"
        />

        <FormSelect
          label="Permission Level"
          name="permissionLevel"
          value={form.values.permissionLevel}
          options={permissionLevels}
          error={form.errors.permissionLevel}
          touched={form.touched.permissionLevel}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          required
        />

        {successMessage && (
          <div className="alert alert--success" role="status">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="alert alert--error" role="alert">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={form.isSubmitting}
          className="btn btn--primary"
          aria-busy={form.isSubmitting}
        >
          {form.isSubmitting ? 'Adding...' : 'Add Guardian'}
        </button>
      </form>
    </div>
  );
};
