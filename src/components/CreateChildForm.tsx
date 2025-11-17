import React, { useState } from 'react';
import { useForm } from '@hooks/useForm';
import { createValidator, ValidationRules } from '@utils/validation';
import { FormInput } from './FormInput';
import { CreateChildFormData } from '@types/index';
import { apiClient } from '@services/api';

interface CreateChildFormProps {
  onSuccess?: (childId: string) => void;
  onError?: (error: string) => void;
}

const validator = createValidator({
  name: [ValidationRules.required, ValidationRules.minLength(2)],
  did: ValidationRules.did,
});

export const CreateChildForm: React.FC<CreateChildFormProps> = ({ onSuccess, onError }) => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm<CreateChildFormData>({
    initialValues: {
      name: '',
      did: '',
    },
    validate: validator,
    onSubmit: async (values) => {
      setSuccessMessage('');
      setErrorMessage('');

      const response = await apiClient.createChild(values);
      if (response.success && response.data) {
        setSuccessMessage('Child profile created successfully!');
        form.resetForm();
        onSuccess?.(response.data.id);
      } else {
        const error = response.error || 'Failed to create child profile';
        setErrorMessage(error);
        onError?.(error);
      }
    },
  });

  return (
    <div className="card">
      <h2 id="create-child-heading" className="card-title">Create Child Profile</h2>
      <form onSubmit={form.handleSubmit} aria-labelledby="create-child-heading">
        <FormInput
          label="Child Name"
          name="name"
          value={form.values.name}
          error={form.errors.name}
          touched={form.touched.name}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          placeholder="Enter child's name"
          required
        />

        <FormInput
          label="DID (Optional)"
          name="did"
          value={form.values.did}
          error={form.errors.did}
          touched={form.touched.did}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          placeholder="did:kilt:..."
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
          {form.isSubmitting ? 'Creating...' : 'Create Profile'}
        </button>
      </form>
    </div>
  );
};
